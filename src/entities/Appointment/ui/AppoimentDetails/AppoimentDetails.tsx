import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import s from './AppoimentDetails.module.scss';
import { Appointment, AppointmentImageDto } from '../../model/types/appoiment';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/ui/Text/Text';
import { Card } from '@/shared/ui/Card/Card';
import { VStack } from '@/shared/ui/Stack';
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton';
import { AppImage } from '@/shared/ui/AppImage';
import CheckBox from '@/shared/ui/CheckBox/CheckBox';
import { Button, ButtonTheme } from '@/shared/ui/Button';
import { $apiPrivate } from '@/shared/api/api';
import { toast } from 'react-toastify';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { QUESTIONNAIRE_ITEMS, parseQuestionnaire, formatQuestionnaireDate } from '@/entities/Client/model/consts/questionnaire';

interface AppoimentDetailsProps {
    className?: string;
    appoiment?: Appointment;
    error?: string;
    isLoading?: boolean;
}

interface AppoimentElementProps {
    appoiment: Appointment;
}

const AppoimentDetailsSkeleton = () => {
    return (
        <Card className={s.card} padding="32" fullWidth>
            <VStack gap="16" max>
                <Skeleton width={300} height={32} />
                <Skeleton width="100%" height={120} />
                <Skeleton width="100%" height={180} />
            </VStack>
        </Card>
    );
};

const formatDateTime = (value?: string) => {
    if (!value) {
        return '-';
    }

    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
};

