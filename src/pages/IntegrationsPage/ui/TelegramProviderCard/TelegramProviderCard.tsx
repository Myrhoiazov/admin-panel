import { memo, useEffect, useState } from 'react';
import { Text } from '@/shared/ui/Text/Text';
import { Button, ButtonTheme } from '@/shared/ui/Button';
import { VStack } from '@/shared/ui/Stack';
import { $apiPrivate } from '@/shared/api/api';
import { IntegrationStatus } from '../../model/types/integration';
import s from './TelegramProviderCard.module.scss';

interface TelegramProviderCardProps {
    status: IntegrationStatus | null;
    onSaved: () => void;
}

export const TelegramProviderCard = memo(({ status, onSaved }: TelegramProviderCardProps) => {
    const [isEnabled, setIsEnabled] = useState(status?.isEnabled ?? false);
    const [botToken, setBotToken] = useState('');
    const [botUsername, setBotUsername] = useState((status?.publicConfig?.botUsername as string) ?? '');
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // `status` arrives asynchronously (the /integrations fetch completes after this card
    // already mounted with it null) — useState's initial value only applies on mount, so
    // without this the saved isEnabled/botUsername would never show once the real value
    // loads in. Same pitfall as TelegramLinkSection.tsx's `isLinked` prop.
    useEffect(() => {
        if (!status) return;
        setIsEnabled(status.isEnabled);
        setBotUsername((status.publicConfig?.botUsername as string) ?? '');
    }, [status]);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await $apiPrivate.put('/integrations/TELEGRAM_BOT', {
                isEnabled,
                // Send whichever fields have a value — the server merges them into the
                // existing stored config per-field, so a username-only edit (no new token
                // typed) still saves correctly instead of being silently dropped.
                ...((botToken.trim() || botUsername.trim()) && {
                    config: {
                        ...(botToken.trim() && { botToken: botToken.trim() }),
                        ...(botUsername.trim() && { botUsername: botUsername.trim() }),
                    },
                }),
            });
            setBotToken('');
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
            onSaved();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className={s.configCard}>
            <div className={s.cardHeader}>
                <Text title="Telegram-бот" bold />
                <p className={s.cardHint}>
                    Используется для уведомлений и привязки Telegram-аккаунта сотрудника
                    (например, для сброса пароля). Токен создаётся через @BotFather в Telegram.
                </p>
            </div>
            <VStack gap="8" max>
                <label className={s.entryRow}>
                    <span className={s.entryKey}>Включён</span>
                    <input type="checkbox" checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)} />
                </label>
                <div className={s.entryRow}>
                    <span className={s.entryKey}>Bot token</span>
                    <input
                        className={s.entryInput}
                        type="password"
                        value={botToken}
                        placeholder={status?.isConfigured ? '•••• (уже настроен, введите новый чтобы заменить)' : '123456:ABC-DEF...'}
                        onChange={(e) => setBotToken(e.target.value)}
                    />
                </div>
                <div className={s.entryRow}>
                    <span className={s.entryKey}>Bot username</span>
                    <input
                        className={s.entryInput}
                        value={botUsername}
                        placeholder="my_crm_bot (без @)"
                        onChange={(e) => setBotUsername(e.target.value)}
                    />
                </div>
                <p className={s.cardHint}>Статус: {status?.isConfigured ? 'настроен' : 'не настроен'}</p>
            </VStack>
            <div className={s.cardFooter}>
                <Button theme={ButtonTheme.BACKGROUND} onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Сохранение...' : saved ? 'Сохранено ✓' : 'Сохранить'}
                </Button>
            </div>
        </div>
    );
});
