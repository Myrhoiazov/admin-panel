import { classNames } from 'shared/lib/classNames/classNames';
import { useTranslation } from 'react-i18next';
import { memo } from 'react';
import { Input } from 'shared/ui/Input/Input';
import { ClientStatusSelect, ClientStatusKey } from 'entities/ClientStatus';
import { Client } from 'entities/Client';
import Textarea from 'shared/ui/Textarea/Textarea';
import CheckBox from 'shared/ui/CheckBox/CheckBox';
import { on } from 'events';

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
    onChangeAvatar?: (value?: File) => void;
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
        onChangeAvatar,
        onChangePhoneNumber,
        onChangeClientStatus,
        onChangeAnamnesis,
        onChangeDescription,
        onChangeImage3D,
        onChangeDocument,
        onChangeSocial,
    } = props;
    const { t } = useTranslation();

    return (
        <>
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
            <CheckBox
                value={data?.image_3d ?? false}
                onChange={onChangeImage3D}
                label="Наличие 3d фото :"
            />
            <CheckBox
                value={data?.document ?? false}
                onChange={onChangeDocument}
                label="Наличие документа :"
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
                onChange={(value: string | File) => {
                    if (value instanceof File) {
                        onChangeAvatar?.(value);
                    }
                }}
            />
        </>
    );
});

export default ClientCard;
