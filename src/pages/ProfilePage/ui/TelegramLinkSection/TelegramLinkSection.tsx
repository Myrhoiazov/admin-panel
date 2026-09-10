import { memo, useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getUserAuthData } from '@/entities/User';
import { Button, ButtonTheme } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input/Input';
import { $apiPrivate } from '@/shared/api/api';
import { toast } from 'react-toastify';
import s from './TelegramLinkSection.module.scss';

interface TelegramLinkSectionProps {
    profileId?: string;
    isLinked?: boolean;
}

export const TelegramLinkSection = memo(({ profileId, isLinked }: TelegramLinkSectionProps) => {
    const authData = useSelector(getUserAuthData);
    // See ChangePasswordForm.tsx for why String(...) is needed on both sides here.
    const isOwn = String(authData?.id) === String(profileId);

    const [isLoading, setIsLoading] = useState(false);
    const [deepLink, setDeepLink] = useState<string | null>(null);
    const [manualChatId, setManualChatId] = useState('');
    const [isSavingChatId, setIsSavingChatId] = useState(false);
    const [linked, setLinked] = useState(isLinked);

    // `isLinked` arrives asynchronously (the profile fetch completes after this component
    // already mounted with it `undefined`) — useState's initial value only applies on
    // mount, so without this the "Telegram привязан ✓" state would never appear once the
    // real value loads in.
    useEffect(() => {
        setLinked(isLinked);
    }, [isLinked]);

    // Self-service only — the code only makes sense for the person about to tap the
    // link on their own phone, no admin-does-it-for-someone-else case.
    if (!isOwn || !profileId) return null;

    const handleGenerate = useCallback(async () => {
        try {
            setIsLoading(true);
            const { data } = await $apiPrivate.post<{ code: string; botUsername: string }>(
                `/profile/${profileId}/telegram-link-code`
            );
            setDeepLink(`https://t.me/${data.botUsername}?start=${data.code}`);
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Не удалось сгенерировать ссылку';
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    }, [profileId]);

    const handleSaveChatId = useCallback(async () => {
        if (!manualChatId.trim()) return;

        try {
            setIsSavingChatId(true);
            await $apiPrivate.patch(`/profile/${profileId}/telegram-chat-id`, { chatId: manualChatId.trim() });
            toast.success('Telegram привязан');
            setLinked(true);
            setManualChatId('');
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Не удалось сохранить Chat ID');
        } finally {
            setIsSavingChatId(false);
        }
    }, [profileId, manualChatId]);

    return (
        <div className={s.wrap}>
            <p className={s.title}>Telegram</p>

            {linked && !deepLink && (
                <p className={s.hint}>Telegram привязан ✓</p>
            )}

            {!linked && !deepLink && (
                <p className={s.hint}>
                    Привяжите Telegram, чтобы получать уведомления и восстанавливать доступ через бота.
                </p>
            )}

            {deepLink && (
                <p className={s.hint}>
                    Перейдите по ссылке и нажмите Start в Telegram, затем обновите страницу:{' '}
                    <a href={deepLink} target="_blank" rel="noreferrer">{deepLink}</a>
                </p>
            )}

            <Button
                className={s.actionBtn}
                theme={ButtonTheme.OUTLINE}
                onClick={handleGenerate}
                disabled={isLoading}
            >
                {isLoading ? 'Генерация...' : linked ? 'Перепривязать' : 'Привязать Telegram'}
            </Button>

            <p className={s.hint}>
                Или, если уже знаете свой числовой Chat ID (например, узнали его у @userinfobot
                в Telegram), вставьте его напрямую:
            </p>
            <div className={s.manualRow}>
                <Input
                    placeholder="Например, 123456789"
                    value={manualChatId}
                    onChange={(v) => setManualChatId(v || '')}
                    fullWidth
                />
                <Button
                    theme={ButtonTheme.OUTLINE}
                    onClick={handleSaveChatId}
                    disabled={isSavingChatId || !manualChatId.trim()}
                >
                    {isSavingChatId ? 'Сохранение...' : 'Сохранить'}
                </Button>
            </div>
        </div>
    );
});
