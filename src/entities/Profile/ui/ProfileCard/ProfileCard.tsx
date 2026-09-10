import cls from './ProfileCard.module.scss';
import { classNames, Mods } from '@/shared/lib/classNames/classNames';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/ui/Text/Text';
import { Input } from '@/shared/ui/Input/Input';
import { getAccessLabel, RoleSelect } from '@/entities/Role';
import Loader from '@/shared/ui/Loader/Loader';
import { Avatar } from '@/shared/ui/Avatar/Avatar';
import { IProfile, ServerError } from '@/entities/Profile/model/types/profile';
import Textarea from '@/shared/ui/Textarea/Textarea';

interface ProfileCardProps {
    className?: string;
    data?: IProfile;
    error?: ServerError;
    isLoading?: boolean;
    readonly?: boolean;
    onChangeLastname?: (value?: string) => void;
    onChangeEmail?: (value?: string) => void;
    onChangeFirstname?: (value?: string) => void;
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
    roleReadonly?: boolean;
}

export const ProfileCard = (props: ProfileCardProps) => {
    const {
        className,
        data,
        isLoading,
        error,
        readonly,
        onChangeFirstname,
        onChangeEmail,
        onChangeLastname,
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
        roleReadonly,
    } = props;
    const { t } = useTranslation('profile');

    if (isLoading) {
        return (
            <div className={classNames(cls.ProfileCard, { [cls.loading]: true }, [className])}>
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className={classNames(cls.ProfileCard, {}, [className, cls.error])}>
                <Text
                    variant={'error'}
                    title={t('Произошла ошибка при загрузке профиля')}
                    text={t('Попробуйте обновить страницу')}
                    align={'center'}
                />
            </div>
        );
    }

    const mods: Mods = {
        [cls.editing]: !readonly,
    };

    const fullName = [data?.firstName, data?.lastName].filter(Boolean).join(' ').trim();
    const roleText = getAccessLabel({ isAdmin: data?.isAdmin, isDoctor: data?.isDoctor });

    const renderReadonlyField = (label: string, value?: string | number) => (
        <div className={cls.readonlyField}>
            <span className={cls.readonlyLabel}>{label}</span>
            <span className={cls.readonlyValue}>{value || '—'}</span>
        </div>
    );

    return (
        <div className={classNames(cls.ProfileCard, mods, [className])}>
            <div className={cls.data}>
                <div className={cls.topCard}>
                    <div className={cls.avatarWrapper}>
                        <Avatar src={data?.avatar} size={72} />
                    </div>
                    <div className={cls.personInfo}>
                        <h3 className={cls.personName}>{fullName || data?.email || 'Сотрудник'}</h3>
                        <p className={cls.personMeta}>{roleText}</p>
                    </div>
                </div>

                {!readonly && (
                    <div className={cls.avatarEditRow}>
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
                        />
                        <Input
                            value={data?.avatar}
                            placeholder={t('Введите ссылку на аватар')}
                            className={cls.input}
                            onChange={onChangeAvatar}
                            readonly={readonly}
                        />
                    </div>
                )}
                {isAvatarUploading && <Text text="Загрузка фото..." className={cls.uploadNote} />}

                <div className={cls.section}>
                    <p className={cls.sectionTitle}>Основное</p>
                    <div className={cls.grid}>
                        {readonly ? (
                            <>
                                {renderReadonlyField('Имя', data?.firstName)}
                                {renderReadonlyField('Фамилия', data?.lastName)}
                                {renderReadonlyField('Email', data?.email)}
                                {renderReadonlyField('Год рождения', data?.birthYear)}
                                {renderReadonlyField('Телефон', data?.phoneNumber)}
                                {renderReadonlyField('Telegram', data?.telegram)}
                            </>
                        ) : (
                            <>
                                <Input value={data?.firstName} placeholder={t('Ваше имя')} className={cls.input} onChange={onChangeFirstname} readonly={readonly} />
                                <Input value={data?.lastName} placeholder={t('Ваша фамилия')} className={cls.input} onChange={onChangeLastname} readonly={readonly} />
                                <Input value={data?.email} placeholder={t('Введите email')} className={cls.input} onChange={onChangeEmail} readonly={readonly} />
                                <Input value={data?.birthYear ?? ''} type="number" placeholder="Год рождения" className={cls.input} onChange={onChangeBirthYear} readonly={readonly} />
                                <Input value={data?.phoneNumber} type="tel" placeholder="Телефон" className={cls.input} onChange={onChangePhoneNumber} readonly={readonly} />
                                <Input value={data?.telegram} placeholder="Telegram" className={cls.input} onChange={onChangeTelegram} readonly={readonly} />
                            </>
                        )}
                    </div>
                </div>

                <div className={cls.section}>
                    <p className={cls.sectionTitle}>Работа</p>
                    <div className={cls.grid}>
                        {readonly ? (
                            <>
                                {renderReadonlyField('Должность', data?.position)}
                                {renderReadonlyField('Специализация', data?.specialization)}
                                {renderReadonlyField('Роль', roleText)}
                            </>
                        ) : (
                            <>
                                <Input value={data?.position} placeholder="Должность" className={cls.input} onChange={onChangePosition} readonly={readonly} />
                                <Input value={data?.specialization} placeholder="Специализация" className={cls.input} onChange={onChangeSpecialization} readonly={readonly} />
                                <div className={cls.roleRow}>
                                    <RoleSelect
                                        className={cls.input}
                                        isAdmin={data?.isAdmin}
                                        isDoctor={data?.isDoctor}
                                        onChangeIsAdmin={onChangeIsAdmin}
                                        onChangeIsDoctor={onChangeIsDoctor}
                                        readonly={roleReadonly ?? readonly}
                                        error={roleError}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    {readonly ? (
                        renderReadonlyField('О себе', data?.bio)
                    ) : (
                        <Textarea
                            value={data?.bio || ''}
                            placeholder="О себе"
                            className={cls.bio}
                            onChange={onChangeBio}
                            readonly={readonly}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
