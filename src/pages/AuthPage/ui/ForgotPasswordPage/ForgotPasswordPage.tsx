import { memo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Page } from '@/widgets/Page/Page';
import { Card } from '@/shared/ui/Card/Card';
import { VStack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text/Text';
import { Input } from '@/shared/ui/Input/Input';
import { Button, ButtonTheme } from '@/shared/ui/Button';
import { $api } from '@/shared/api/api';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig';
import s from './ForgotPasswordPage.module.scss';

interface ForgotPasswordPageProps {
    className?: string;
}

const ForgotPasswordPage = ({ className }: ForgotPasswordPageProps) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resultMessage, setResultMessage] = useState<string | null>(null);

    const handleSubmit = useCallback(async () => {
        if (!email) return;

        try {
            setIsLoading(true);
            const { data } = await $api.post<{ message: string }>('/auth/password-reset/request', { email });
            setResultMessage(data.message);
        } catch (err: any) {
            setResultMessage(err?.response?.data?.message || 'Не удалось отправить запрос. Попробуйте позже.');
        } finally {
            setIsLoading(false);
        }
    }, [email]);

    const onKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSubmit();
    }, [handleSubmit]);

    return (
        <Page className={classNames(s.ForgotPasswordPage, {}, [className])}>
            <Card shadow="shadowAccent" padding="32" className={s.card}>
                <VStack gap="16">
                    <Text size="m" title="Восстановление доступа" bold />

                    {resultMessage ? (
                        <>
                            <Text size="s" text={resultMessage} />
                            <Button theme={ButtonTheme.CLEAR} onClick={() => navigate(RoutePath.login)}>
                                Вернуться ко входу
                            </Button>
                        </>
                    ) : (
                        <>
                            <Text size="s" text="Введите email — если к вашему аккаунту привязан Telegram, вы получите ссылку для сброса пароля." />
                            <Input
                                fullWidth
                                label="Email"
                                autofocus
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(v) => setEmail(v || '')}
                                onKeyDown={onKeyDown}
                            />
                            <Button
                                theme={ButtonTheme.BACKGROUND_INVERTED}
                                onClick={handleSubmit}
                                disabled={isLoading || !email}
                                fullWidth
                            >
                                {isLoading ? 'Отправка...' : 'Отправить ссылку'}
                            </Button>
                            <Button theme={ButtonTheme.CLEAR} onClick={() => navigate(RoutePath.login)}>
                                Вернуться ко входу
                            </Button>
                        </>
                    )}
                </VStack>
            </Card>
        </Page>
    );
};

export default memo(ForgotPasswordPage);
