import { memo, useCallback, useEffect, useState } from 'react';
import { Text } from '@/shared/ui/Text/Text';
import { Button, ButtonTheme } from '@/shared/ui/Button';
import { $apiPrivate } from '@/shared/api/api';
import {
    NOTIFICATION_EVENT_LABELS,
    NOTIFICATION_PLACEHOLDER_HINTS,
    NotificationSettingStatus,
} from '../../model/types/notification';
import s from './NotificationSettingsCard.module.scss';

const EVENT_ORDER = ['APPOINTMENT_CREATED', 'CLIENT_CREATED', 'TRANSACTION_CREATED'];

export const NotificationSettingsCard = memo(() => {
    const [settings, setSettings] = useState<NotificationSettingStatus[]>([]);
    const [templateDrafts, setTemplateDrafts] = useState<Record<string, string>>({});
    const [savingType, setSavingType] = useState<string | null>(null);

    const load = useCallback(async () => {
        const { data } = await $apiPrivate.get<NotificationSettingStatus[]>('/notifications/settings');
        setSettings(data);
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    // `settings` arrives asynchronously after mount — seed each row's editable draft the
    // first time its data shows up, without clobbering text the admin is already typing
    // (e.g. right after a save triggers a reload). When there's no custom override yet,
    // seed with the actual default text (not '') so the field shows a real, editable
    // example instead of a greyed-out placeholder.
    useEffect(() => {
        if (settings.length === 0) return;
        setTemplateDrafts((prev) => {
            const next = { ...prev };
            settings.forEach((setting) => {
                if (!(setting.type in next)) next[setting.type] = setting.messageTemplate ?? setting.defaultTemplate;
            });
            return next;
        });
    }, [settings]);

    const saveSetting = async (type: string, patch: { isEnabled?: boolean; sendToClient?: boolean; messageTemplate?: string }) => {
        const current = settings.find((s) => s.type === type);
        if (!current) return;

        try {
            setSavingType(type);
            await $apiPrivate.put(`/notifications/settings/${type}`, {
                isEnabled: patch.isEnabled ?? current.isEnabled,
                sendToClient: patch.sendToClient ?? current.sendToClient,
                messageTemplate: patch.messageTemplate ?? templateDrafts[type] ?? '',
            });
            await load();
        } finally {
            setSavingType(null);
        }
    };

    const handleToggle = (type: string, field: 'isEnabled' | 'sendToClient', value: boolean) => {
        setSettings((prev) => prev.map((s) => (s.type === type ? { ...s, [field]: value } : s)));
        saveSetting(type, { [field]: value });
    };

    const handleResetTemplate = (type: string) => {
        setTemplateDrafts((prev) => ({ ...prev, [type]: '' }));
        saveSetting(type, { messageTemplate: '' });
    };

    const orderedSettings = EVENT_ORDER
        .map((type) => settings.find((s) => s.type === type))
        .filter((s): s is NotificationSettingStatus => Boolean(s));

    return (
        <div className={s.configCard}>
            <div className={s.cardHeader}>
                <Text title="Уведомления о событиях" bold />
                <p className={s.cardHint}>
                    Админам с привязанным Telegram приходит сообщение при наступлении события.
                    «Слать клиенту» пока сохраняется, но не отправляет — задел на будущее.
                </p>
            </div>

            {orderedSettings.map((setting) => (
                <div key={setting.type} className={s.eventBlock}>
                    <div className={s.eventTop}>
                        <span className={s.eventName}>{NOTIFICATION_EVENT_LABELS[setting.type] ?? setting.type}</span>
                        <label className={s.toggleCell}>
                            <input
                                type="checkbox"
                                checked={setting.isEnabled}
                                disabled={savingType === setting.type}
                                onChange={(e) => handleToggle(setting.type, 'isEnabled', e.target.checked)}
                            />
                            Включено
                        </label>
                        <label className={s.toggleCell}>
                            <input
                                type="checkbox"
                                checked={setting.sendToClient}
                                disabled={savingType === setting.type}
                                onChange={(e) => handleToggle(setting.type, 'sendToClient', e.target.checked)}
                            />
                            Слать клиенту <span className={s.reservedHint}>(скоро)</span>
                        </label>
                    </div>

                    <div className={s.templateRow}>
                        <input
                            className={s.templateInput}
                            value={templateDrafts[setting.type] ?? ''}
                            placeholder={setting.defaultTemplate}
                            disabled={savingType === setting.type}
                            onChange={(e) => setTemplateDrafts((prev) => ({ ...prev, [setting.type]: e.target.value }))}
                        />
                        <Button
                            theme={ButtonTheme.OUTLINE}
                            disabled={savingType === setting.type}
                            onClick={() => saveSetting(setting.type, {})}
                        >
                            {savingType === setting.type ? 'Сохранение...' : 'Сохранить'}
                        </Button>
                        <Button
                            theme={ButtonTheme.CLEAR}
                            disabled={savingType === setting.type || !setting.messageTemplate}
                            onClick={() => handleResetTemplate(setting.type)}
                        >
                            Сбросить
                        </Button>
                    </div>
                    <p className={s.templateHint}>
                        {NOTIFICATION_PLACEHOLDER_HINTS[setting.type] ?? ''}
                    </p>
                </div>
            ))}
        </div>
    );
});
