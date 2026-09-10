import { memo, useCallback, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Page } from '@/widgets/Page/Page';
import { Card } from '@/shared/ui/Card/Card';
import { VStack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text/Text';
import { Input } from '@/shared/ui/Input/Input';
import { Button, ButtonTheme } from '@/shared/ui/Button';
import { $api } from '@/shared/api/api';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig';
import s from './ResetPasswordPage.module.scss';

interface ResetPasswordPageProps {
    className?: string;
}

const ResetPasswordPage = ({ className }: ResetPasswordPageProps) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = useCallback(async () => {
        if (!token) {
            setErrorMessage('Ссылка недействительна — токен отсутствует.');
            return;
        }
        if (newPassword.length < 8) {
            toast.error('Пароль должен быть не менее 8 символов');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Пароли не совпадают');
            return;
        }

        try {
            setIsLoading(true);
            setErrorMessage(null);
            await $api.post('/auth/password-reset/confirm', { token, newPassword });
            toast.success('Пароль успешно изменён. Войдите с новым паролем.');
            navigate(RoutePath.login);
        } catch (err: any) {
            setErrorMessage(err?.response?.data?.message || 'Не удалось сбросить пароль.');
        } finally {
            setIsLoading(false);
        }
    }, [token, newPassword, confirmPassword, navigate]);

    return (
        <Page className={classNames(s.ResetPasswordPage, {}, [className])}>
            <Card shadow="shadowAccent" padding="32" className={s.card}>
                <VStack gap="16">
                    <Text size="m" title="Новый пароль" bold />

                    {!token && (
                        <Text size="s" text="Ссылка недействительна — токен отсутствует." variant="error" />
                    )}

                    {errorMessage && (
                        <>
                            <Text size="s" text={errorMessage} variant="error" />
                            <Button theme={ButtonTheme.CLEAR} onClick={() => navigate(RoutePath.forgot_password)}>
                                Запросить новую ссылку
                            </Button>
                        </>
                    )}

                    {token && (
                        <>
                            <Input
                                fullWidth
                                label="Новый пароль"
                                type="password"
                                placeholder="Минимум 8 символов"
                                value={newPassword}
                                onChange={(v) => setNewPassword(v || '')}
                            />
                            <Input
                                fullWidth
                                label="Подтвердите пароль"
                                type="password"
                                placeholder="Повторите новый пароль"
                                value={confirmPassword}
                                onChange={(v) => setConfirmPassword(v || '')}
                            />
                            <Button
                                theme={ButtonTheme.BACKGROUND_INVERTED}
                                onClick={handleSubmit}
                                disabled={isLoading}
                                fullWidth
                            >
                                {isLoading ? 'Сохранение...' : 'Сохранить пароль'}
                            </Button>
                        </>
                    )}
                </VStack>
            </Card>
        </Page>
    );
};

export default memo(ResetPasswordPage);
