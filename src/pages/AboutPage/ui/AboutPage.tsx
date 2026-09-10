import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Page } from '@/widgets/Page/Page';
import { Text } from '@/shared/ui/Text/Text';
import { Tabs, TabItem } from '@/shared/ui/Tabs';
import { Input } from '@/shared/ui/Input/Input';
import Textarea from '@/shared/ui/Textarea/Textarea';
import { Button, ButtonTheme } from '@/shared/ui/Button';
import { $apiPrivate } from '@/shared/api/api';
import { UsersList, getUserAuthData } from '@/entities/User';
import { UserFilters } from '@/widgets/UserFilters';
import { IProfile } from '@/entities/Profile';
import { ServicesTab } from './ServicesTab/ServicesTab';
import { GuideTab } from './GuideTab/GuideTab';
import cls from './AboutPage.module.scss';

interface WorkingDay {
    day: string;
    from: string;
    to: string;
    off: boolean;
}

interface CompanySettingsDto {
    companyName?: string;
    slogan?: string;
    foundationDate?: string;
    description?: string;
    email?: string;
    phone?: string;
    extraPhone?: string;
    website?: string;
    country?: string;
    city?: string;
    zip?: string;
    address?: string;
    latitude?: string;
    longitude?: string;
    zoom?: string;
    logoUrl?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
    telegram?: string;
    tiktok?: string;
    homeVideo?: string;
    legalName?: string;
    legalAddress?: string;
    registrationNumber?: string;
    taxNumber?: string;
    schedule?: WorkingDay[];
    transactionLabels?: Record<string, string>;
}

const defaultForm = {
    companyName: '',
    slogan: '',
    foundationDate: '',
    description: '',
    email: '',
    phone: '',
    extraPhone: '',
    website: '',
    country: '',
    city: '',
    zip: '',
    address: '',
    latitude: '',
    longitude: '',
    zoom: '',
    logoUrl: '',
    instagram: '',
    facebook: '',
    youtube: '',
    telegram: '',
    tiktok: '',
    homeVideo: '',
    legalName: '',
    legalAddress: '',
    registrationNumber: '',
    taxNumber: '',
};

const defaultSchedule: WorkingDay[] = [
    { day: 'Понедельник', from: '10:00', to: '20:00', off: false },
    { day: 'Вторник', from: '10:00', to: '20:00', off: false },
    { day: 'Среда', from: '10:00', to: '20:00', off: false },
    { day: 'Четверг', from: '10:00', to: '20:00', off: false },
    { day: 'Пятница', from: '10:00', to: '20:00', off: false },
    { day: 'Суббота', from: '10:00', to: '18:00', off: false },
    { day: 'Воскресенье', from: '', to: '', off: true },
];

