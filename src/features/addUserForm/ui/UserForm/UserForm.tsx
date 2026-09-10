import { classNames } from '@/shared/lib/classNames/classNames';
import { useTranslation } from 'react-i18next';
import cls from './UserForm.module.scss';
import { memo, useCallback, useState } from 'react';
import { VStack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text/Text';
import { Button, ButtonTheme } from '@/shared/ui/Button';
import {
    DynamicModuleLoader,
    ReducersList,
} from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { newUserActions, newUserReducer } from '../../model/slices/newUserSlice';
import { useSelector } from 'react-redux';
import { getAddUserForm } from '../../model/selectors/getAddUserForm/getAddUserForm';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { addNewUser } from '../../model/services/addNewUser/addNewUser';
import { UserCard } from '@/entities/User';
import { hasAccessFlag } from '@/entities/Role';
import { toast } from 'react-toastify';
import { $apiPrivate } from '@/shared/api/api';

interface AddUserFormProps {
    className?: string;
    onSuccess: () => void;
    reloadPage?: () => void;
}

const initialReducers: ReducersList = {
    newUser: newUserReducer,
};

const UserForm = memo((props: AddUserFormProps) => {
    const { className, onSuccess, reloadPage } = props;
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [isAvatarUploading, setIsAvatarUploading] = useState(false);
    const [roleError, setRoleError] = useState<string | undefined>();

    const formData = useSelector(getAddUserForm);

    const cleanForm = useCallback(() => {
        dispatch(newUserActions.cleanForm());
    }, [dispatch]);

    const onChangeFirsttName = useCallback(
        (value?: string) => {
            dispatch(newUserActions.updateUserForm({ firstName: value ?? '' }));
        },
        [dispatch]
    );
    const onChangeLastName = useCallback(
        (value?: string) => {
            dispatch(newUserActions.updateUserForm({ lastName: value || '' }));
        },
        [dispatch]
    );
    const onChangeEmail = useCallback(
        (value?: string) => {
            dispatch(newUserActions.updateUserForm({ email: value || '' }));
        },
        [dispatch]
    );
    const onChangePassword = useCallback(
        (value?: string) => {
            dispatch(newUserActions.updateUserForm({ password: value || '' }));
        },
        [dispatch]
    );
    const onChangeAvatar = useCallback(
        (value?: string) => {
            dispatch(newUserActions.updateUserForm({ avatar: value || '' }));
        },
        [dispatch]
    );
    const onChangeBirthYear = useCallback(
        (value?: string) => {
            dispatch(newUserActions.updateUserForm({ birthYear: value ? Number(value) : undefined }));
        },
        [dispatch]
    );
    const onChangePhoneNumber = useCallback(
        (value?: string) => {
            dispatch(newUserActions.updateUserForm({ phoneNumber: value || '' }));
        },
        [dispatch]
    );
    const onChangeTelegram = useCallback(
        (value?: string) => {
            dispatch(newUserActions.updateUserForm({ telegram: value || '' }));
        },
        [dispatch]
    );
    const onChangePosition = useCallback(
        (value?: string) => {
            dispatch(newUserActions.updateUserForm({ position: value || '' }));
        },
        [dispatch]
    );
    const onChangeSpecialization = useCallback(
        (value?: string) => {
            dispatch(newUserActions.updateUserForm({ specialization: value || '' }));
        },
        [dispatch]
    );
    const onChangeBio = useCallback(
        (value?: string) => {
            dispatch(newUserActions.updateUserForm({ bio: value || '' }));
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
                dispatch(newUserActions.updateUserForm({ avatar: response.data.url }));
                toast.success('Фото загружено');
            }
        } catch (e) {
            toast.error('Не удалось загрузить фото');
        } finally {
            setIsAvatarUploading(false);
        }
    }, [dispatch]);

    const onChangeIsAdmin = useCallback(
        (value: boolean) => {
            setRoleError(undefined);
            dispatch(newUserActions.updateUserForm({ isAdmin: value }));
        },
        [dispatch]
    );
    const onChangeIsDoctor = useCallback(
        (value: boolean) => {
            setRoleError(undefined);
            dispatch(newUserActions.updateUserForm({ isDoctor: value }));
        },
        [dispatch]
    );

    const onSave = useCallback(async () => {
        if (!hasAccessFlag(formData ?? {})) {
            setRoleError(t('Укажите хотя бы одну роль: врач или админ'));
            return;
        }

        const result = await dispatch(addNewUser());
        if (result.meta.requestStatus === 'fulfilled') {
            onSuccess();
            reloadPage?.();
            cleanForm();
            toast.success(t('Пользователь успешно добавлен'));
        }
    }, [formData, onSuccess, cleanForm, dispatch, reloadPage, t]);

    return (
        <DynamicModuleLoader reducers={initialReducers}>
            <div className={classNames(cls.UserForm, {}, [className])}>
                <VStack gap="24" align="center" className={cls.header}>
                    <Text size="m" title={t('Добавление нового сотрудника')} bold />
                    <UserCard
                        onChangeLastName={onChangeLastName}
                        onChangeFirsttName={onChangeFirsttName}
                        onChangeIsAdmin={onChangeIsAdmin}
                        onChangeIsDoctor={onChangeIsDoctor}
                        roleError={roleError}
                        onChangePassword={onChangePassword}
                        onChangeEmail={onChangeEmail}
                        onChangeAvatar={onChangeAvatar}
                        onChangeBirthYear={onChangeBirthYear}
                        onChangePhoneNumber={onChangePhoneNumber}
                        onChangeTelegram={onChangeTelegram}
                        onChangePosition={onChangePosition}
                        onChangeSpecialization={onChangeSpecialization}
                        onChangeBio={onChangeBio}
                        onUploadAvatarFile={onUploadAvatarFile}
                        isAvatarUploading={isAvatarUploading}
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

export default UserForm;
