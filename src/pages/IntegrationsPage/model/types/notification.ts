export interface NotificationSettingStatus {
    type: string;
    isEnabled: boolean;
    sendToClient: boolean;
    messageTemplate: string | null;
    defaultTemplate: string;
    updatedAt: string | null;
}

export interface NotificationLogEntry {
    id: number;
    eventType: string;
    channel: string;
    status: string;
    errorText: string | null;
    createdAt: string;
}

export const NOTIFICATION_EVENT_LABELS: Record<string, string> = {
    APPOINTMENT_CREATED: 'Новая запись',
    CLIENT_CREATED: 'Новый клиент',
    TRANSACTION_CREATED: 'Финансы',
};

export const NOTIFICATION_CHANNEL_LABELS: Record<string, string> = {
    TELEGRAM_BOT: 'Telegram',
    EMAIL: 'Email',
};

// Per-event help text shown under each template input — which {плейсхолдеры} this event
// actually supports, since each event type passes a different set of values.
export const NOTIFICATION_PLACEHOLDER_HINTS: Record<string, string> = {
    APPOINTMENT_CREATED:
        'Доступные плейсхолдеры: {клиент} — имя клиента, {дата} — дата и время записи. ' +
        'Оставьте поле пустым, чтобы использовать текст по умолчанию (показан как подсказка в поле).',
    CLIENT_CREATED:
        'Доступные плейсхолдеры: {клиент} — имя нового клиента. ' +
        'Оставьте поле пустым, чтобы использовать текст по умолчанию (показан как подсказка в поле).',
    TRANSACTION_CREATED:
        'Доступные плейсхолдеры: {тип} — «Приход» или «Расход», {сумма} — сумма транзакции, ' +
        '{категория} — категория транзакции. Оставьте поле пустым, чтобы использовать текст по умолчанию (показан как подсказка в поле).',
};