const AboutPage = () => {
    const { hash } = useLocation();
    const navigate = useNavigate();
    const authData = useSelector(getUserAuthData);
    const isAdmin = Boolean(authData?.isAdmin);
    const [form, setForm] = useState(defaultForm);
    const [schedule, setSchedule] = useState<WorkingDay[]>(defaultSchedule);
    const [transactionLabels, setTransactionLabels] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [employees, setEmployees] = useState<IProfile[]>([]);
    const [employeesLoading, setEmployeesLoading] = useState(false);

    const loadEmployees = useCallback(async () => {
        try {
            setEmployeesLoading(true);
            const { data } = await $apiPrivate.get<IProfile[]>('/users');
            setEmployees(data ?? []);
        } finally {
            setEmployeesLoading(false);
        }
    }, []);

    const companyTabs: TabItem[] = useMemo(
        () => [
            { value: 'main', content: 'Главная' },
            { value: 'services', content: 'Услуги' },
            { value: 'documents', content: 'Документы' },
            { value: 'finance', content: 'Финансы' },
            { value: 'employees', content: 'Сотрудники' },
            { value: 'guide', content: 'Путеводитель клиники' },
        ],
        [],
    );

    const normalizedHash = hash?.replace('#', '') || 'main';
    const [activeTab, setActiveTab] = useState(normalizedHash);

    useEffect(() => {
        setActiveTab(normalizedHash);
    }, [normalizedHash]);

    useEffect(() => {
        if (activeTab === 'employees') {
            loadEmployees();
        }
    }, [activeTab, loadEmployees]);

    useEffect(() => {
        const load = async () => {
            try {
                setIsLoading(true);
                const { data } = await $apiPrivate.get<CompanySettingsDto>('/company-settings');
                setForm({
                    companyName: data.companyName || '',
                    slogan: data.slogan || '',
                    foundationDate: data.foundationDate
                        ? new Date(data.foundationDate).toISOString().slice(0, 10)
                        : '',
                    description: data.description || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    extraPhone: data.extraPhone || '',
                    website: data.website || '',
                    country: data.country || '',
                    city: data.city || '',
                    zip: data.zip || '',
                    address: data.address || '',
                    latitude: data.latitude || '',
                    longitude: data.longitude || '',
                    zoom: data.zoom || '',
                    logoUrl: data.logoUrl || '',
                    instagram: data.instagram || '',
                    facebook: data.facebook || '',
                    youtube: data.youtube || '',
                    telegram: data.telegram || '',
                    tiktok: data.tiktok || '',
                    homeVideo: data.homeVideo || '',
                    legalName: data.legalName || '',
                    legalAddress: data.legalAddress || '',
                    registrationNumber: data.registrationNumber || '',
                    taxNumber: data.taxNumber || '',
                });
                setSchedule(Array.isArray(data.schedule) && data.schedule.length ? data.schedule : defaultSchedule);
                setTransactionLabels(data.transactionLabels || {});
            } finally {
                setIsLoading(false);
            }
        };

        load();
    }, []);

    const onChangeField = (key: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const onChangeSchedule = (index: number, key: 'from' | 'to' | 'off', value: string | boolean) => {
        setSchedule((prev) => prev.map((item, i) => {
            if (i !== index) {
                return item;
            }
            return { ...item, [key]: value };
        }));
    };

    const onReset = async () => {
        try {
            setIsLoading(true);
            const { data } = await $apiPrivate.get<CompanySettingsDto>('/company-settings');
            setForm({
                companyName: data.companyName || '',
                slogan: data.slogan || '',
                foundationDate: data.foundationDate ? new Date(data.foundationDate).toISOString().slice(0, 10) : '',
                description: data.description || '',
                email: data.email || '',
                phone: data.phone || '',
                extraPhone: data.extraPhone || '',
                website: data.website || '',
                country: data.country || '',
                city: data.city || '',
                zip: data.zip || '',
                address: data.address || '',
                latitude: data.latitude || '',
                longitude: data.longitude || '',
                zoom: data.zoom || '',
                logoUrl: data.logoUrl || '',
                instagram: data.instagram || '',
                facebook: data.facebook || '',
                youtube: data.youtube || '',
                telegram: data.telegram || '',
                tiktok: data.tiktok || '',
                homeVideo: data.homeVideo || '',
                legalName: data.legalName || '',
                legalAddress: data.legalAddress || '',
                registrationNumber: data.registrationNumber || '',
                taxNumber: data.taxNumber || '',
            });
            setSchedule(Array.isArray(data.schedule) && data.schedule.length ? data.schedule : defaultSchedule);
            setTransactionLabels(data.transactionLabels || {});
        } finally {
            setIsLoading(false);
        }
    };

    const onSave = async () => {
        try {
            setIsSaving(true);
            await $apiPrivate.put('/company-settings', {
                ...form,
                schedule,
                transactionLabels,
            });
        } finally {
            setIsSaving(false);
        }
    };

    const isMainTab = activeTab === 'main';
    const isEmployeesTab = activeTab === 'employees';
    const isServicesTab = activeTab === 'services';
    const isGuideTab = activeTab === 'guide';

    return (
        <Page className={cls.AboutPage}>
            <Text title="КОМПАНИЯ" size="l" className={cls.title} bold />
            <Tabs
                className={cls.tabs}
                tabs={companyTabs}
                value={activeTab}
                onTabClick={(tab) => {
                    if (tab.value === 'finance') {
                        navigate('/transactions');
                        return;
                    }
                    setActiveTab(tab.value);
                }}
            />

            {isEmployeesTab && (
                <div>
                    <UserFilters reloadPage={loadEmployees} />
                    <UsersList
                        users={employees}
                        isLoading={employeesLoading}
                        onDeleteSuccess={loadEmployees}
                        emptyTitle="Сотрудники не найдены"
                        emptyDescription="Добавьте первого сотрудника, чтобы он появился в этом списке"
                    />
                </div>
            )}

            {isServicesTab && <ServicesTab />}

            {isGuideTab && <GuideTab />}

            {!isMainTab && !isEmployeesTab && !isServicesTab && !isGuideTab && (
                <div className={cls.placeholderCard}>
                    <Text title={`Раздел: ${companyTabs.find((tab) => tab.value === activeTab)?.content || activeTab}`} bold />
                    <Text text="Этот раздел подготовлен. Сейчас доступна настройка вкладки «Главная»." />
                </div>
            )}

            {isMainTab && (
                <>
                    <section className={cls.hero}>
                        <div className={cls.heroContent}>
                            <span className={cls.heroKicker}>Настройки сайта</span>
                            <h2 className={cls.heroTitle}>{form.companyName || 'Информация о компании'}</h2>
                            <p className={cls.heroText}>
                                {form.slogan || 'Контакты, карта, социальные ссылки и юридические данные для сайта'}
                            </p>
                        </div>
                        <div className={cls.heroFacts}>
                            <div className={cls.heroFact}>
                                <span>Email</span>
                                <strong>{form.email || '-'}</strong>
                            </div>
                            <div className={cls.heroFact}>
                                <span>Город</span>
                                <strong>{form.city || '-'}</strong>
                            </div>
                            <div className={cls.heroFact}>
                                <span>Основан</span>
                                <strong>{form.foundationDate || '-'}</strong>
                            </div>
                        </div>
                    </section>

                    <section className={cls.card}>
                        <Text title="Основная информация" bold />
                        <div className={cls.formGrid}>
                            <Input label="Название салона *" value={form.companyName} onChange={(v) => onChangeField('companyName', v)} fullWidth />
                            <Input label="Слоган" value={form.slogan} onChange={(v) => onChangeField('slogan', v)} fullWidth />
                            <Input label="Дата основания" type="date" value={form.foundationDate} onChange={(v) => onChangeField('foundationDate', v)} fullWidth />
                            <Textarea placeholder="Описание салона" value={form.description} onChange={(v) => onChangeField('description', v)} fullWidth />
                        </div>
                    </section>

                    <section className={cls.card}>
                        <Text title="Контакты и адрес" bold />
                        <div className={cls.formGrid}>
                            <Input label="Email" value={form.email} onChange={(v) => onChangeField('email', v)} fullWidth />
                            <Input label="Телефон" value={form.phone} onChange={(v) => onChangeField('phone', v)} fullWidth />
                            <Input label="Доп. телефон" value={form.extraPhone} onChange={(v) => onChangeField('extraPhone', v)} fullWidth />
                            <Input label="Сайт" value={form.website} onChange={(v) => onChangeField('website', v)} fullWidth />
                            <Input label="Страна" value={form.country} onChange={(v) => onChangeField('country', v)} fullWidth />
                            <Input label="Город" value={form.city} onChange={(v) => onChangeField('city', v)} fullWidth />
                            <Input label="Почтовый индекс" value={form.zip} onChange={(v) => onChangeField('zip', v)} fullWidth />
                            <Input label="Адрес" value={form.address} onChange={(v) => onChangeField('address', v)} fullWidth />
                        </div>
                    </section>

                    <section className={cls.card}>
                        <Text title="Карта Google" bold />
                        <div className={cls.row2}>
                            <Input label="Широта" value={form.latitude} onChange={(v) => onChangeField('latitude', v)} fullWidth />
                            <Input label="Долгота" value={form.longitude} onChange={(v) => onChangeField('longitude', v)} fullWidth />
                        </div>
                        <Input label="Масштаб (1-22)" value={form.zoom} onChange={(v) => onChangeField('zoom', v)} fullWidth />
                    </section>

                    <section className={cls.card}>
                        <Text title="График работы салона" bold />
                        <div className={cls.scheduleList}>
                            {schedule.map((item, index) => (
                                <div className={cls.scheduleRow} key={item.day}>
                                    <Text text={item.day} className={cls.dayTitle} />
                                    <div className={cls.scheduleInputs}>
                                        <Input
                                            label="С"
                                            type="text"
                                            placeholder="--:--"
                                            value={item.from}
                                            onChange={(value) => onChangeSchedule(index, 'from', value)}
                                        />
                                        <Input
                                            label="До"
                                            type="text"
                                            placeholder="--:--"
                                            value={item.to}
                                            onChange={(value) => onChangeSchedule(index, 'to', value)}
                                        />
                                        <label className={cls.offToggle}>
                                            <input
                                                type="checkbox"
                                                checked={item.off}
                                                onChange={(event) => onChangeSchedule(index, 'off', event.target.checked)}
                                            />
                                            Выходной
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className={cls.card}>
                        <Text title="Лого и соцсети" bold />
                        <div className={cls.formGrid}>
                            <Input label="Или ссылка на лого" value={form.logoUrl} onChange={(v) => onChangeField('logoUrl', v)} fullWidth />
                            <Input label="Ссылка на Instagram" value={form.instagram} onChange={(v) => onChangeField('instagram', v)} fullWidth />
                            <Input label="Ссылка на Facebook" value={form.facebook} onChange={(v) => onChangeField('facebook', v)} fullWidth />
                            <Input label="Ссылка на YouTube" value={form.youtube} onChange={(v) => onChangeField('youtube', v)} fullWidth />
                            <Input label="Ссылка на Telegram" value={form.telegram} onChange={(v) => onChangeField('telegram', v)} fullWidth />
                            <Input label="Ссылка на TikTok" value={form.tiktok} onChange={(v) => onChangeField('tiktok', v)} fullWidth />
                        </div>
                    </section>

                    <section className={cls.card}>
                        <Text title="Видео для главной страницы" bold />
                        <Input
                            label="Ссылка на YouTube-видео для него (например, https://youtu.be/xxxxx)"
                            value={form.homeVideo}
                            onChange={(v) => onChangeField('homeVideo', v)}
                            fullWidth
                        />
                    </section>

                    <section className={cls.card}>
                        <Text title="Юридические данные" bold />
                        <div className={cls.formGrid}>
                            <Input label="Юридическое название" value={form.legalName} onChange={(v) => onChangeField('legalName', v)} fullWidth />
                            <Input label="Юридический адрес" value={form.legalAddress} onChange={(v) => onChangeField('legalAddress', v)} fullWidth />
                            <Input label="Регистрационный номер" value={form.registrationNumber} onChange={(v) => onChangeField('registrationNumber', v)} fullWidth />
                            <Input label="Налоговый номер" value={form.taxNumber} onChange={(v) => onChangeField('taxNumber', v)} fullWidth />
                        </div>
                    </section>

                    {isAdmin && (
                        <div className={cls.actions}>
                            <Button theme={ButtonTheme.OUTLINE} onClick={onReset} disabled={isLoading || isSaving}>Отменить</Button>
                            <Button theme={ButtonTheme.BACKGROUND} onClick={onSave} disabled={isLoading || isSaving}>
                                {isSaving ? 'Сохранение...' : 'Сохранить настройки'}
                            </Button>
                        </div>
                    )}
                </>
            )}
        </Page>
    );
};

export default AboutPage;
