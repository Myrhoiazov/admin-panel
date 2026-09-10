import { memo, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Page } from '@/widgets/Page/Page';
import { VStack } from '@/shared/ui/Stack';
import { Tabs, TabItem } from '@/shared/ui/Tabs/Tabs';
import { Card } from '@/shared/ui/Card/Card';
import { Text } from '@/shared/ui/Text/Text';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useSelector } from 'react-redux';
import {
    getPatientDetailsData,
    getPatientDetailsError,
    getPatientDetailsIsLoading,
    getPatientDetailsIsStatusUpdating,
} from '../../model/selectors/patientDetails';
import { fetchPatientById } from '../../model/services/fetchPatientById/fetchPatientById';
import { patientDetailsReducer } from '../../model/slices/patientDetailsSlice';
import { Button, ButtonTheme } from '@/shared/ui/Button';
import { updatePatientStatus } from '../../model/services/updatePatientStatus/updatePatientStatus';
import { Input } from '@/shared/ui/Input/Input';
import { Select, SelectOption } from '@/shared/ui/Select/Select';
import Textarea from '@/shared/ui/Textarea/Textarea';
import {
    PatientInteractionChannel,
    PatientInteractionType,
    PatientMediaType,
    PatientParameterKey,
} from '@/entities/Patient';
import { createPatientInteraction } from '../../model/services/createPatientInteraction/createPatientInteraction';
import { createPatientMedia } from '../../model/services/createPatientMedia/createPatientMedia';
import { createPatientMedicalParameter } from '../../model/services/createPatientMedicalParameter/createPatientMedicalParameter';
import { updatePatientInteraction } from '../../model/services/updatePatientInteraction/updatePatientInteraction';
import { deletePatientInteraction } from '../../model/services/deletePatientInteraction/deletePatientInteraction';
import { updatePatientMedia } from '../../model/services/updatePatientMedia/updatePatientMedia';
import { deletePatientMedia } from '../../model/services/deletePatientMedia/deletePatientMedia';
import { updatePatientMedicalParameter } from '../../model/services/updatePatientMedicalParameter/updatePatientMedicalParameter';
import { deletePatientMedicalParameter } from '../../model/services/deletePatientMedicalParameter/deletePatientMedicalParameter';
import { toast } from 'react-toastify';
import { getRouteClientDetails } from '@/shared/const/router';
import { ConfirmActionModal } from '@/features/confirmAction';
import cls from './PatientDetailsPage.module.scss';

interface PatientDetailsPageProps {
    className?: string;
}

type PatientTabValue = 'profile' | 'history' | 'media' | 'medical';
type DeleteTarget =
    | { type: 'interaction'; id: string; title: string; description: string }
    | { type: 'media'; id: string; title: string; description: string }
    | { type: 'medicalParameter'; id: string; title: string; description: string };

const reducers: ReducersList = {
    patientDetails: patientDetailsReducer,
};

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
});

