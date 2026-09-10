import { classNames } from '@/shared/lib/classNames/classNames';
import { useTranslation } from 'react-i18next';
import cls from './ClientForm.module.scss';
import { memo, useCallback, useEffect, useState } from 'react';
import { VStack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text/Text';
import { Button, ButtonTheme } from '@/shared/ui/Button';
import {
    DynamicModuleLoader,
    ReducersList,
} from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { clientActions, clientReducer } from '../../model/slices/clientSlice';
import { useSelector } from 'react-redux';
import { getAddClientForm } from '../../model/selectors/getAddClientForm/getAddClientForm';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { addClientData } from '../../model/services/addClientData/addClientData';
import { ClientCard } from '@/entities/Client';
import { ClientStatusKey } from '@/entities/ClientStatus';
import { toast } from 'react-toastify';
import { fetchClientById } from '@/entities/Client/model/services/fetchClientById/fetchClientById';
import { updateClientData } from '../../model/services/updateClientData/updateClientData';

interface AddClientFormProps {
    className?: string;
    onSuccess: () => void;
    reloadPage?: () => void;
    clientId?: string;
}

const initialReducers: ReducersList = {
    client: clientReducer,
};

const AddClientForm = memo((props: AddClientFormProps) => {
    const { className, onSuccess, reloadPage, clientId } = props;
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [file, setFile] = useState<File | null>(null);
    const isEditMode = Boolean(clientId);

    const formData = useSelector(getAddClientForm);

    const cleanForm = useCallback(() => {
        onChangeFirstName('');
        onChangeLastName('');
        onChangeBirthday('');
        onChangeEmail('');
    }, []);

    const onChangeFirstName = useCallback(
        (value?: string) => {
            dispatch(clientActions.updateProfile({ firstName: value ?? '' }));
        },
        [dispatch]
    );
    const onChangeLastName = useCallback(
        (value?: string) => {
            dispatch(clientActions.updateProfile({ lastName: value || '' }));
        },
        [dispatch]
    );
    const onChangeBirthday = useCallback(
        (value?: string) => {
            dispatch(clientActions.updateProfile({ birthday: value || '' }));
        },
        [dispatch]
    );
    const onChangePhoneNumber = useCallback(
        (value?: string) => {
            dispatch(clientActions.updateProfile({ phoneNumber: value || '' }));
        },
        [dispatch]
    );
    const onChangeAnamnesis = useCallback(
        (value?: string) => {
            dispatch(clientActions.updateProfile({ anamnesis: value || '' }));
        },
        [dispatch]
    );
    const onChangeDescription = useCallback(
        (value?: string) => {
            dispatch(clientActions.updateProfile({ description: value || '' }));
        },
        [dispatch]
    );
    const onChangeEmail = useCallback(
        (value?: string) => {
            dispatch(clientActions.updateProfile({ email: value || '' }));
        },
        [dispatch]
    );
    const onChangeSocial = useCallback(
        (value?: string) => {
            dispatch(clientActions.updateProfile({ social: value || '' }));
        },
        [dispatch]
    );
    const onChangeImage3D = useCallback(
        (value: boolean) => {
            dispatch(clientActions.updateProfile({ image_3d: value || false }));
        },
        [dispatch]
    );
    const onChangeDocument = useCallback(
        (value: boolean) => {
            dispatch(clientActions.updateProfile({ document: value || false }));
        },
        [dispatch]
    );
    const onChangeClientStatus = useCallback(
        (status: ClientStatusKey) => {
            dispatch(clientActions.updateProfile({ status }));
        },
        [dispatch]
    );
    const onChangeQuestionnaire = useCallback(
        (value: string) => {
            dispatch(clientActions.updateProfile({ questionnaire: value }));
        },
        [dispatch]
    );
    const onChangeImage = useCallback(
        (file?: File) => {
            if (file) {
                setFile(file);
            }
        },
        [dispatch]
    );

    const onSave = useCallback(async () => {
        const result = isEditMode && clientId
            ? await dispatch(updateClientData({ clientId, file }))
            : await dispatch(addClientData({ file }));

        if (result.meta.requestStatus === 'fulfilled') {
            onSuccess();
            reloadPage?.();
            cleanForm();
            toast.success(isEditMode ? t('Клиент успешно обновлен') : t('Клиент успешно добавлен'));
        }
    }, [isEditMode, clientId, dispatch, file, onSuccess, reloadPage, cleanForm, t]);

    useEffect(() => {
        if (!isEditMode || !clientId) {
            dispatch(clientActions.cleanForm());
            return;
        }

        dispatch(fetchClientById(clientId)).then((result) => {
            if (fetchClientById.fulfilled.match(result)) {
                dispatch(clientActions.updateProfile(result.payload));
            }
        });
    }, [isEditMode, clientId, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(clientActions.cleanForm());
        };
    }, [dispatch]);

    return (
        <DynamicModuleLoader reducers={initialReducers}>
            <div className={classNames(cls.AddClientForm, {}, [className])}>
                <VStack gap="24" align="center" className={cls.header}>
                    <Text
                        size="m"
                        title={isEditMode ? t('Редактирование клиента') : t('Добавление нового клиента')}
                        bold
                    />
                    <ClientCard
                        onChangeLastName={onChangeLastName}
                        onChangeClientStatus={onChangeClientStatus}
                        onChangeFirstName={onChangeFirstName}
                        onChangeBirthday={onChangeBirthday}
                        onChangePhoneNumber={onChangePhoneNumber}
                        onChangeEmail={onChangeEmail}
                        onChangeImage={onChangeImage}
                        onChangeAnamnesis={onChangeAnamnesis}
                        onChangeDescription={onChangeDescription}
                        onChangeImage3D={onChangeImage3D}
                        onChangeDocument={onChangeDocument}
                        onChangeSocial={onChangeSocial}
                        onChangeQuestionnaire={onChangeQuestionnaire}
                        data={formData}
                    />
                    <Button fullWidth onClick={onSave} theme={ButtonTheme.BACKGROUND_INVERTED}>
                        {isEditMode ? t('Сохранить') : t('Добавить')}
                    </Button>
                </VStack>
            </div>
        </DynamicModuleLoader>
    );
});

export default AddClientForm;
