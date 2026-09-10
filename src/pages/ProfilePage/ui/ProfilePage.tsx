import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/classNames/classNames';
import {
    DynamicModuleLoader,
    ReducersList,
} from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import {
    fetchProfileData,
    getProfileError,
    getProfileLoading,
    getProfileValidateErrors,
    profileActions,
    ProfileCard,
    profileReducer,
} from '@/entities/Profile';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useSelector } from 'react-redux';
import { getProfileForm } from '@/entities/Profile/model/selectors/getProfileForm/getProfileForm';
import { getProfileReadonly } from '@/entities/Profile/model/selectors/getProfileReadonly/getProfileReadonly';
import { ProfilePageHeader } from './ProfilePageHeader/ProfilePageHeader';
import { Country } from '@/entities/Country';
import { Text } from '@/shared/ui/Text/Text';
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect';
import { useParams } from 'react-router-dom';
import { Page } from '@/widgets/Page/Page';
import { $apiPrivate } from '@/shared/api/api';
import { toast } from 'react-toastify';
import { getUserAuthData, userActions } from '@/entities/User';
import { VStack } from '@/shared/ui/Stack';
import { DoctorAppointments } from './DoctorAppointments/DoctorAppointments';
import { DoctorClients } from './DoctorClients/DoctorClients';
import { ChangePasswordForm } from './ChangePasswordForm/ChangePasswordForm';
import { TelegramLinkSection } from './TelegramLinkSection/TelegramLinkSection';
import { doctorAppointmentsReducer } from '../model';
import cls from './ProfilePage.module.scss';

const reducers: ReducersList = {
    profile: profileReducer,
    doctorAppointments: doctorAppointmentsReducer,
};

interface ProfilePageProps {
    className?: string;
}

const ProfilePage = ({ className }: ProfilePageProps) => {
    const { t } = useTranslation('profile');
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const formData = useSelector(getProfileForm);
    const isLoading = useSelector(getProfileLoading);
    const error = useSelector(getProfileError);
    const readonly = useSelector(getProfileReadonly);
    const authData = useSelector(getUserAuthData);
    const validateErrors = useSelector(getProfileValidateErrors);
    const [isAvatarUploading, setIsAvatarUploading] = useState(false);

    const validateErrorsTranslate = {
        INCORRECT_USER_DATA: t('incorrect_user_data'),
        INCORRECT_AGE: t('incorrect_age'),
        INCORRECT_COUNTRY: t('incorrect_country'),
        INCORRECT_CITY: t('incorrect_city'),
        INCORRECT_USERNAME: t('incorrect_username'),
        NO_DATA: t('incorrect_data'),
        INCORRECT_EMAIL: t('incorrect_email'),
        INCORRECT_PASSWORD: t('incorrect_password'),
        SERVER_ERROR: t('server_error'),
        EMAIL_ALREADY_EXISTS: t('email_already_exists'),
        NO_ACCESS_ROLE: t('no_access_role'),
    };

    useInitialEffect(() => {
        if (id) {
            dispatch(fetchProfileData(id));
        }
    });

    const onChangeFirstname = useCallback(
        (value?: string) => {
            dispatch(profileActions.updateProfile({ firstName: value || '' }));
        },
        [dispatch]
    );

    const onChangeLastname = useCallback(
        (value?: string) => {
            dispatch(profileActions.updateProfile({ lastName: value || '' }));
        },
        [dispatch]
    );

    const onChangeEmail = useCallback(
        (value?: string) => {
            dispatch(profileActions.updateProfile({ email: value || '' }));
        },
        [dispatch]
    );

    const onChangeAvatar = useCallback(
        (value?: string) => {
            dispatch(profileActions.updateProfile({ avatar: value || '' }));
        },
        [dispatch]
    );
    const onChangeBirthYear = useCallback(
        (value?: string) => {
            dispatch(profileActions.updateProfile({ birthYear: value ? Number(value) : undefined }));
        },
        [dispatch]
    );
    const onChangePhoneNumber = useCallback(
        (value?: string) => {
            dispatch(profileActions.updateProfile({ phoneNumber: value || '' }));
        },
        [dispatch]
    );
    const onChangeTelegram = useCallback(
        (value?: string) => {
            dispatch(profileActions.updateProfile({ telegram: value || '' }));
        },
        [dispatch]
    );
    const onChangePosition = useCallback(
        (value?: string) => {
            dispatch(profileActions.updateProfile({ position: value || '' }));
        },
        [dispatch]
    );
    const onChangeSpecialization = useCallback(
        (value?: string) => {
            dispatch(profileActions.updateProfile({ specialization: value || '' }));
        },
        [dispatch]
    );
    const onChangeBio = useCallback(
        (value?: string) => {
            dispatch(profileActions.updateProfile({ bio: value || '' }));
        },
        [dispatch]
    );
    const onUploadAvatarFile = useCallback(async (file?: File) => {
        if (!file) {
            return;
        }
        try {
            setIsAvatarUploading(true);
            const fd = new FormData();
            fd.append('image', file);
            const response = await $apiPrivate.post<{ url: string }>('/users/avatar-upload', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response?.data?.url) {
                dispatch(profileActions.updateProfile({ avatar: response.data.url }));
                if (authData) {
                    dispatch(userActions.setAuthData({
                        ...authData,
                        avatar: response.data.url,
                    }));
                }
                toast.success('Фото загружено');
            }
        } catch (e) {
            toast.error('Не удалось загрузить фото');
        } finally {
            setIsAvatarUploading(false);
        }
    }, [authData, dispatch]);

    const onChangeIsAdmin = useCallback(
        (isAdmin: boolean) => {
            dispatch(profileActions.updateProfile({ isAdmin }));
        },
        [dispatch]
    );
    const onChangeIsDoctor = useCallback(
        (isDoctor: boolean) => {
            dispatch(profileActions.updateProfile({ isDoctor }));
        },
        [dispatch]
    );

    return (
        <DynamicModuleLoader reducers={reducers}>
            <Page className={classNames(cls.ProfilePage, {}, [className])}>
                <VStack gap="16" max>
                    <ProfilePageHeader />
                    {validateErrors?.length &&
                        validateErrors.map((error) => (
                            <Text key={error} text={validateErrorsTranslate[error]} variant={'error'} />
                        ))}
                    <ProfileCard
                        data={formData}
                        isLoading={isLoading}
                        error={error}
                        readonly={readonly}
                        onChangeFirstname={onChangeFirstname}
                        onChangeLastname={onChangeLastname}
                        onChangeAvatar={onChangeAvatar}
                        onChangeBirthYear={onChangeBirthYear}
                        onChangePhoneNumber={onChangePhoneNumber}
                        onChangeTelegram={onChangeTelegram}
                        onChangePosition={onChangePosition}
                        onChangeSpecialization={onChangeSpecialization}
                        onChangeBio={onChangeBio}
                        onUploadAvatarFile={onUploadAvatarFile}
                        isAvatarUploading={isAvatarUploading}
                        onChangeIsAdmin={onChangeIsAdmin}
                        onChangeIsDoctor={onChangeIsDoctor}
                        roleReadonly={!authData?.isAdmin}
                        onChangeEmail={onChangeEmail}
                    />
                    <ChangePasswordForm profileId={id} />
                    <TelegramLinkSection profileId={id} isLinked={formData?.isTelegramLinked} />
                    {formData?.isDoctor && (
                        <>
                            <DoctorClients doctorId={id} />
                            <DoctorAppointments doctorId={id} />
                        </>
                    )}
                </VStack>
            </Page>
        </DynamicModuleLoader>
    );
};

export default memo(ProfilePage);
