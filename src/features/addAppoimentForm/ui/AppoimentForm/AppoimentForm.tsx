import { classNames } from 'shared/lib/classNames/classNames';
import { useTranslation } from 'react-i18next';
import cls from './AppoimentForm.module.scss';
import { memo, useCallback, useState } from 'react';
import { VStack } from 'shared/ui/Stack';
import { Text } from 'shared/ui/Text/Text';
import { Button, ButtonTheme } from 'shared/ui/Button';
import {
    DynamicModuleLoader,
    ReducersList,
} from 'shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { appoimentActions, appoimentReducer } from '../../model/slices/appoimentSlice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { AppointmentCard } from 'entities/Appointment';
import { getAddAppoimentProcedures } from '../../model/selectors/getAddAppoimentProcedures/getAddAppoimentProcedures';
import { Procedure } from 'entities/Procedure';
import { addAppoiment } from '../../model/services/addAppoiment/addAppoiment';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect';
import { fetchProceduresList } from '../../model/services/fetchProceduresList/fetchProceduresList';
import { getAddAppoimentForm } from 'features/addAppoimentForm/model/selectors/getAddAppoimentForm/getAddClientForm';
import { fetchClientsList } from '../../model/services/fetchClientsList/fetchClientsList';
import { getAddAppoimentClients } from '../../model/selectors/getAddAppoimentClients/getAddAppoimentClients';
import { Client } from 'entities/Client/model/types/client';
import { User } from 'entities/User';
import { getAddAppoimentDoctors } from '../../model/selectors/getAddAppoimentDocters/getAddAppoimentDocters';
import { fetchDoctorsList } from '../../model/services/fetchDoctorsList/fetchDoctorsList';

interface AppoimentFormProps {
    className?: string;
    onSuccess: () => void;
    reloadPage?: () => void;
}

const initialReducers: ReducersList = {
    addAppoimentForm: appoimentReducer,
};

const AppoimentForm = memo((props: AppoimentFormProps) => {
    const { className, onSuccess, reloadPage } = props;
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [file, setFile] = useState<File | null>(null);

    useInitialEffect(() => {
        dispatch(fetchProceduresList());
        dispatch(fetchClientsList());
        dispatch(fetchDoctorsList());
    });

    const procedures = useSelector(getAddAppoimentProcedures);
    const clients = useSelector(getAddAppoimentClients);
    const docters = useSelector(getAddAppoimentDoctors);
    const formData = useSelector(getAddAppoimentForm);

    const onChangeProcedure = useCallback(
        (value?: Procedure) => {
            dispatch(appoimentActions.updateAppoiment({ procedureId: value?.id }));
        },
        [dispatch]
    );

    const onChangeDoctor = useCallback(
        (value?: User) => {
            dispatch(appoimentActions.updateAppoiment({ doctorId: value?.id }));
        },
        [dispatch]
    );
    const onChangeClient = useCallback(
        (value?: Client) => {
            dispatch(appoimentActions.updateAppoiment({ clientId: value?.id }));
        },
        [dispatch]
    );

    const onChangeNote = useCallback(
        (value?: string) => {
            dispatch(appoimentActions.updateAppoiment({ note: value }));
        },
        [dispatch]
    );

    const onSave = useCallback(async () => {
        const result = await dispatch(addAppoiment({ file }));
        if (result.meta.requestStatus === 'fulfilled') {
            onSuccess();
            reloadPage?.();
            // cleanForm();
        }
    }, [onSuccess, file]);

    const onChangeImage = useCallback(
        (file?: File) => {
            if (file) {
                setFile(file);
            }
        },
        [dispatch]
    );

    return (
        <DynamicModuleLoader reducers={initialReducers}>
            <div className={classNames(cls.AppoimentForm, {}, [className])}>
                <VStack gap="24" align="center" className={cls.header}>
                    <Text size="m" title={t('Создать новую запись')} bold />
                    <AppointmentCard
                        onChangeProcedure={onChangeProcedure}
                        onChangeClient={onChangeClient}
                        onChangeNote={onChangeNote}
                        onChangeDoctor={onChangeDoctor}
                        data={formData}
                        procedures={procedures}
                        onChangeImage={onChangeImage}
                        clients={clients}
                        doctors={docters}
                    />
                    <Button fullWidth onClick={onSave} theme={ButtonTheme.BACKGROUND_INVERTED}>
                        {t('Добавить')}
                    </Button>
                </VStack>
            </div>
        </DynamicModuleLoader>
    );
});

export default AppoimentForm;
