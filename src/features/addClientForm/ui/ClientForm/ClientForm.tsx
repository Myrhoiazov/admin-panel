import { classNames } from 'shared/lib/classNames/classNames';
import { useTranslation } from 'react-i18next';
import cls from './ClientForm.module.scss';
import { memo, useCallback, useState } from 'react';
import { VStack } from 'shared/ui/Stack';
import { Text } from 'shared/ui/Text/Text';
import { Button, ButtonTheme } from 'shared/ui/Button';
import {
    DynamicModuleLoader,
    ReducersList,
} from 'shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { clientActions, clientReducer } from '../../model/slices/clientSlice';
import { useSelector } from 'react-redux';
import { getAddClientForm } from '../../model/selectors/getAddClientForm/getAddClientForm';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { addClientData } from '../../model/services/addClientData/addClientData';
import { ClientCard } from 'entities/Client';
import { ClientStatusKey } from 'entities/ClientStatus';
import { toast } from 'react-toastify';

interface AddClientFormProps {
    className?: string;
    onSuccess: () => void;
    reloadPage?: () => void;
}

const initialReducers: ReducersList = {
    client: clientReducer,
};

const AddClientForm = memo((props: AddClientFormProps) => {
    const { className, onSuccess, reloadPage } = props;
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [file, setFile] = useState<File | null>(null);

    const formData = useSelector(getAddClientForm);

    const cleanForm = useCallback(() => {
        onChangeFirstName('');
        onChangeLastName('');
        onChangeBirthday('');
        onChangeEmail('');
    }, [onSuccess]);

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
    const onChangeAvatar = useCallback(
        (file?: File) => {
            if (file) {
                setFile(file);
            }
        },
        [dispatch]
    );

    const onSave = useCallback(async () => {
        const result = await dispatch(addClientData({ file }));
        if (result.meta.requestStatus === 'fulfilled') {
            onSuccess();
            reloadPage?.();
            cleanForm();
            toast.success(t('Клиент успешно добавлен'));
        }
    }, [onSuccess, file, cleanForm, dispatch, reloadPage]);

    return (
        <DynamicModuleLoader reducers={initialReducers}>
            <div className={classNames(cls.AddClientForm, {}, [className])}>
                <VStack gap="24" align="center" className={cls.header}>
                    <Text size="m" title={t('Добавление нового клиента')} bold />
                    <ClientCard
                        onChangeLastName={onChangeLastName}
                        onChangeClientStatus={onChangeClientStatus}
                        onChangeFirstName={onChangeFirstName}
                        onChangeBirthday={onChangeBirthday}
                        onChangePhoneNumber={onChangePhoneNumber}
                        onChangeEmail={onChangeEmail}
                        onChangeAvatar={onChangeAvatar}
                        onChangeAnamnesis={onChangeAnamnesis}
                        onChangeDescription={onChangeDescription}
                        onChangeImage3D={onChangeImage3D}
                        onChangeDocument={onChangeDocument}
                        onChangeSocial={onChangeSocial}
                        data={formData}
                    />
                    <Button fullWidth onClick={onSave} theme={ButtonTheme.BACKGROUND_INVERTED}>
                        {t('Добавить')}
                    </Button>
                </VStack>
            </div>
        </DynamicModuleLoader>
    );
});

export default AddClientForm;