const formatTime = (value?: string) => {
    if (!value) {
        return '-';
    }

    return new Intl.DateTimeFormat('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
};

const statusText: Record<NonNullable<Appointment['status']>, string> = {
    SCHEDULED: 'Запланирован',
    COMPLETED: 'Завершен',
    CANCELLED: 'Отменен',
    NO_SHOW: 'Не пришел',
};

const FIELD_LABELS: Record<string, string> = {
    note: 'Описание',
    clientConfirmed: 'Клиент подтвердил',
    documentsChecklist: 'Список документов',
    documentsLocked: 'Фиксация документов',
    status: 'Статус',
    startAt: 'Дата начала',
    endAt: 'Дата окончания',
    durationMin: 'Длительность',
    discountAmount: 'Скидка',
    finalAmount: 'Итоговая сумма',
    paymentMethod: 'Способ оплаты',
    procedureId: 'Процедура',
    doctorId: 'Доктор',
    clientId: 'Клиент',
    changeLog: 'История',
};

const translateChangedBy = (who: string) => {
    if (!who || who === 'system') return 'Система';
    if (who === 'ui') return 'Интерфейс';
    return who;
};

const translateFields = (fields: string[]) =>
    fields.map((f) => FIELD_LABELS[f] ?? f).join(', ');

const AppoimentElement = ({ appoiment }: AppoimentElementProps) => {
    const { t } = useTranslation();
    const [note, setNote] = useState(appoiment.note || '');
    const [images, setImages] = useState<AppointmentImageDto[]>(
        (appoiment.images || []).filter((img): img is AppointmentImageDto => !(img instanceof File))
    );
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const onUploadImages = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || !files.length || !appoiment.id) return;
        try {
            setIsUploading(true);
            const formData = new FormData();
            Array.from(files).forEach((f) => formData.append('images', f));
            const { data } = await $apiPrivate.post<AppointmentImageDto[]>(
                `/appointments/${appoiment.id}/images`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } },
            );
            setImages(data);
            toast.success('Фото добавлены');
        } catch {
            toast.error('Не удалось загрузить фото');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }, [appoiment.id]);

    const [confirmImageId, setConfirmImageId] = useState<number | null>(null);

    const onDeleteImage = useCallback(async (imageId: number) => {
        if (!appoiment.id) return;
        try {
            await $apiPrivate.delete(`/appointments/${appoiment.id}/images/${imageId}`);
            setImages((prev) => prev.filter((img) => img.id !== imageId));
            toast.success('Фото удалено');
        } catch {
            toast.error('Не удалось удалить фото');
        }
    }, [appoiment.id]);

    const changeHistory = useMemo(() => {
        if (!appoiment.changeLog) {
            return [];
        }
        try {
            const parsed = JSON.parse(appoiment.changeLog);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }, [appoiment.changeLog]);

    const procedureNames = appoiment.procedures?.map((p) => p.procedure?.name).filter(Boolean).join(', ') || '';
    const createdAt = formatDateTime(appoiment.createdAt);
    const appointmentDate = formatDateTime(appoiment.startAt);
    const appointmentTime = appoiment.startAt
        ? `${formatTime(appoiment.startAt)}${appoiment.endAt ? ` - ${formatTime(appoiment.endAt)}` : ''}`
        : '-';

    const onSave = useCallback(async () => {
        if (!appoiment.id) {
            return;
        }
        try {
            const doctorName = [appoiment.doctor?.firstName, appoiment.doctor?.lastName]
                .filter(Boolean).join(' ') || 'Врач';
            await $apiPrivate.patch(`/appointments/${appoiment.id}`, {
                note,
                changedBy: doctorName,
            });
            toast.success('Данные сеанса сохранены');
        } catch (e) {
            toast.error('Не удалось сохранить изменения');
        }
    }, [appoiment.id, note]);

    return (
        <Card padding="0" fullWidth className={s.detailsCard}>
            <div className={s.header}>
                <div>
                    <Text title={procedureNames || 'Сеанс'} bold />
                    <p className={s.subtitle}>
                        Создан: {createdAt}
                    </p>
                </div>
                {appoiment.status && (
                    <span className={classNames(s.statusBadge, {}, [s[appoiment.status]])}>
                        {statusText[appoiment.status]}
                    </span>
                )}
            </div>

            <div className={s.summaryGrid}>
                <div className={s.summaryItem}>
                    <span>Клиент</span>
                    <strong>{t(appoiment.client?.firstName || '-')}</strong>
                </div>
                <div className={s.summaryItem}>
                    <span>Доктор</span>
                    <strong>{t(appoiment.doctor?.firstName || '-')}</strong>
                </div>
                <div className={s.summaryItem}>
                    <span>Процедура</span>
                    <strong>{t(procedureNames || '-')}</strong>
                </div>
                <div className={s.summaryItem}>
                    <span>Дата сеанса</span>
                    <strong>{appointmentDate}</strong>
                </div>
                <div className={s.summaryItem}>
                    <span>Время</span>
                    <strong>{appointmentTime}</strong>
                </div>
                <div className={s.summaryItem}>
                    <span>Длительность</span>
                    <strong>{appoiment.durationMin ? `${appoiment.durationMin} минут` : '-'}</strong>
                </div>
            </div>

            {(appoiment.finalAmount != null || appoiment.discountAmount != null) && (
                <div className={s.financialBlock}>
                    {appoiment.discountAmount != null && Number(appoiment.discountAmount) > 0 && (
                        <div className={s.financialRow}>
                            <span>Скидка</span>
                            <span>−{Number(appoiment.discountAmount).toLocaleString('ru-RU')} ₴</span>
                        </div>
                    )}
                    {appoiment.paymentMethod && (
                        <div className={s.financialRow}>
                            <span>Способ оплаты</span>
                            <span>{String(appoiment.paymentMethod)}</span>
                        </div>
                    )}
                    <div className={s.financialTotal}>
                        <span>Итоговая сумма</span>
                        <strong>{Number(appoiment.finalAmount ?? 0).toLocaleString('ru-RU')} ₴</strong>
                    </div>
                </div>
            )}

            {appoiment.client && (() => {
                const qData = parseQuestionnaire(appoiment.client.questionnaire);
                return (
                    <section className={s.section}>
                        <Text title="Документы клиента" size="s" bold />
                        <div className={s.questionnaireGrid}>
                            {QUESTIONNAIRE_ITEMS.map((item) => {
                                const checked = item in qData
                                    || (item === 'Фото 3Д' && Boolean(appoiment.client?.image_3d));
                                const dateStr = qData[item] ? formatQuestionnaireDate(qData[item]) : '';
                                return (
                                    <div key={item} title={dateStr ? `Отмечено: ${dateStr}` : undefined}>
                                        <CheckBox label={item} value={checked} readOnly compact />
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                );
            })()}

            <section className={s.section}>
                <div className={s.galleryHeader}>
                    <Text title="Фото сеанса" size="s" bold />
                    <button
                        className={s.uploadBtn}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                    >
                        {isUploading ? 'Загрузка...' : '+ Добавить фото'}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                        onChange={onUploadImages}
                    />
                </div>
                {images.length > 0 ? (
                    <div className={s.gallery}>
                        {images.map((img) => (
                            <span key={img.id} className={s.imageWrap}>
                                <AppImage
                                    src={img.url}
                                    className={s.image}
                                    alt="Фото сеанса"
                                    errorFallback={<span className={s.imageFallback}>Фото недоступно</span>}
                                    fallback={<span className={s.imageFallback}>Загрузка</span>}
                                />
                                <button
                                    className={s.imageDeleteBtn}
                                    onClick={() => setConfirmImageId(img.id)}
                                    title="Удалить фото"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                ) : (
                    <div className={s.emptyState}>Фото пока не добавлены</div>
                )}
            </section>

            <section className={s.section}>
                <Text title="Описание" size="s" bold />
                <textarea
                    className={s.textarea}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Комментарий к сеансу"
                />
            </section>

            <div className={s.saveRow}>
                <Button className={s.saveButton} theme={ButtonTheme.BACKGROUND_INVERTED} onClick={onSave}>
                    Сохранить изменения
                </Button>
            </div>

            <section className={s.section}>
                <Text title="История изменений" size="s" bold />
                {changeHistory.length === 0 && <div className={s.emptyState}>Пока нет изменений</div>}
                {[...changeHistory].reverse().map((row: any, idx: number) => (
                    <div key={`${row.at || 'row'}-${idx}`} className={s.historyItem}>
                        <div className={s.historyMeta}>
                            <span className={s.historyDate}>
                                {row.at ? new Date(row.at).toLocaleString('ru-RU') : '-'}
                            </span>
                            <span className={s.historyAuthor}>
                                {translateChangedBy(row.changedBy || 'system')}
                            </span>
                        </div>
                        {Array.isArray(row.fields) && row.fields.length > 0 && (
                            <div className={s.historyFields}>
                                {row.fields.map((f: string) => (
                                    <span key={f} className={s.historyTag}>
                                        {FIELD_LABELS[f] ?? f}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </section>
            <ConfirmModal
                isOpen={confirmImageId !== null}
                message="Удалить это фото? Это действие нельзя отменить."
                confirmText="Удалить"
                onConfirm={() => {
                    if (confirmImageId !== null) onDeleteImage(confirmImageId);
                    setConfirmImageId(null);
                }}
                onCancel={() => setConfirmImageId(null)}
            />
        </Card>
    );
};

export const AppoimentDetails = memo((props: AppoimentDetailsProps) => {
    const { t } = useTranslation();
    const { className, appoiment, isLoading, error } = props;

    let content;

    if (isLoading) {
        content = <AppoimentDetailsSkeleton />;
    } else if (error || !appoiment) {
        content = <Text title="Клиента не существует" align="center" />;
    } else {
        content = <AppoimentElement appoiment={appoiment} />;
    }

    return <div className={classNames(s.AppoimentDetails, {}, [className])}>{content}</div>;
});
