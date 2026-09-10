import cls from './UserCard.module.scss';
import { classNames } from '@/shared/lib/classNames/classNames';
import { useTranslation } from 'react-i18next';
import { Input } from '@/shared/ui/Input/Input';
import { RoleSelect } from '@/entities/Role';
import Loader from '@/shared/ui/Loader/Loader';
import { IProfile, ServerError } from '@/entities/Profile/model/types/profile';
import { VStack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text/Text';

interface UserCardProps {
    className?: string;
    data?: IProfile;
    error?: ServerError;
    isLoading?: boolean;
    readonly?: boolean;
    onChangeLastName?: (value?: string) => void;
    onChangeEmail?: (value?: string) => void;
    onChangePassword?: (value?: string) => void;
    onChangeFirsttName?: (value?: string) => void;
    onChangeAvatar?: (value?: string) => void;
    onChangeBirthYear?: (value?: string) => void;
    onChangePhoneNumber?: (value?: string) => void;
    onChangeTelegram?: (value?: string) => void;
    onChangePosition?: (value?: string) => void;
    onChangeSpecialization?: (value?: string) => void;
    onChangeBio?: (value?: string) => void;
    onUploadAvatarFile?: (file?: File) => void;
    isAvatarUploading?: boolean;
    onChangeIsAdmin?: (value: boolean) => void;
    onChangeIsDoctor?: (value: boolean) => void;
    roleError?: string;
}

export const UserCard = (props: UserCardProps) => {
    const {
        className,
        data,
        isLoading,
        readonly,
        onChangeFirsttName,
        onChangePassword,
        onChangeEmail,
        onChangeLastName,
        onChangeAvatar,
        onChangeBirthYear,
        onChangePhoneNumber,
        onChangeTelegram,
        onChangePosition,
        onChangeSpecialization,
        onChangeBio,
        onUploadAvatarFile,
        isAvatarUploading,
        onChangeIsAdmin,
        onChangeIsDoctor,
        roleError,
    } = props;
    const { t } = useTranslation('profile');

    if (isLoading) {
        return (
            <div className={classNames(cls.ProfileCard, { [cls.loading]: true }, [className])}>
                <Loader />
            </div>
        );
    }

    return (
        <>
            <VStack className={cls.UserCard} gap="16" max>
                <Input
                    value={data?.firstName}
                    placeholder={t('Ваше Имя')}
                    label={t('Имя')}
                    className={cls.input}
                    onChange={onChangeFirsttName}
                    readonly={readonly}
                    fullWidth
                />
                <Input
                    value={data?.lastName}
                    placeholder={t('Ваша фамилия')}
                    label={t('Фамилия')}
                    className={cls.input}
                    onChange={onChangeLastName}
                    readonly={readonly}
                    fullWidth
                />
                <Input
                    value={data?.email}
                    placeholder={t('Введите email')}
                    label={t('Email')}
                    className={cls.input}
                    onChange={onChangeEmail}
                    readonly={readonly}
                    fullWidth
                />
                <Input
                    value={data?.password}
                    placeholder={t('Введите пароль')}
                    label={t('Пароль')}
                    className={cls.input}
                    onChange={onChangePassword}
                    readonly={readonly}
                    fullWidth
                />
                <Input
                    value={data?.avatar}
                    label={t('Ссылка на аватар')}
                    placeholder={t('Введите ссылку на аватар')}
                    className={cls.input}
                    onChange={onChangeAvatar}
                    readonly={readonly}
                    fullWidth
                />
                {!readonly && (
                    <Input
                        type="file"
                        label="Загрузить фото с устройства"
                        accept="image/*"
                        className={cls.input}
                        onChange={(file) => {
                            if (file instanceof File) {
                                onUploadAvatarFile?.(file);
                            }
                        }}
                        fullWidth
                    />
                )}
                {isAvatarUploading && <Text text="Загрузка фото..." />}
                <Input
                    value={data?.birthYear ?? ''}
                    type="number"
                    label="Год рождения"
                    placeholder="Например: 1990"
                    className={cls.input}
                    onChange={onChangeBirthYear}
                    readonly={readonly}
                    fullWidth
                />
                <Input
                    value={data?.phoneNumber}
                    type="tel"
                    label="Телефон"
                    placeholder="+380..."
                    className={cls.input}
                    onChange={onChangePhoneNumber}
                    readonly={readonly}
                    fullWidth
                />
                <Input
                    value={data?.telegram}
                    label="Telegram"
                    placeholder="@username"
                    className={cls.input}
                    onChange={onChangeTelegram}
                    readonly={readonly}
                    fullWidth
                />
                <Input
                    value={data?.position}
                    label="Должность"
                    placeholder="Администратор / Врач / Менеджер"
                    className={cls.input}
                    onChange={onChangePosition}
                    readonly={readonly}
                    fullWidth
                />
                <Input
                    value={data?.specialization}
                    label="Специализация"
                    placeholder="Косметолог, трихолог..."
                    className={cls.input}
                    onChange={onChangeSpecialization}
                    readonly={readonly}
                    fullWidth
                />
                <Input
                    value={data?.bio}
                    label="О себе"
                    placeholder="Короткая информация о сотруднике"
                    className={cls.input}
                    onChange={onChangeBio}
                    readonly={readonly}
                    fullWidth
                />
                <RoleSelect
                    className={cls.input}
                    isAdmin={data?.isAdmin}
                    isDoctor={data?.isDoctor}
                    onChangeIsAdmin={onChangeIsAdmin}
                    onChangeIsDoctor={onChangeIsDoctor}
                    readonly={readonly}
                    error={roleError}
                />
            </VStack>
        </>
    );
};
