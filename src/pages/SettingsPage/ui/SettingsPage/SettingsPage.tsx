import { useTranslation } from 'react-i18next';
import { memo, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Page } from '@/widgets/Page/Page';
import { VStack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text/Text';
import { Tabs, TabItem } from '@/shared/ui/Tabs';
import { UserFilters } from '@/widgets/UserFilters';
import {
    DynamicModuleLoader,
    ReducersList,
} from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { settingsPageReducer } from '../../model/slices/settingsPageSlice';
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect';
import { fetchUsersList } from '../../model/services/fetchUsersList/fetchUsersList';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useSelector } from 'react-redux';
import { getSettingsPageUsers } from '../../model/selectors/clientsPageSelectors';
import { UsersList } from '@/entities/User';
import { Button, ButtonTheme } from '@/shared/ui/Button';
import { PaymentMethod } from '@/entities/PaymentMethod';
import { ClientStatusKey, ClientStatusLabels } from '@/entities/ClientStatus';
import { $apiPrivate } from '@/shared/api/api';
import cls from './SettingsPage.module.scss';

interface SettingsPageProps {
    className?: string;
}

const reducers: ReducersList = {
    settingsPage: settingsPageReducer,
};

interface LabelEntry { key: string; value: string; }

/* Дефолтные методы оплат из enum — сидируются если в базе ещё нет данных */
const DEFAULT_PAYMENT_ENTRIES: LabelEntry[] = Object.entries(PaymentMethod).map(([key, value]) => ({ key, value }));

/* Фиксированные 4 уровня статуса клиента — переименовать можно, добавить/удалить нельзя */
const CLIENT_STATUS_KEYS = [
    ClientStatusKey.BRONZE,
    ClientStatusKey.SILVER,
    ClientStatusKey.GOLD,
    ClientStatusKey.PLATINUM,
] as const;

/* ── Роли и права (статика) ── */
const ROLES_INFO = [
    {
        key: 'isAdmin',
        name: 'Администратор',
        color: '#6c47ff',
        permissions: [
            'Полный доступ ко всем разделам системы',
            'Управление пользователями: создание, редактирование, удаление',
            'Просмотр и управление финансами, транзакциями',
            'Настройка CRM: роли, категории, методы оплат',
            'Доступ к настройкам компании и юридическим данным',
            'Просмотр отчётов и аналитики',
        ],
    },
    {
        key: 'isDoctor',
        name: 'Врач',
        color: '#27ae60',
        permissions: [
            'Просмотр своего расписания и записей',
            'Изменение статуса своих сеансов',
            'Просмотр карточек клиентов своих записей',
            'Просмотр процедур',
            'Нет доступа к финансам, настройкам и управлению пользователями',
        ],
    },
];

