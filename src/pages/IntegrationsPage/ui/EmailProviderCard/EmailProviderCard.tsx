import { memo, useEffect, useState } from 'react';
import { Text } from '@/shared/ui/Text/Text';
import { Button, ButtonTheme } from '@/shared/ui/Button';
import { VStack } from '@/shared/ui/Stack';
import { $apiPrivate } from '@/shared/api/api';
import { IntegrationStatus } from '../../model/types/integration';
import s from './EmailProviderCard.module.scss';

interface EmailProviderCardProps {
    status: IntegrationStatus | null;
    onSaved: () => void;
}

export const EmailProviderCard = memo(({ status, onSaved }: EmailProviderCardProps) => {
    const [isEnabled, setIsEnabled] = useState(status?.isEnabled ?? false);
    const [host, setHost] = useState((status?.publicConfig?.host as string) ?? '');
    const [port, setPort] = useState(status?.publicConfig?.port ? String(status.publicConfig.port) : '');
    const [secure, setSecure] = useState((status?.publicConfig?.secure as boolean) ?? false);
    const [user, setUser] = useState((status?.publicConfig?.user as string) ?? '');
    const [pass, setPass] = useState('');
    const [from, setFrom] = useState((status?.publicConfig?.from as string) ?? '');
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Same async-prop pitfall as TelegramProviderCard/TelegramLinkSection.tsx: `status`
    // loads after this card already mounted with it null, so the fields must resync here.
    useEffect(() => {
        if (!status) return;
        setIsEnabled(status.isEnabled);
        setHost((status.publicConfig?.host as string) ?? '');
        setPort(status.publicConfig?.port ? String(status.publicConfig.port) : '');
        setSecure((status.publicConfig?.secure as boolean) ?? false);
        setUser((status.publicConfig?.user as string) ?? '');
        setFrom((status.publicConfig?.from as string) ?? '');
    }, [status]);

    const hasNewFieldValue = host.trim() || port.trim() || user.trim() || pass.trim() || from.trim();

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await $apiPrivate.put('/integrations/EMAIL', {
                isEnabled,
                // Same partial-update rule as Telegram: only fields with a value are sent,
                // the server merges them into the existing stored config.
                ...(hasNewFieldValue && {
                    config: {
                        ...(host.trim() && { host: host.trim() }),
                        ...(port.trim() && { port: port.trim() }),
                        secure,
                        ...(user.trim() && { user: user.trim() }),
                        ...(pass.trim() && { pass: pass.trim() }),
                        ...(from.trim() && { from: from.trim() }),
                    },
                }),
            });
            setPass('');
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
                <Text title="Email (SMTP)" bold />
                <p className={s.cardHint}>
                    Используется для уведомлений по email. Подходит как собственный SMTP-сервер,
                    так и SendGrid/Mailgun и другие сервисы через их SMTP-режим.
                </p>
            </div>
            <VStack gap="8" max>
                <label className={s.entryRow}>
                    <span className={s.entryKey}>Включён</span>
                    <input type="checkbox" checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)} />
                </label>
                <div className={s.entryRow}>
                    <span className={s.entryKey}>SMTP host</span>
                    <input
                        className={s.entryInput}
                        value={host}
                        placeholder="smtp.example.com"
                        onChange={(e) => setHost(e.target.value)}
                    />
                </div>
                <div className={s.entryRow}>
                    <span className={s.entryKey}>SMTP port</span>
                    <input
                        className={s.entryInput}
                        value={port}
                        placeholder="587"
                        onChange={(e) => setPort(e.target.value)}
                    />
                </div>
                <label className={s.entryRow}>
                    <span className={s.entryKey}>TLS (secure)</span>
                    <input type="checkbox" checked={secure} onChange={(e) => setSecure(e.target.checked)} />
                </label>
                <div className={s.entryRow}>
                    <span className={s.entryKey}>SMTP user</span>
                    <input
                        className={s.entryInput}
                        value={user}
                        placeholder="user@example.com"
                        onChange={(e) => setUser(e.target.value)}
                    />
                </div>
                <div className={s.entryRow}>
                    <span className={s.entryKey}>SMTP password</span>
                    <input
                        className={s.entryInput}
                        type="password"
                        value={pass}
                        placeholder={status?.isConfigured ? '•••• (уже настроен, введите новый чтобы заменить)' : 'пароль'}
                        onChange={(e) => setPass(e.target.value)}
                    />
                </div>
                <div className={s.entryRow}>
                    <span className={s.entryKey}>От кого (From)</span>
                    <input
                        className={s.entryInput}
                        value={from}
                        placeholder="noreply@example.com"
                        onChange={(e) => setFrom(e.target.value)}
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
