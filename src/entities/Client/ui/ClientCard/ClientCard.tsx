import { useTranslation } from 'react-i18next';
import { memo, useCallback } from 'react';
import { Input } from '@/shared/ui/Input/Input';
import { ClientStatusSelect, ClientStatusKey } from '@/entities/ClientStatus';
import { Client } from '@/entities/Client';
import Textarea from '@/shared/ui/Textarea/Textarea';
import CheckBox from '@/shared/ui/CheckBox/CheckBox';
import { VStack } from '@/shared/ui/Stack';
import cls from './ClientCard.module.scss';
import { QUESTIONNAIRE_ITEMS, parseQuestionnaire } from '../../model/consts/questionnaire';

export interface ClientCardProps {
    className?: string;
    data?: Client;
    error?: string;
    isLoading?: boolean;
    readonly?: boolean;
    onChangeLastName?: (value?: string) => void;
    onChangeFirstName?: (value?: string) => void;
    onChangeCity?: (value?: string) => void;
    onChangeEmail?: (value?: string) => void;
    onChangeBirthday?: (value?: string) => void;
    onChangePhoneNumber?: (value?: string) => void;
    onChangeAnamnesis?: (value?: string) => void;
    onChangeSocial?: (value?: string) => void;
    onChangeDescription?: (value?: string) => void;
    onChangeImage3D?: (value: boolean) => void;
    onChangeDocument?: (value: boolean) => void;
    onChangeQuestionnaire?: (value: string) => void;
    onChangeImage?: (value?: File) => void;
    onChangeClientStatus?: (status: ClientStatusKey) => void;
}

export const ClientCard = memo((props: ClientCardProps) => {
    const {
        className,
        data,
        readonly,
        onChangeFirstName,
        onChangeLastName,
        onChangeBirthday,
        onChangeEmail,
        onChangeImage,
        onChangePhoneNumber,
        onChangeClientStatus,
        onChangeAnamnesis,
        onChangeDescription,
        onChangeImage3D,
        onChangeSocial,
        onChangeQuestionnaire,
    } = props;
    const { t } = useTranslation();

    const questionnaireData = parseQuestionnaire(data?.questionnaire);

    const onToggleQuestionnaire = useCallback((item: string, checked: boolean) => {
        const next = { ...questionnaireData };
        if (checked) {
            next[item] = new Date().toISOString();
        } else {
            delete next[item];
        }
        onChangeQuestionnaire?.(JSON.stringify(next));
        if (item === 'Фото 3Д') onChangeImage3D?.(checked);
    }, [questionnaireData, onChangeQuestionnaire, onChangeImage3D]);

    return (
        <VStack max gap="16" className={cls.ClientCard}>
            <Input
                fullWidth
                label="Имя"
                autofocus
                type="text"
                placeholder={t('Имя')}
                onChange={onChangeFirstName}
                value={data?.firstName ?? ''}
            />
            <Input
                fullWidth
                label="Фамилия"
                type="text"
                placeholder={t('Фамилия')}
                onChange={onChangeLastName}
                value={data?.lastName}
            />
            <Input
                fullWidth
                label="День Рождения"
                type="date"
                placeholder={t('12.02.2025')}
                onChange={onChangeBirthday}
                value={data?.birthday ?? ''}
            />
            <Input
                fullWidth
                label="Номер тел."
                type="text"
                placeholder={t('097-123-45-67')}
                onChange={onChangePhoneNumber}
                value={data?.phoneNumber ?? ''}
            />
            <Input
                fullWidth
                label="E-mail"
                type="text"
                placeholder={t('example@gmail.com')}
                onChange={onChangeEmail}
                value={data?.email ?? ''}
            />
            <Input
                fullWidth
                label="Социальные сети"
                type="text"
                placeholder={t('Вставьте ссылки на социальные сети')}
                onChange={onChangeSocial}
                value={data?.social ?? ''}
            />
            <Textarea
                placeholder="Анамнез пациента:"
                fullWidth
                value={data?.anamnesis}
                onChange={onChangeAnamnesis}
            />
            <Textarea
                placeholder="Характеристики пациента:"
                fullWidth
                value={data?.description}
                onChange={onChangeDescription}
            />

            <div className={cls.QuestionnaireBlock}>
                <div className={cls.QuestionnairTitle}>Документы клиента</div>
                <div className={cls.QuestionnaireGrid}>
                    {QUESTIONNAIRE_ITEMS.map((item) => {
                        const checked = item in questionnaireData
                            || (item === 'Фото 3Д' && Boolean(data?.image_3d));
                        return (
                            <CheckBox
                                key={item}
                                value={checked}
                                onChange={(val) => onToggleQuestionnaire(item, val)}
                                label={item}
                                compact
                            />
                        );
                    })}
                </div>
            </div>

            <ClientStatusSelect
                onChange={onChangeClientStatus}
                value={data?.status}
                readonly={readonly}
            />

            <Input
                fullWidth
                label="Загрузить фото"
                type="file"
                placeholder={t('Загрузите фото')}
                onChange={(file) => {
                    onChangeImage?.(file as File);
                }}
            />
        </VStack>
    );
});

export default ClientCard;