/* ── Универсальный редактор списка ключ→значение ── */
function LabelEditor({
    entries,
    onChange,
    onRemove,
    keyPlaceholder = 'Ключ',
    valuePlaceholder = 'Название',
    keyLabel = 'Системный ключ',
    valueLabel = 'Отображаемое название',
    hint,
}: {
    entries: LabelEntry[];
    onChange: (e: LabelEntry[]) => void;
    /** Вызывается при удалении с уже обновлённым списком — для немедленного сохранения */
    onRemove?: (newEntries: LabelEntry[]) => void;
    keyPlaceholder?: string;
    valuePlaceholder?: string;
    keyLabel?: string;
    valueLabel?: string;
    hint?: string;
}) {
    const [showAdd, setShowAdd] = useState(false);
    const [newKey, setNewKey] = useState('');
    const [newVal, setNewVal] = useState('');

    const update = (i: number, field: 'key' | 'value', v: string) =>
        onChange(entries.map((e, idx) => idx === i ? { ...e, [field]: v } : e));

    const remove = (i: number) => {
        const next = entries.filter((_, idx) => idx !== i);
        onChange(next);
        onRemove?.(next);
    };

    const add = () => {
        if (!newKey.trim()) return;
        onChange([...entries, { key: newKey.trim().toUpperCase(), value: newVal.trim() }]);
        setNewKey('');
        setNewVal('');
        setShowAdd(false);
    };

    return (
        <div className={cls.editorWrap}>
            {hint && <p className={cls.cardHint} dangerouslySetInnerHTML={{ __html: hint }} />}

            {entries.length > 0 && (
                <div className={cls.tableHead}>
                    <span>{keyLabel}</span>
                    <span>{valueLabel}</span>
                </div>
            )}

            <div className={cls.entriesList}>
                {entries.length === 0 && <p className={cls.empty}>Список пуст — добавьте первый элемент</p>}
                {entries.map((e, i) => (
                    <div key={i} className={cls.entryRow}>
                        <input className={cls.entryInput} value={e.key} placeholder={keyPlaceholder}
                            onChange={(ev) => update(i, 'key', ev.target.value)} />
                        <input className={cls.entryInput} value={e.value} placeholder={valuePlaceholder}
                            onChange={(ev) => update(i, 'value', ev.target.value)} />
                        <button className={cls.removeBtn} onClick={() => remove(i)} title="Удалить">×</button>
                    </div>
                ))}
            </div>

            {showAdd ? (
                <div className={cls.addRow}>
                    <input className={cls.entryInput} value={newKey} placeholder={keyPlaceholder}
                        onChange={(e) => setNewKey(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && add()} autoFocus />
                    <input className={cls.entryInput} value={newVal} placeholder={valuePlaceholder}
                        onChange={(e) => setNewVal(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && add()} />
                    <button className={cls.confirmBtn} onClick={add}>Добавить</button>
                    <button className={cls.cancelBtn} onClick={() => { setShowAdd(false); setNewKey(''); setNewVal(''); }}>Отмена</button>
                </div>
            ) : (
                <button className={cls.addBtn} onClick={() => setShowAdd(true)}>+ Добавить</button>
            )}
        </div>
    );
}

/* ── Главный компонент ── */
const SettingsPage = memo((props: SettingsPageProps) => {
    const { className } = props;
    const users = useSelector(getSettingsPageUsers);
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { hash } = useLocation();

    const tabs: TabItem[] = useMemo(() => [
        { value: 'users',           content: 'Пользователи' },
        { value: 'roles',           content: 'Роли и права' },
        { value: 'categories',      content: 'Категории расходов' },
        { value: 'payments',        content: 'Методы оплат' },
        { value: 'clientStatuses',  content: 'Статусы клиентов' },
    ], []);

    const [activeTab, setActiveTab] = useState(hash?.replace('#', '') || 'users');

    useEffect(() => {
        if (hash) setActiveTab(hash.replace('#', ''));
    }, [hash]);

    /* ── Данные ── */
    const [paymentEntries, setPaymentEntries] = useState<LabelEntry[]>([]);
    const [categoryEntries, setCategoryEntries] = useState<LabelEntry[]>([]);
    const [clientStatusLabels, setClientStatusLabels] = useState<Record<string, string>>({
        BRONZE: ClientStatusLabels.BRONZE,
        SILVER: ClientStatusLabels.SILVER,
        GOLD: ClientStatusLabels.GOLD,
        PLATINUM: ClientStatusLabels.PLATINUM,
    });
    const [isSaving, setIsSaving] = useState(false);
    const [savedTab, setSavedTab] = useState<string | null>(null);

    useInitialEffect(() => {
        dispatch(fetchUsersList());
    });

    useEffect(() => {
        const load = async () => {
            const { data } = await $apiPrivate.get<{
                paymentMethodLabels?: Record<string, string>;
                expenseCategoryLabels?: Record<string, string>;
                transactionLabels?: Record<string, string>;
                clientStatusLabels?: Record<string, string>;
            }>('/company-settings');

            const savedPm = data.paymentMethodLabels ?? {};
            const savedEc = data.expenseCategoryLabels ?? {};

            if (data.clientStatusLabels && Object.keys(data.clientStatusLabels).length > 0) {
                setClientStatusLabels((prev) => ({ ...prev, ...data.clientStatusLabels }));
            }

            if (Object.keys(savedPm).length > 0) {
                /* Уже есть сохранённые данные — используем их */
                setPaymentEntries(Object.entries(savedPm).map(([key, value]) => ({ key, value })));
            } else {
                /* Первый запуск: берём дефолты из enum как базу */
                const base = new Map<string, string>(DEFAULT_PAYMENT_ENTRIES.map((e) => [e.key, e.value]));

                /* Добавляем кастомные ключи из старого transactionLabels (MERZ, TOTIS, EMET и т.д.) */
                if (data.transactionLabels) {
                    const enumKeys = new Set(Object.keys(PaymentMethod));
                    const skipKeys = new Set(['INCOME', 'EXPENSE']);
                    Object.entries(data.transactionLabels).forEach(([k, v]) => {
                        if (!skipKeys.has(k) && !enumKeys.has(k)) {
                            base.set(k, v || k);
                        }
                    });
                }

                setPaymentEntries(Array.from(base.entries()).map(([key, value]) => ({ key, value })));
            }

            if (Object.keys(savedEc).length > 0) {
                setCategoryEntries(Object.entries(savedEc).map(([key, value]) => ({ key, value })));
            } else if (data.transactionLabels) {
                /* Мигрируем категории из старого transactionLabels */
                const enumKeys = new Set(Object.keys(PaymentMethod));
                const skipKeys = new Set(['INCOME', 'EXPENSE']);
                const ecMigrated: LabelEntry[] = [];
                Object.entries(data.transactionLabels).forEach(([k, v]) => {
                    if (!skipKeys.has(k) && !enumKeys.has(k)) ecMigrated.push({ key: k, value: v || k });
                });
                setCategoryEntries(ecMigrated);
            }
        };
        load();
    }, []);

    const saveToDb = async (pm: LabelEntry[], ec: LabelEntry[], showFeedback?: 'payments' | 'categories') => {
        try {
            setIsSaving(true);
            const { data: current } = await $apiPrivate.get('/company-settings');

            const pmMap: Record<string, string> = {};
            pm.forEach(({ key, value }) => { if (key.trim()) pmMap[key.trim()] = value; });

            const ecMap: Record<string, string> = {};
            ec.forEach(({ key, value }) => { if (key.trim()) ecMap[key.trim()] = value; });

            await $apiPrivate.put('/company-settings', {
                ...current,
                paymentMethodLabels: pmMap,
                expenseCategoryLabels: ecMap,
                transactionLabels: { ...pmMap, ...ecMap },
            });

            if (showFeedback) {
                setSavedTab(showFeedback);
                setTimeout(() => setSavedTab(null), 2000);
            }
        } finally {
            setIsSaving(false);
        }
    };

    const save = (tab: 'payments' | 'categories') =>
        saveToDb(paymentEntries, categoryEntries, tab);

    const saveClientStatuses = async () => {
        try {
            setIsSaving(true);
            const { data: current } = await $apiPrivate.get('/company-settings');
            await $apiPrivate.put('/company-settings', {
                ...current,
                clientStatusLabels,
            });
            setSavedTab('clientStatuses');
            setTimeout(() => setSavedTab(null), 2000);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <DynamicModuleLoader reducers={reducers}>
            <Page className={className}>
                <VStack gap="16">
                    <Text title="Настройки CRM" size="l" bold />

                    <Tabs
                        tabs={tabs}
                        value={activeTab}
                        onTabClick={(tab) => setActiveTab(tab.value)}
                    />

                    {/* ── Пользователи ── */}
                    {activeTab === 'users' && (
                        <VStack gap="16" max>
                            <UserFilters reloadPage={() => dispatch(fetchUsersList())} />
                            <UsersList
                                users={users}
                                onDeleteSuccess={() => dispatch(fetchUsersList())}
                            />
                        </VStack>
                    )}

                    {/* ── Роли и права ── */}
                    {activeTab === 'roles' && (
                        <VStack gap="16" max>
                            <p className={cls.sectionHint}>
                                Роли определяют уровень доступа сотрудника к разделам системы.
                                Это два независимых флага — сотрудник может быть врачом, администратором
                                или и тем, и другим одновременно. Назначаются при создании или редактировании пользователя.
                            </p>
                            <div className={cls.rolesGrid}>
                                {ROLES_INFO.map((role) => (
                                    <div key={role.key} className={cls.roleCard}>
                                        <div className={cls.roleHeader}>
                                            <span className={cls.roleDot} style={{ background: role.color }} />
                                            <span className={cls.roleName}>{role.name}</span>
                                            <code className={cls.roleKey}>{role.key}</code>
                                        </div>
                                        <ul className={cls.permList}>
                                            {role.permissions.map((p, i) => (
                                                <li key={i} className={cls.permItem}>{p}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </VStack>
                    )}

                    {/* ── Категории расходов ── */}
                    {activeTab === 'categories' && (
                        <div className={cls.configCard}>
                            <div className={cls.cardHeader}>
                                <Text title="Категории расходов" bold />
                                <p className={cls.cardHint}>
                                    Категории используются при создании транзакций. Ключ — системное значение,
                                    название — как оно отображается в таблице финансов.
                                </p>
                            </div>
                            <LabelEditor
                                entries={categoryEntries}
                                onChange={setCategoryEntries}
                                onRemove={(next) => saveToDb(paymentEntries, next)}
                                keyPlaceholder="COSMETICS"
                                valuePlaceholder="Косметика"
                                keyLabel="Системный ключ"
                                valueLabel="Название категории"
                            />
                            <div className={cls.cardFooter}>
                                <Button
                                    theme={ButtonTheme.BACKGROUND}
                                    onClick={() => save('categories')}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Сохранение...' : savedTab === 'categories' ? 'Сохранено ✓' : 'Сохранить'}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* ── Методы оплат ── */}
                    {activeTab === 'payments' && (
                        <div className={cls.configCard}>
                            <div className={cls.cardHeader}>
                                <Text title="Методы оплат" bold />
                                <p className={cls.cardHint}>
                                    Ключ соответствует значению метода оплаты в транзакции (например <code>CASH</code>, <code>CARD</code>).
                                    Название отображается в таблице финансов вместо системного ключа.
                                </p>
                            </div>
                            <LabelEditor
                                entries={paymentEntries}
                                onChange={setPaymentEntries}
                                onRemove={(next) => saveToDb(next, categoryEntries)}
                                keyPlaceholder="CARD"
                                valuePlaceholder="Карта"
                                keyLabel="Системный ключ"
                                valueLabel="Название метода"
                            />
                            <div className={cls.cardFooter}>
                                <Button
                                    theme={ButtonTheme.BACKGROUND}
                                    onClick={() => save('payments')}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Сохранение...' : savedTab === 'payments' ? 'Сохранено ✓' : 'Сохранить'}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* ── Статусы клиентов ── */}
                    {activeTab === 'clientStatuses' && (
                        <div className={cls.configCard}>
                            <div className={cls.cardHeader}>
                                <Text title="Статусы клиентов" bold />
                                <p className={cls.cardHint}>
                                    4 уровня лояльности клиента — фиксированные, добавить или удалить нельзя,
                                    только переименовать. Название отображается одинаково в списке клиентов,
                                    на странице деталей и в форме редактирования.
                                </p>
                            </div>
                            <div className={cls.entriesList}>
                                {CLIENT_STATUS_KEYS.map((key) => (
                                    <div key={key} className={cls.entryRow}>
                                        <span className={cls.entryKey}>{key}</span>
                                        <input
                                            className={cls.entryInput}
                                            value={clientStatusLabels[key] ?? ''}
                                            placeholder={ClientStatusLabels[key]}
                                            onChange={(e) => setClientStatusLabels((prev) => ({ ...prev, [key]: e.target.value }))}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className={cls.cardFooter}>
                                <Button
                                    theme={ButtonTheme.BACKGROUND}
                                    onClick={saveClientStatuses}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Сохранение...' : savedTab === 'clientStatuses' ? 'Сохранено ✓' : 'Сохранить'}
                                </Button>
                            </div>
                        </div>
                    )}

                </VStack>
            </Page>
        </DynamicModuleLoader>
    );
});

export default SettingsPage;