const formatDate = (value?: string) => {
    if (!value) {
        return '-';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return dateFormatter.format(date);
};

const attendanceLabelMap: Record<string, string> = {
    UNKNOWN: 'Не отмечен',
    ARRIVED: 'Пришел',
    NO_SHOW: 'Не пришел',
    CANCELLED: 'Отменен',
};

const activityLabelMap: Record<string, string> = {
    ACTIVE: 'Активный',
    INACTIVE: 'Неактивный',
    ARCHIVED: 'Архив',
};

const PatientDetailsPage = ({ className }: PatientDetailsPageProps) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [activeTab, setActiveTab] = useState<PatientTabValue>('profile');
    const isLoading = useSelector(getPatientDetailsIsLoading);
    const isStatusUpdating = useSelector(getPatientDetailsIsStatusUpdating);
    const error = useSelector(getPatientDetailsError);
    const patient = useSelector(getPatientDetailsData);
    const [interactionType, setInteractionType] = useState<PatientInteractionType>('NOTE');
    const [interactionChannel, setInteractionChannel] = useState<PatientInteractionChannel>('OTHER');
    const [interactionTitle, setInteractionTitle] = useState('');
    const [interactionDetails, setInteractionDetails] = useState('');
    const [interactionError, setInteractionError] = useState('');

    const [mediaType, setMediaType] = useState<PatientMediaType>('PHOTO');
    const [mediaUrl, setMediaUrl] = useState('');
    const [mediaCaption, setMediaCaption] = useState('');
    const [mediaError, setMediaError] = useState('');

    const [parameterKey, setParameterKey] = useState<PatientParameterKey>('WRINKLES');
    const [parameterValue, setParameterValue] = useState('');
    const [parameterNote, setParameterNote] = useState('');
    const [parameterError, setParameterError] = useState('');
    const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

    const tabs = useMemo<TabItem[]>(
        () => [
            { value: 'profile', content: 'Профиль' },
            { value: 'history', content: 'История' },
            { value: 'media', content: 'Медиа' },
            { value: 'medical', content: 'Мед. параметры' },
        ],
        []
    );

    const interactionTypeOptions = useMemo<SelectOption<PatientInteractionType>[]>(
        () => [
            { value: 'NOTE', content: 'Заметка' },
            { value: 'CALL', content: 'Звонок' },
            { value: 'MESSAGE', content: 'Сообщение' },
            { value: 'VISIT', content: 'Визит' },
            { value: 'STATUS_CHANGE', content: 'Изменение статуса' },
        ],
        []
    );

    const interactionChannelOptions = useMemo<SelectOption<PatientInteractionChannel>[]>(
        () => [
            { value: 'OTHER', content: 'Другое' },
            { value: 'PHONE', content: 'Телефон' },
            { value: 'WHATSAPP', content: 'WhatsApp' },
            { value: 'TELEGRAM', content: 'Telegram' },
            { value: 'INSTAGRAM', content: 'Instagram' },
            { value: 'EMAIL', content: 'Email' },
            { value: 'VISIT', content: 'Офлайн визит' },
        ],
        []
    );

    const mediaTypeOptions = useMemo<SelectOption<PatientMediaType>[]>(
        () => [
            { value: 'PHOTO', content: 'Фото' },
            { value: 'VIDEO', content: 'Видео' },
            { value: 'DOCUMENT', content: 'Документ' },
            { value: 'OTHER', content: 'Другое' },
        ],
        []
    );

    const parameterKeyOptions = useMemo<SelectOption<PatientParameterKey>[]>(
        () => [
            { value: 'WRINKLES', content: 'Морщины' },
            { value: 'SMAS', content: 'SMAS' },
            { value: 'CONTOURS', content: 'Контуры' },
            { value: 'ELASTICITY', content: 'Эластичность' },
            { value: 'HYDRATION', content: 'Гидратация' },
            { value: 'PIGMENTATION', content: 'Пигментация' },
            { value: 'SCARS', content: 'Рубцы' },
            { value: 'OTHER', content: 'Другое' },
        ],
        []
    );

    useEffect(() => {
        if (id) {
            dispatch(fetchPatientById(id));
        }
    }, [dispatch, id]);

    const onCreateInteraction = () => {
        if (!id || !interactionDetails.trim()) {
            setInteractionError('Добавьте описание взаимодействия');
            return;
        }

        setInteractionError('');
        dispatch(
            createPatientInteraction({
                patientId: id,
                type: interactionType,
                channel: interactionChannel,
                title: interactionTitle.trim() || undefined,
                details: interactionDetails.trim(),
            })
        )
            .unwrap()
            .then(() => {
                toast.success('Взаимодействие добавлено');
            })
            .catch(() => {
                toast.error('Не удалось добавить взаимодействие');
            });

        setInteractionTitle('');
        setInteractionDetails('');
    };

    const onCreateMedia = () => {
        if (!id || !mediaUrl.trim()) {
            setMediaError('Укажите URL файла');
            return;
        }

        setMediaError('');
        dispatch(
            createPatientMedia({
                patientId: id,
                type: mediaType,
                url: mediaUrl.trim(),
                caption: mediaCaption.trim() || undefined,
            })
        )
            .unwrap()
            .then(() => {
                toast.success('Медиа добавлено');
            })
            .catch(() => {
                toast.error('Не удалось добавить медиа');
            });

        setMediaUrl('');
        setMediaCaption('');
    };

    const onCreateMedicalParameter = () => {
        if (!id || !parameterValue.trim()) {
            setParameterError('Укажите значение параметра');
            return;
        }

        setParameterError('');
        dispatch(
            createPatientMedicalParameter({
                patientId: id,
                key: parameterKey,
                value: parameterValue.trim(),
                note: parameterNote.trim() || undefined,
            })
        )
            .unwrap()
            .then(() => {
                toast.success('Параметр добавлен');
            })
            .catch(() => {
                toast.error('Не удалось добавить параметр');
            });

        setParameterValue('');
        setParameterNote('');
    };

    const onEditInteraction = (interactionId: string, currentTitle?: string, currentDetails?: string) => {
        if (!id) {
            return;
        }

        const title = window.prompt('Новый заголовок', currentTitle || '');
        const details = window.prompt('Новые детали', currentDetails || '');

        if (details === null) {
            return;
        }

        dispatch(
            updatePatientInteraction({
                patientId: id,
                interactionId,
                title: title || undefined,
                details: details || undefined,
            })
        )
            .unwrap()
            .then(() => toast.success('Взаимодействие обновлено'))
            .catch(() => toast.error('Не удалось обновить взаимодействие'));
    };

    const onDeleteInteraction = (interactionId: string) => {
        setDeleteTarget({
            type: 'interaction',
            id: interactionId,
            title: 'Удалить взаимодействие?',
            description: 'Это действие нельзя отменить.',
        });
    };

    const onEditMedia = (mediaId: string, currentUrl: string, currentCaption?: string) => {
        if (!id) {
            return;
        }

        const url = window.prompt('Новый URL', currentUrl);
        const caption = window.prompt('Новая подпись', currentCaption || '');

        if (!url) {
            return;
        }

        dispatch(
            updatePatientMedia({
                patientId: id,
                mediaId,
                url,
                caption: caption || undefined,
            })
        )
            .unwrap()
            .then(() => toast.success('Медиа обновлено'))
            .catch(() => toast.error('Не удалось обновить медиа'));
    };

    const onDeleteMedia = (mediaId: string) => {
        setDeleteTarget({
            type: 'media',
            id: mediaId,
            title: 'Удалить медиа?',
            description: 'Это действие нельзя отменить.',
        });
    };

    const onEditMedicalParameter = (
        parameterId: string,
        currentValue: string,
        currentNote?: string
    ) => {
        if (!id) {
            return;
        }

        const value = window.prompt('Новое значение', currentValue);
        const note = window.prompt('Новый комментарий', currentNote || '');

        if (!value) {
            return;
        }

        dispatch(
            updatePatientMedicalParameter({
                patientId: id,
                parameterId,
                value,
                note: note || undefined,
            })
        )
            .unwrap()
            .then(() => toast.success('Параметр обновлен'))
            .catch(() => toast.error('Не удалось обновить параметр'));
    };

    const onDeleteMedicalParameter = (parameterId: string) => {
        setDeleteTarget({
            type: 'medicalParameter',
            id: parameterId,
            title: 'Удалить медицинский параметр?',
            description: 'Это действие нельзя отменить.',
        });
    };

    const onCloseDeleteConfirm = () => {
        setDeleteTarget(null);
    };

    const onConfirmDelete = async () => {
        if (!id || !deleteTarget) {
            return;
        }

        try {
            if (deleteTarget.type === 'interaction') {
                await dispatch(deletePatientInteraction({ patientId: id, interactionId: deleteTarget.id })).unwrap();
                toast.success('Взаимодействие удалено');
            }

            if (deleteTarget.type === 'media') {
                await dispatch(deletePatientMedia({ patientId: id, mediaId: deleteTarget.id })).unwrap();
                toast.success('Медиа удалено');
            }

            if (deleteTarget.type === 'medicalParameter') {
                await dispatch(deletePatientMedicalParameter({ patientId: id, parameterId: deleteTarget.id })).unwrap();
                toast.success('Параметр удален');
            }

            setDeleteTarget(null);
        } catch {
            if (deleteTarget.type === 'interaction') {
                toast.error('Не удалось удалить взаимодействие');
            }

            if (deleteTarget.type === 'media') {
                toast.error('Не удалось удалить медиа');
            }

            if (deleteTarget.type === 'medicalParameter') {
                toast.error('Не удалось удалить параметр');
            }
        }
    };

    if (!id) {
        return (
            <Page className={classNames(cls.PatientDetailsPage, {}, [className])}>
                <Text title="ID пациента не указан" size="l" bold />
            </Page>
        );
    }

    if (isLoading) {
        return (
            <Page className={classNames(cls.PatientDetailsPage, {}, [className])}>
                <Text title="Загрузка карточки пациента..." size="l" bold />
            </Page>
        );
    }

    if (error) {
        return (
            <Page className={classNames(cls.PatientDetailsPage, {}, [className])}>
                <Text title="Не удалось загрузить карточку пациента" size="l" bold />
                <Text text={error || 'Неизвестная ошибка'} />
            </Page>
        );
    }

    return (
        <DynamicModuleLoader reducers={reducers}>
            <Page className={classNames(cls.PatientDetailsPage, {}, [className])}>
                <VStack max gap="24">
                    <Button
                        theme={ButtonTheme.OUTLINE}
                        onClick={() => {
                            if (id) {
                                navigate(getRouteClientDetails(id));
                            }
                        }}
                    >
                        Вернуться в профиль клиента
                    </Button>
                    <VStack gap="8" align="start">
                        <Text title="Карточка пациента" size="l" bold />
                        <Text text={`ID пациента: ${id}`} />
                    </VStack>

                    <Tabs
                        tabs={tabs}
                        value={activeTab}
                        onTabClick={(tab) => setActiveTab(tab.value as PatientTabValue)}
                    />

                    <Card max padding="24" className={cls.contentCard}>
                        {activeTab === 'profile' && (
                            <VStack gap="16" align="start">
                                <Text title="Профиль пациента" size="m" bold />
                                <Text text={`${patient?.firstName || ''} ${patient?.lastName || ''}`} />
                                <Text text={`Телефон: ${patient?.phoneNumber || '-'}`} />
                                <Text text={`Email: ${patient?.email || '-'}`} />
                                <Text text={`Био: ${patient?.bio || '-'}`} />
                                <Text text={`Анамнез: ${patient?.anamnesis || '-'}`} />
                                <Text
                                    text={`Статус посещения: ${
                                        attendanceLabelMap[patient?.attendanceStatus || 'UNKNOWN']
                                    }`}
                                />
                                <Text
                                    text={`Активность: ${
                                        activityLabelMap[patient?.activityStatus || 'ACTIVE']
                                    }`}
                                />
                                <div className={cls.actions}>
                                    <Button
                                        disabled={isStatusUpdating}
                                        theme={ButtonTheme.BACKGROUND}
                                        onClick={() =>
                                            dispatch(
                                                updatePatientStatus({
                                                    patientId: id,
                                                    attendanceStatus: 'ARRIVED',
                                                })
                                            )
                                                .unwrap()
                                                .then(() => toast.success('Статус: пришел'))
                                                .catch(() =>
                                                    toast.error('Не удалось обновить статус')
                                                )
                                        }
                                    >
                                        Отметить: пришел
                                    </Button>
                                    <Button
                                        disabled={isStatusUpdating}
                                        theme={ButtonTheme.OUTLINE}
                                        onClick={() =>
                                            dispatch(
                                                updatePatientStatus({
                                                    patientId: id,
                                                    attendanceStatus: 'NO_SHOW',
                                                })
                                            )
                                                .unwrap()
                                                .then(() => toast.success('Статус: не пришел'))
                                                .catch(() =>
                                                    toast.error('Не удалось обновить статус')
                                                )
                                        }
                                    >
                                        Отметить: не пришел
                                    </Button>
                                    <Button
                                        disabled={isStatusUpdating}
                                        theme={ButtonTheme.OUTLINE}
                                        onClick={() =>
                                            dispatch(
                                                updatePatientStatus({
                                                    patientId: id,
                                                    activityStatus: 'ACTIVE',
                                                })
                                            )
                                                .unwrap()
                                                .then(() => toast.success('Пациент активен'))
                                                .catch(() =>
                                                    toast.error('Не удалось обновить статус')
                                                )
                                        }
                                    >
                                        Активный
                                    </Button>
                                    <Button
                                        disabled={isStatusUpdating}
                                        theme={ButtonTheme.OUTLINE}
                                        onClick={() =>
                                            dispatch(
                                                updatePatientStatus({
                                                    patientId: id,
                                                    activityStatus: 'INACTIVE',
                                                })
                                            )
                                                .unwrap()
                                                .then(() => toast.success('Пациент неактивен'))
                                                .catch(() =>
                                                    toast.error('Не удалось обновить статус')
                                                )
                                        }
                                    >
                                        Неактивный
                                    </Button>
                                </div>
                            </VStack>
                        )}
                        {activeTab === 'history' && (
                            <VStack gap="8" align="start">
                                <Text title="История взаимодействий" size="m" bold />
                                <Card max padding="16">
                                    <VStack gap="16" max>
                                        <Select
                                            label="Тип взаимодействия"
                                            options={interactionTypeOptions}
                                            value={interactionType}
                                            onChange={setInteractionType}
                                        />
                                        <Select
                                            label="Канал"
                                            options={interactionChannelOptions}
                                            value={interactionChannel}
                                            onChange={setInteractionChannel}
                                        />
                                        <Input
                                            fullWidth
                                            label="Заголовок"
                                            placeholder="Короткое название события"
                                            value={interactionTitle}
                                            onChange={setInteractionTitle}
                                        />
                                        <Textarea
                                            fullWidth
                                            placeholder="Детали взаимодействия"
                                            value={interactionDetails}
                                            onChange={setInteractionDetails}
                                        />
                                        {interactionError && (
                                            <Text text={interactionError} variant="error" size="s" />
                                        )}
                                        <Button onClick={onCreateInteraction} theme={ButtonTheme.BACKGROUND}>
                                            Добавить взаимодействие
                                        </Button>
                                    </VStack>
                                </Card>
                                {patient?.interactions.length ? (
                                    patient.interactions.map((item) => (
                                        <Card key={item.id} max padding="16">
                                            <VStack gap="4" align="start">
                                                <Text text={`${item.type}${item.channel ? ` • ${item.channel}` : ''}`} />
                                                <Text text={item.title || '-'} />
                                                <Text text={item.details || '-'} />
                                                <Text text={`Создано: ${formatDate(item.createdAt)}`} />
                                                <div className={cls.itemActions}>
                                                    <Button
                                                        theme={ButtonTheme.OUTLINE}
                                                        onClick={() =>
                                                            onEditInteraction(
                                                                item.id,
                                                                item.title,
                                                                item.details
                                                            )
                                                        }
                                                    >
                                                        Редактировать
                                                    </Button>
                                                    <Button
                                                        theme={ButtonTheme.OUTLINE_RED}
                                                        onClick={() => onDeleteInteraction(item.id)}
                                                    >
                                                        Удалить
                                                    </Button>
                                                </div>
                                            </VStack>
                                        </Card>
                                    ))
                                ) : (
                                    <Text text="Нет записей о взаимодействиях." />
                                )}
                            </VStack>
                        )}
                        {activeTab === 'media' && (
                            <VStack gap="8" align="start">
                                <Text title="Фото и видео" size="m" bold />
                                <Card max padding="16">
                                    <VStack gap="16" max>
                                        <Select
                                            label="Тип файла"
                                            options={mediaTypeOptions}
                                            value={mediaType}
                                            onChange={setMediaType}
                                        />
                                        <Input
                                            fullWidth
                                            label="URL файла"
                                            placeholder="/upload/clients/example.jpg"
                                            value={mediaUrl}
                                            onChange={setMediaUrl}
                                        />
                                        <Input
                                            fullWidth
                                            label="Подпись"
                                            placeholder="До процедуры, фронтальный ракурс"
                                            value={mediaCaption}
                                            onChange={setMediaCaption}
                                        />
                                        {mediaError && <Text text={mediaError} variant="error" size="s" />}
                                        <Button onClick={onCreateMedia} theme={ButtonTheme.BACKGROUND}>
                                            Добавить медиа
                                        </Button>
                                    </VStack>
                                </Card>
                                {patient?.media.length ? (
                                    patient.media.map((item) => (
                                        <Card key={item.id} max padding="16">
                                            <VStack gap="4" align="start">
                                                <Text text={`${item.type} • ${item.url}`} />
                                                <Text text={item.caption || '-'} />
                                                <Text text={`Дата: ${formatDate(item.capturedAt || item.createdAt)}`} />
                                                <div className={cls.itemActions}>
                                                    <Button
                                                        theme={ButtonTheme.OUTLINE}
                                                        onClick={() =>
                                                            onEditMedia(
                                                                item.id,
                                                                item.url,
                                                                item.caption
                                                            )
                                                        }
                                                    >
                                                        Редактировать
                                                    </Button>
                                                    <Button
                                                        theme={ButtonTheme.OUTLINE_RED}
                                                        onClick={() => onDeleteMedia(item.id)}
                                                    >
                                                        Удалить
                                                    </Button>
                                                </div>
                                            </VStack>
                                        </Card>
                                    ))
                                ) : (
                                    <Text text="Медиа пока нет." />
                                )}
                            </VStack>
                        )}
                        {activeTab === 'medical' && (
                            <VStack gap="8" align="start">
                                <Text title="Медицинские параметры" size="m" bold />
                                <Card max padding="16">
                                    <VStack gap="16" max>
                                        <Select
                                            label="Параметр"
                                            options={parameterKeyOptions}
                                            value={parameterKey}
                                            onChange={setParameterKey}
                                        />
                                        <Input
                                            fullWidth
                                            label="Значение"
                                            placeholder="Умеренные динамические морщины"
                                            value={parameterValue}
                                            onChange={setParameterValue}
                                        />
                                        <Textarea
                                            fullWidth
                                            placeholder="Комментарий врача"
                                            value={parameterNote}
                                            onChange={setParameterNote}
                                        />
                                        {parameterError && (
                                            <Text text={parameterError} variant="error" size="s" />
                                        )}
                                        <Button onClick={onCreateMedicalParameter} theme={ButtonTheme.BACKGROUND}>
                                            Добавить параметр
                                        </Button>
                                    </VStack>
                                </Card>
                                {patient?.medicalParameters.length ? (
                                    patient.medicalParameters.map((item) => (
                                        <Card key={item.id} max padding="16">
                                            <VStack gap="4" align="start">
                                                <Text text={`${item.key}: ${item.value}`} />
                                                <Text text={item.note || '-'} />
                                                <Text text={`Зафиксировано: ${formatDate(item.recordedAt)}`} />
                                                <div className={cls.itemActions}>
                                                    <Button
                                                        theme={ButtonTheme.OUTLINE}
                                                        onClick={() =>
                                                            onEditMedicalParameter(
                                                                item.id,
                                                                item.value,
                                                                item.note
                                                            )
                                                        }
                                                    >
                                                        Редактировать
                                                    </Button>
                                                    <Button
                                                        theme={ButtonTheme.OUTLINE_RED}
                                                        onClick={() =>
                                                            onDeleteMedicalParameter(item.id)
                                                        }
                                                    >
                                                        Удалить
                                                    </Button>
                                                </div>
                                            </VStack>
                                        </Card>
                                    ))
                                ) : (
                                    <Text text="Параметры пока не заполнены." />
                                )}
                            </VStack>
                        )}
                    </Card>
                </VStack>
            </Page>
            <ConfirmActionModal
                isOpen={Boolean(deleteTarget)}
                onClose={onCloseDeleteConfirm}
                onConfirm={onConfirmDelete}
                title={deleteTarget?.title || 'Удалить запись?'}
                description={deleteTarget?.description}
                cancelText="Отменить"
                confirmText="Удалить"
            />
        </DynamicModuleLoader>
    );
};

export default memo(PatientDetailsPage);
