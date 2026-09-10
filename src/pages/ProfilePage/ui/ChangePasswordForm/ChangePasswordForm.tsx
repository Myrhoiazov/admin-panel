import { memo, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getUserAuthData } from '@/entities/User';
import { Input } from '@/shared/ui/Input/Input';
import { Button, ButtonTheme } from '@/shared/ui/Button';
import { $apiPrivate } from '@/shared/api/api';
import { toast } from 'react-toastify';
import s from './ChangePasswordForm.module.scss';

interface ChangePasswordFormProps {
    profileId?: string;
}

export const ChangePasswordForm = memo(({ profileId }: ChangePasswordFormProps) => {
    const authData = useSelector(getUserAuthData);
    const isAdmin = Boolean(authData?.isAdmin);
    // authData.id is typed as string but the API actually returns it as a number (JSON has
    // no separate "numeric string" type) — String(...) on both sides avoids a silent
    // number-vs-string mismatch that would make this always false, even on your own profile.
    const isOwn = String(authData?.id) === String(profileId);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const canChange = isOwn || isAdmin;
    if (!canChange || !profileId) return null;

    const handleSave = useCallback(async () => {
        if (newPassword.length < 8) {
            toast.error('Пароль должен быть не менее 8 символов');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Пароли не совпадают');
            return;
        }
        if (isOwn && !isAdmin && !currentPassword) {
            toast.error('Введите текущий пароль');
            return;
        }

        try {
            setIsLoading(true);
            await $apiPrivate.patch(`/profile/${profileId}/password`, {
                currentPassword: isOwn && !isAdmin ? currentPassword : undefined,
                newPassword,
            });
            toast.success('Пароль успешно изменён');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Ошибка при смене пароля';
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    }, [currentPassword, newPassword, confirmPassword, isOwn, isAdmin, profileId]);

    return (
        <div className={s.wrap}>
            <p className={s.title}>Сменить пароль</p>

            {isAdmin && !isOwn && (
                <p className={s.hint}>
                    Вы устанавливаете пароль для этого пользователя. Сообщите ему временный пароль отдельно.
                </p>
            )}

            <div className={s.fields}>
                {isOwn && !isAdmin && (
                    <Input
                        type="password"
                        label="Текущий пароль"
                        placeholder="Введите текущий пароль"
                        value={currentPassword}
                        onChange={(v) => setCurrentPassword(v ?? '')}
                        fullWidth
                    />
                )}
                <Input
                    type="password"
                    label="Новый пароль"
                    placeholder="Минимум 8 символов"
                    value={newPassword}
                    onChange={(v) => setNewPassword(v ?? '')}
                    fullWidth
                />
                <Input
                    type="password"
                    label="Подтвердить пароль"
                    placeholder="Повторите новый пароль"
                    value={confirmPassword}
                    onChange={(v) => setConfirmPassword(v ?? '')}
                    fullWidth
                />
            </div>

            <Button
                className={s.saveBtn}
                theme={ButtonTheme.OUTLINE}
                onClick={handleSave}
                disabled={isLoading}
            >
                {isLoading ? 'Сохранение...' : 'Сохранить пароль'}
            </Button>
        </div>
    );
});
