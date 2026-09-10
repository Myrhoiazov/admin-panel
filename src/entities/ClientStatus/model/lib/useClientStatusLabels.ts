import { useState } from 'react';
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect';
import { $apiPrivate } from '@/shared/api/api';
import { ClientStatusKey, ClientStatusLabels } from '../types/status';

/**
 * Настраиваемые названия статусов клиентов (Настройки CRM → Статусы клиентов),
 * с фолбэком на дефолты (`ClientStatusLabels`) для ключей, которые ещё не
 * переименовали или если настройка вовсе не была сохранена.
 */
export const useClientStatusLabels = (): Record<ClientStatusKey, string> => {
    const [labels, setLabels] = useState<Record<ClientStatusKey, string>>(ClientStatusLabels);

    useInitialEffect(() => {
        $apiPrivate.get<{ clientStatusLabels?: Partial<Record<ClientStatusKey, string>> }>('/company-settings')
            .then(({ data }) => {
                if (data.clientStatusLabels && Object.keys(data.clientStatusLabels).length > 0) {
                    setLabels((prev) => ({ ...prev, ...data.clientStatusLabels }));
                }
            })
            .catch(() => {});
    });

    return labels;
};
