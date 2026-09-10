import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { AppLink } from '@/shared/ui/AppLink/AppLink';
import { getUserAuthData } from '@/entities/User';
import { $apiPrivate } from '@/shared/api/api';
import { Page } from '@/widgets/Page/Page';
import { Text } from '@/shared/ui/Text/Text';
import { Client } from '@/entities/Client';
import { Appointment } from '@/entities/Appointment';
import { IProfile } from '@/entities/Profile';
import { Summary } from '@/entities/Summary';
import {
    getRouteCalendar,
    getRouteClientDetails,
    getRouteClients,
    getRouteProcedureDetails,
    getRouteProfile,
    getRouteTransactions,
} from '@/shared/const/router';
import { Button, ButtonTheme } from '@/shared/ui/Button';
import cls from './HomePage.module.scss';

interface DailyDoctorFinanceItem {
    doctorId: number;
    doctorName: string;
    sessions: number;
    completedSessions: number;
    totalRevenue: number;
    totalDiscount: number;
    expectedRevenue: number;
}

interface DailyDoctorFinanceReport {
    date: string;
    doctors: DailyDoctorFinanceItem[];
}

const HomePage = () => {
    const { t } = useTranslation('home');
    const user = useSelector(getUserAuthData);
    const [clients, setClients] = useState<Client[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [users, setUsers] = useState<IProfile[]>([]);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [dailyDoctorFinance, setDailyDoctorFinance] = useState<DailyDoctorFinanceReport | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadDashboard = async () => {
            try {
                setIsLoading(true);
                const [clientsRes, appointmentsRes, usersRes, summaryRes, doctorFinanceRes] = await Promise.all([
                    $apiPrivate.get<Client[]>('/clients'),
                    $apiPrivate.get<Appointment[]>('/appointments'),
                    $apiPrivate.get<IProfile[]>('/users'),
                    $apiPrivate.get<Summary>('/transactions/summary'),
                    $apiPrivate.get<DailyDoctorFinanceReport>('/appointments/doctor-finance/daily'),
                ]);

                if (!isMounted) {
                    return;
                }

                setClients(clientsRes.data || []);
                setAppointments(appointmentsRes.data || []);
                setUsers(usersRes.data || []);
                setSummary(summaryRes.data || null);
                setDailyDoctorFinance(doctorFinanceRes.data || null);
            } catch (e) {
                if (isMounted) {
                    setClients([]);
                    setAppointments([]);
                    setUsers([]);
                    setSummary(null);
                    setDailyDoctorFinance(null);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadDashboard();

        return () => {
            isMounted = false;
        };
    }, []);

    const todayDate = useMemo(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    }, []);

    const todayAppointments = useMemo(
        () => appointments.filter((item) => {
            const startValue = item.startAt || item.createdAt;
            if (!startValue) {
                return false;
            }
            const date = new Date(startValue);
            const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
            return normalized === todayDate;
        }),
        [appointments, todayDate],
    );

    const doctorsCount = useMemo(
        () => users.filter((item) => item.isDoctor).length,
        [users],
    );

    const displayName = user?.firstName || user?.username || 'Администратор';
    const now = new Date();
    const todayLabel = now.toLocaleDateString('ru-RU', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    const formatMoney = (value?: number) => {
        if (typeof value !== 'number') {
            return '0 ₴';
        }
        return `${new Intl.NumberFormat('ru-RU').format(value)} ₴`;
    };

    const todayAppointmentsSorted = useMemo(
        () => [...todayAppointments].sort((a, b) =>
            new Date(a.startAt || a.createdAt || '').getTime()
            - new Date(b.startAt || b.createdAt || '').getTime()),
        [todayAppointments],
    );

    const appointmentStatusLabel = (status?: Appointment['status']) => {
        if (status === 'COMPLETED') {
            return 'Завершен';
        }
        if (status === 'CANCELLED') {
            return 'Отменен';
        }
        if (status === 'NO_SHOW') {
            return 'Не пришел';
        }
        return 'В ожидании';
    };

    const onExportDoctorFinanceCsv = () => {
        const rows = dailyDoctorFinance?.doctors || [];
        if (!rows.length) {
            return;
        }
        const header = ['Доктор', 'Сеансы', 'Завершенные', 'Доход', 'Скидки', 'План'];
        const body = rows.map((item) => [
            item.doctorName,
            String(item.sessions),
            String(item.completedSessions),
            String(item.totalRevenue),
            String(item.totalDiscount),
            String(item.expectedRevenue),
        ]);
        const csv = [header, ...body]
            .map((line) => line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');
        const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `doctor-finance-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Page className={cls.HomePage}>
            <section className={cls.hero}>
                <div className={cls.heroLeft}>
                    <h1 className={cls.welcome}>Добро пожаловать, {displayName}</h1>
                    <p className={cls.dateText}>{todayLabel}</p>
                </div>
                <AppLink className={cls.todayChip} to={getRouteCalendar()}>
                    <span>Записи сегодня</span>
                    <strong>{todayAppointments.length}</strong>
                </AppLink>
            </section>

            <section className={cls.kpiRow}>
                <AppLink to={getRouteClients()} className={cls.kpiCard}>
                    <p className={cls.kpiLabel}>Клиенты</p>
                    <p className={cls.kpiValue}>{clients.length}</p>
                    <p className={cls.kpiHint}>Активных в базе</p>
                </AppLink>
                <div className={cls.kpiCard}>
                    <p className={cls.kpiLabel}>Доктора</p>
                    <p className={cls.kpiValue}>{doctorsCount}</p>
                    <p className={cls.kpiHint}>На смене сегодня</p>
                </div>
                <AppLink to={getRouteTransactions()} className={cls.financeCard}>
                    <div className={cls.financeHead}>
                        <p>Финансовый баланс</p>
                        <span>онлайн</span>
                    </div>
                    <div className={cls.financeGrid}>
                        <div>
                            <small>Доход</small>
                            <strong>{formatMoney(summary?.income)}</strong>
                        </div>
                        <div>
                            <small>Расход</small>
                            <strong className={cls.expense}>{formatMoney(summary?.expense)}</strong>
                        </div>
                        <div>
                            <small>Баланс</small>
                            <strong className={cls.balance}>{formatMoney(summary?.balance)}</strong>
                        </div>
                    </div>
                </AppLink>
            </section>

            <section className={cls.mainGrid}>
                <div className={cls.leftColumn}>
                    <div className={cls.sectionHead}>
                        <h2>Финансы докторов за сегодня</h2>
                        <div className={cls.financeActions}>
                            <span>Докторов: {dailyDoctorFinance?.doctors?.length || 0}</span>
                            <Button
                                theme={ButtonTheme.OUTLINE}
                                onClick={onExportDoctorFinanceCsv}
                                disabled={!dailyDoctorFinance?.doctors?.length}
                            >
                                Экспорт CSV
                            </Button>
                        </div>
                    </div>

                    <div className={cls.doctorList}>
                        {(!dailyDoctorFinance?.doctors || dailyDoctorFinance.doctors.length === 0) && (
                            <Text text="Сегодня по докторам пока нет данных" className={cls.muted} />
                        )}

                        {dailyDoctorFinance?.doctors?.map((item) => {
                            const doctor = users.find((u) => Number(u.id) === item.doctorId);
                            return (
                                <article className={cls.doctorCard} key={item.doctorId}>
                                    <div className={cls.doctorMain}>
                                        {doctor?.id ? (
                                            <AppLink className={cls.doctorName} to={getRouteProfile(String(doctor.id))}>
                                                {item.doctorName}
                                            </AppLink>
                                        ) : (
                                            <p className={cls.doctorName}>{item.doctorName}</p>
                                        )}
                                        <p className={cls.doctorSub}>Специалист</p>
                                    </div>
                                    <div className={cls.doctorMetric}><small>Сеансы</small><strong>{item.completedSessions} / {item.sessions}</strong></div>
                                    <div className={cls.doctorMetric}><small>Доход</small><strong>{formatMoney(item.totalRevenue)}</strong></div>
                                    <div className={cls.doctorMetric}><small>Скидки</small><strong>{formatMoney(item.totalDiscount)}</strong></div>
                                    <div className={cls.doctorMetric}><small>План</small><strong>{formatMoney(item.expectedRevenue)}</strong></div>
                                </article>
                            );
                        })}
                    </div>
                </div>

                <aside className={cls.rightColumn}>
                    <div className={cls.sectionHead}>
                        <h2>Записи</h2>
                        <span>{todayAppointmentsSorted.length} всего</span>
                    </div>
                    <div className={cls.appointmentList}>
                        {isLoading && <Text text={t('loading')} />}
                        {!isLoading && todayAppointmentsSorted.length === 0 && (
                            <Text text="На сегодня записей нет" className={cls.muted} />
                        )}
                        {!isLoading && todayAppointmentsSorted.map((item) => (
                            <article key={`${item.id}-${item.createdAt}`} className={cls.appointmentCard}>
                                <div className={cls.appointmentTop}>
                                    <span className={cls.statusBadge}>{appointmentStatusLabel(item.status)}</span>
                                    <strong>
                                        {(item.startAt || item.createdAt)
                                            ? new Date(item.startAt || item.createdAt || '').toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
                                            : '--:--'}
                                    </strong>
                                </div>
                                {item.procedures?.[0]?.procedure?.id ? (
                                    <AppLink className={cls.appointmentTitle} to={getRouteProcedureDetails(String(item.procedures[0].procedure!.id))}>
                                        {item.procedures.map((p) => p.procedure?.name).filter(Boolean).join(', ') || 'Процедура'}
                                    </AppLink>
                                ) : (
                                    <p className={cls.appointmentTitle}>Процедура</p>
                                )}
                                {item.client?.id ? (
                                    <AppLink className={cls.appointmentLink} to={getRouteClientDetails(String(item.client.id))}>
                                        {`Клиент: ${`${item.client?.firstName || ''} ${item.client?.lastName || ''}`.trim() || '-'}`}
                                    </AppLink>
                                ) : (
                                    <p className={cls.appointmentMeta}>Клиент: -</p>
                                )}
                                {item.doctor?.id ? (
                                    <AppLink className={cls.appointmentLink} to={getRouteProfile(String(item.doctor.id))}>
                                        {`Доктор: ${item.doctor?.firstName || item.doctor?.email || '-'}`}
                                    </AppLink>
                                ) : (
                                    <p className={cls.appointmentMeta}>{`Доктор: ${item.doctor?.firstName || item.doctor?.email || '-'}`}</p>
                                )}
                                {item.client?.id && (
                                    <AppLink className={cls.openBtn} to={getRouteClientDetails(String(item.client.id))}>
                                        Открыть профиль
                                    </AppLink>
                                )}
                            </article>
                        ))}
                    </div>

                    <AppLink className={cls.transactionsBtn} to={getRouteTransactions()}>
                        Перейти в транзакции
                    </AppLink>
                </aside>
            </section>
        </Page>
    );
};

export default HomePage;
