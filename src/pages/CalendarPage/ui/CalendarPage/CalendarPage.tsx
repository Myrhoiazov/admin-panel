import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Page } from '@/widgets/Page/Page';
import { VStack, HStack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text/Text';
import { Button, ButtonTheme } from '@/shared/ui/Button';
import { Select } from '@/shared/ui/Select/Select';
import { Input } from '@/shared/ui/Input/Input';
import { Appointment } from '@/entities/Appointment';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { fetchAppoimentsList } from '@/pages/AppoimentsPage/model/services/fetchAppoimentsList/fetchAppoimentsList';
import { appoimentsPageReducer, getAppointments } from '@/pages/AppoimentsPage/model/slices/appoimentsPageSlice';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getRouteClientDetails, getRouteProcedureDetails } from '@/shared/const/router';
import { updateAppointmentById } from '@/pages/AppoimentsPage/model/services/updateAppointmentById/updateAppointmentById';
import { $apiPrivate } from '@/shared/api/api';
import { PaymentMethod } from '@/entities/PaymentMethod';
import { deleteAppoimentById } from '@/features/edditAppoimentDropdown/model/services/deleteAppoimentById';
import { Modal } from '@/shared/ui/Modal/Modal';
import Textarea from '@/shared/ui/Textarea/Textarea';
import { toast } from 'react-toastify';
import { Icon } from '@/shared/ui/Icon/Icon';
import EditIcon from '@/shared/assets/icons/edit-icon.svg';
import { AppoimentFormModal } from '@/features/addAppoimentForm';
import { ConfirmActionModal } from '@/features/confirmAction';
import cls from './CalendarPage.module.scss';

interface ServiceItem { id: number; name: string; price: number; }
interface ServiceCategory { id: number; name: string; procedureId: number | null; items: ServiceItem[]; }

interface EditServiceLine {
    key: string;
    serviceId: string;
    name: string;
    price: number;
}

const makeKey = () => Math.random().toString(36).slice(2);

/* ── Constants ── */
const DAY_START = 8;
const DAY_END = 20;
const PX_PER_MIN = 2.8;
const TOTAL_HEIGHT = (DAY_END - DAY_START) * 60 * PX_PER_MIN;
const WEEK_DAYS = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

type ViewType = 'day' | 'week';

/* ── Pure helpers ── */
const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

const startOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
    d.setHours(0, 0, 0, 0);
    return d;
};

const addDays = (date: Date, days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
};

const toDateInputValue = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

const formatHour = (hour: number) => `${String(hour).padStart(2, '0')}:00`;

const getAppointmentStart = (a: Appointment) => a.startAt || a.createdAt;

const getAppointmentEndTime = (a: Appointment) => {
    const sv = getAppointmentStart(a);
    const start = sv ? new Date(sv).getTime() : NaN;
    if (Number.isNaN(start)) return null;
    const end = a.endAt ? new Date(a.endAt).getTime() : NaN;
    return Number.isNaN(end) ? start + (a.durationMin || 60) * 60_000 : end;
};

const canDeleteAppointment = (a: Appointment) => {
    const end = getAppointmentEndTime(a);
    return Boolean(a.id && end && end > Date.now() && (a.status || 'SCHEDULED') === 'SCHEDULED');
};

/* ── Doctor color palette ── */
interface DoctorColor {
    bg: string;       // RGB triplet for card background
    border: string;   // RGB triplet for card left-border
    timeText: string; // CSS color for time label
    accent: string;   // CSS color for avatar / header accent
}

const DOCTOR_PALETTE: DoctorColor[] = [
    { bg: '130 100 220', border: '115 85 210', timeText: 'rgb(95 60 185)',  accent: 'rgb(130 100 220)' },  // purple
    { bg: '55 160 105',  border: '40 145 90',  timeText: 'rgb(25 115 70)',  accent: 'rgb(55 160 105)'  },  // green
    { bg: '225 115 45',  border: '210 100 30', timeText: 'rgb(170 80 10)',  accent: 'rgb(225 115 45)'  },  // orange
    { bg: '210 70 70',   border: '195 50 50',  timeText: 'rgb(160 30 30)',  accent: 'rgb(210 70 70)'   },  // red
    { bg: '50 140 215',  border: '35 120 200', timeText: 'rgb(20 100 170)', accent: 'rgb(50 140 215)'  },  // blue
    { bg: '195 155 35',  border: '180 140 20', timeText: 'rgb(145 110 5)',  accent: 'rgb(195 155 35)'  },  // gold
    { bg: '155 90 195',  border: '140 70 180', timeText: 'rgb(105 45 160)', accent: 'rgb(155 90 195)'  },  // violet
    { bg: '40 170 160',  border: '25 150 140', timeText: 'rgb(10 125 115)', accent: 'rgb(40 170 160)'  },  // teal
];

const getDoctorColor = (colorIdx: number): DoctorColor =>
    DOCTOR_PALETTE[colorIdx % DOCTOR_PALETTE.length];

/* ── Static data ── */
const STATUS_OPTIONS = [
    { value: 'SCHEDULED', content: 'Запланирован' },
    { value: 'COMPLETED', content: 'Завершен' },
    { value: 'CANCELLED', content: 'Отменен' },
    { value: 'NO_SHOW', content: 'Не пришел' },
];

const DEFAULT_PM_OPTIONS: { value: string; content: string }[] = Object.entries(PaymentMethod).map(([key, label]) => ({ value: key, content: label as string }));

const reducers: ReducersList = { appoimentPage: appoimentsPageReducer };

interface CalendarPageProps { className?: string; }

/* ════════════════════════════════════════════════════════════════ */

const CalendarPage = ({ className }: CalendarPageProps) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const appointments = useSelector(getAppointments.selectAll) as Appointment[];

    /* shared state */
    const [viewType, setViewType] = useState<ViewType>('day');
    const [anchorDate, setAnchorDate] = useState<Date>(new Date());
    const [doctorFilter, setDoctorFilter] = useState('all');

    /* modal state */
    const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
    const [editingDate, setEditingDate] = useState('');
    const [editingTime, setEditingTime] = useState('');
    const [editingNote, setEditingNote] = useState('');
    const [editingStatus, setEditingStatus] = useState('SCHEDULED');
    const [editingPaymentMethod, setEditingPaymentMethod] = useState('CASH');
    const [editingDiscount, setEditingDiscount] = useState(0);
    const [editingFinalAmount, setEditingFinalAmount] = useState(0);
    const [pmOptions, setPmOptions] = useState(DEFAULT_PM_OPTIONS);
    const [allCategories, setAllCategories] = useState<ServiceCategory[]>([]);
    const [editingProcedureId, setEditingProcedureId] = useState('');
    const [editingServiceLines, setEditingServiceLines] = useState<EditServiceLine[]>([{ key: makeKey(), serviceId: '', name: '', price: 0 }]);
    const [deleteAppointment, setDeleteAppointment] = useState<Appointment | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createDate, setCreateDate] = useState('');
    const [createTime, setCreateTime] = useState('');
    const [createDoctorId, setCreateDoctorId] = useState('');

    const [fetchedDoctors, setFetchedDoctors] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        dispatch(fetchAppoimentsList({ replace: true, noQuery: true }));
    }, [dispatch]);

    useEffect(() => {
        $apiPrivate.get<{ id: number; firstName?: string; lastName?: string; isAdmin: boolean; isDoctor: boolean }[]>('/users')
            .then(({ data }) => {
                const doctors = (data || [])
                    .filter((u) => u.isDoctor)
                    .map((u) => ({
                        id: String(u.id),
                        name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || `Доктор #${u.id}`,
                    }));
                setFetchedDoctors(doctors);
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        $apiPrivate.get<{ paymentMethodLabels?: Record<string, string> }>('/company-settings')
            .then(({ data }) => {
                if (data.paymentMethodLabels && Object.keys(data.paymentMethodLabels).length > 0) {
                    setPmOptions(Object.entries(data.paymentMethodLabels).map(([key, label]) => ({ value: key, content: label || key })));
                }
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        $apiPrivate.get<ServiceCategory[]>('/services')
            .then(({ data }) => setAllCategories(data || []))
            .catch(() => {});
    }, []);

    /* ── Day-view data ── */
    const doctors = useMemo(() => {
        const map = new Map<string, { id: string; name: string; specialty?: string; colorIdx: number }>();
        let colorIdx = 0;
        // Primary source: all users with isDoctor=true
        fetchedDoctors.forEach((d) => {
            if (!map.has(d.id)) {
                map.set(d.id, { id: d.id, name: d.name, colorIdx: colorIdx++ });
            }
        });
        // Supplement: doctors found in appointments (adds specialty, fills gaps)
        appointments.forEach((a) => {
            if (a.doctor?.id) {
                const id = String(a.doctor.id);
                if (!map.has(id)) {
                    const fullName = `${a.doctor.firstName || ''} ${a.doctor.lastName || ''}`.trim();
                    map.set(id, {
                        id,
                        name: fullName || a.doctor.email || `Доктор #${id}`,
                        specialty: a.doctor.specialization,
                        colorIdx: colorIdx++,
                    });
                } else if (a.doctor.specialization) {
                    const existing = map.get(id)!;
                    if (!existing.specialty) map.set(id, { ...existing, specialty: a.doctor.specialization });
                }
            }
        });
        return Array.from(map.values());
    }, [appointments, fetchedDoctors]);

    const doctorColorMap = useMemo(() => {
        const m = new Map<string, number>();
        doctors.forEach((d) => m.set(d.id, d.colorIdx));
        return m;
    }, [doctors]);

    const dayAppointments = useMemo(() =>
        appointments.filter((a) => {
            const sv = getAppointmentStart(a);
            return sv && isSameDay(new Date(sv), anchorDate);
        }), [appointments, anchorDate]);

    const appointmentsByDoctor = useMemo(() => {
        const map = new Map<string, Appointment[]>();
        doctors.forEach((d) => map.set(d.id, []));
        dayAppointments.forEach((a) => {
            const id = String(a.doctor?.id || '');
            map.get(id)?.push(a);
        });
        return map;
    }, [doctors, dayAppointments]);

    /* ── Week-view data ── */
    const weekStart = useMemo(() => startOfWeek(anchorDate), [anchorDate]);
    const weekDaysDates = useMemo(
        () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
        [weekStart],
    );
    const weekRange = useMemo(() => ({
        start: weekStart,
        end: new Date(addDays(weekStart, 6).setHours(23, 59, 59, 999)),
    }), [weekStart]);

    const doctorsOptions = useMemo(() => {
        const m = new Map<string, string>();
        fetchedDoctors.forEach((d) => m.set(d.id, d.name));
        appointments.forEach((a) => {
            if (a.doctor?.id && !m.has(String(a.doctor.id))) {
                const name = (a.doctor.firstName || a.doctor.email || '').trim();
                m.set(String(a.doctor.id), name || `Доктор #${a.doctor.id}`);
            }
        });
        return [
            { value: 'all', content: 'Все специалисты' },
            ...Array.from(m.entries()).map(([id, name]) => ({ value: id, content: name })),
        ];
    }, [appointments, fetchedDoctors]);

    const filteredForWeek = useMemo(() =>
        appointments.filter((a) => {
            const sv = getAppointmentStart(a);
            if (!sv) return false;
            const d = new Date(sv);
            if (Number.isNaN(d.getTime())) return false;
            const inRange = d >= weekRange.start && d <= weekRange.end;
            const byDoc = doctorFilter === 'all' || String(a.doctor?.id || '') === doctorFilter;
            return inRange && byDoc;
        }), [appointments, doctorFilter, weekRange]);

    const timeSlots = useMemo(() => {
        const s = new Set<string>();
        for (let h = 8; h <= 20; h++) s.add(formatHour(h));
        filteredForWeek.forEach((a) => {
            const sv = getAppointmentStart(a);
            if (!sv) return;
            const d = new Date(sv);
            if (!Number.isNaN(d.getTime())) s.add(formatHour(d.getHours()));
        });
        return Array.from(s).sort((a, b) => a.localeCompare(b));
    }, [filteredForWeek]);

    const weekEventsByDay = useMemo(() => {
        const map: Record<string, Record<string, Appointment[]>> = {};
        weekDaysDates.forEach((d) => {
            map[d.toDateString()] = {};
            timeSlots.forEach((slot) => { map[d.toDateString()][slot] = []; });
        });
        filteredForWeek.forEach((a) => {
            const sv = getAppointmentStart(a);
            if (!sv) return;
            const dt = new Date(sv);
            const dk = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).toDateString();
            const slot = formatHour(dt.getHours());
            map[dk]?.[slot]?.push(a);
        });
        Object.values(map).forEach((dm) =>
            Object.values(dm).forEach((list) =>
                list.sort((a, b) => (getAppointmentStart(a) || '').localeCompare(getAppointmentStart(b) || ''))));
        return map;
    }, [filteredForWeek, weekDaysDates, timeSlots]);

    const busySlotsByDay = useMemo(() => {
        const set = new Set<string>();
        if (doctorFilter === 'all') return set;
        weekDaysDates.forEach((dayDate) => {
            timeSlots.forEach((slot) => {
                const slotStart = new Date(`${toDateInputValue(dayDate)}T${slot}:00`);
                const slotEnd = new Date(slotStart.getTime() + 60 * 60_000);
                const busy = appointments.some((a) => {
                    if (String(a.doctorId || a.doctor?.id || '') !== doctorFilter) return false;
                    const sv = getAppointmentStart(a);
                    if (!sv) return false;
                    const aStart = new Date(sv);
                    const aEnd = a.endAt ? new Date(a.endAt) : new Date(aStart.getTime() + (a.durationMin || 60) * 60_000);
                    return slotStart < aEnd && slotEnd > aStart;
                });
                if (busy) set.add(`${dayDate.toDateString()}|${slot}`);
            });
        });
        return set;
    }, [appointments, doctorFilter, timeSlots, weekDaysDates]);

    /* ── Navigation ── */
    const step = viewType === 'week' ? 7 : 1;
    const onPrev = () => { const d = new Date(anchorDate); d.setDate(d.getDate() - step); setAnchorDate(d); };
    const onNext = () => { const d = new Date(anchorDate); d.setDate(d.getDate() + step); setAnchorDate(d); };
    const onToday = () => setAnchorDate(new Date());

    /* ── Modal handlers ── */
    const servicesForProcedure = useCallback((procedureId: string): ServiceItem[] =>
        allCategories.filter((c) => c.procedureId === Number(procedureId)).flatMap((c) => c.items),
    [allCategories]);

    // Services must belong to the appointment's (fixed, non-editable in this modal) procedure —
    // no mixing across procedures. Derived, not stored per-row, so it recomputes automatically
    // once allCategories finishes loading (no manual "re-populate" effect needed).
    const servicesForEditingProcedure = useMemo(
        () => servicesForProcedure(editingProcedureId),
        [servicesForProcedure, editingProcedureId],
    );

    const openEditModal = (appt: Appointment) => {
        setEditingAppointment(appt);
        const sv = getAppointmentStart(appt);
        const d = sv ? new Date(sv) : new Date();
        setEditingDate(toDateInputValue(d));
        setEditingTime(d.toTimeString().slice(0, 5));
        setEditingNote(appt.note || '');
        setEditingStatus(appt.status || 'SCHEDULED');
        setEditingPaymentMethod((appt.paymentMethod as string) || 'CASH');
        const discount = Number(appt.discountAmount || 0);
        const basePrice = Number(appt.procedure?.basePrice || 0);
        setEditingDiscount(discount);
        setEditingFinalAmount(Number(appt.finalAmount ?? Math.max(0, basePrice - discount)));
        setEditingProcedureId(String(appt.procedureId || appt.procedure?.id || ''));
        // Real saved services (snapshot), not a price-based guess.
        const savedLines = (appt.services || []).map((s) => ({
            key: makeKey(),
            serviceId: String(s.serviceItemId),
            name: s.name,
            price: s.priceAtBooking,
        }));
        setEditingServiceLines(savedLines.length ? savedLines : [{ key: makeKey(), serviceId: '', name: '', price: 0 }]);
    };
    const closeEditModal = () => {
        setEditingAppointment(null);
        setEditingDate('');
        setEditingTime('');
        setEditingNote('');
        setEditingStatus('SCHEDULED');
        setEditingPaymentMethod('CASH');
        setEditingDiscount(0);
        setEditingFinalAmount(0);
        setEditingProcedureId('');
        setEditingServiceLines([{ key: makeKey(), serviceId: '', name: '', price: 0 }]);
    };

    // Options for a row's <select>: the active services for this procedure, plus — if the
    // row's currently saved service has since been deactivated (so it's no longer in that
    // list) — a synthetic option built from its own snapshot, so the dropdown still shows the
    // real saved name instead of silently falling back to whichever option renders first.
    const optionsForEditRow = useCallback((item: EditServiceLine) => {
        const active = servicesForEditingProcedure.map((s) => ({ value: String(s.id), content: s.name }));
        if (item.serviceId && !servicesForEditingProcedure.some((s) => String(s.id) === item.serviceId)) {
            return [{ value: item.serviceId, content: `${item.name} (деактивирована)` }, ...active];
        }
        return active;
    }, [servicesForEditingProcedure]);

    const onChangeEditService = useCallback((key: string, serviceId: string) => {
        setEditingServiceLines((prev) => {
            const next = prev.map((item) => {
                if (item.key !== key) return item;
                const svc = servicesForEditingProcedure.find((s) => String(s.id) === serviceId);
                return { ...item, serviceId, name: svc?.name || '', price: svc?.price || 0 };
            });
            const total = next.reduce((sum, i) => sum + i.price, 0);
            if (total > 0) setEditingFinalAmount(total);
            return next;
        });
    }, [servicesForEditingProcedure]);

    const addEditServiceLine = useCallback(() => {
        setEditingServiceLines((prev) => [...prev, { key: makeKey(), serviceId: '', name: '', price: 0 }]);
    }, []);

    const removeEditServiceLine = useCallback((key: string) => {
        setEditingServiceLines((prev) => {
            if (prev.length === 1) return prev.map((item) => item.key === key ? { ...item, serviceId: '', name: '', price: 0 } : item);
            const next = prev.filter((item) => item.key !== key);
            const total = next.reduce((sum, i) => sum + i.price, 0);
            if (total > 0) setEditingFinalAmount(total);
            return next;
        });
    }, []);

    const editTotalFromLines = editingServiceLines.reduce((sum, i) => sum + i.price, 0);

    const onSaveAppointment = async () => {
        if (!editingAppointment?.id || !editingDate) return;
        const base = editTotalFromLines > 0 ? editTotalFromLines : editingFinalAmount;
        const finalAmount = Math.max(0, base - editingDiscount);
        const serviceItemIds = editingServiceLines.filter((l) => l.serviceId).map((l) => Number(l.serviceId));
        const result = await dispatch(updateAppointmentById({
            appointmentId: String(editingAppointment.id),
            note: editingNote,
            startAt: `${editingDate}T${editingTime || '00:00'}:00`,
            status: editingStatus as 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW',
            paymentMethod: editingPaymentMethod,
            discountAmount: editingDiscount,
            finalAmount,
            serviceItemIds,
        }));
        if (result.meta.requestStatus === 'fulfilled') {
            toast.success('Сеанс обновлен'); closeEditModal(); dispatch(fetchAppoimentsList({ replace: true, noQuery: true }));
        } else { toast.error('Не удалось обновить сеанс'); }
    };

    const openDeleteConfirm = (appt: Appointment) => {
        if (!canDeleteAppointment(appt)) { toast.info('Прошедшие сеансы нельзя удалить'); return; }
        setDeleteAppointment(appt);
    };
    const closeDeleteConfirm = () => setDeleteAppointment(null);

    const onDeleteAppointment = async () => {
        if (!deleteAppointment?.id) return;
        const result = await dispatch(deleteAppoimentById(String(deleteAppointment.id)));
        if (result.meta.requestStatus === 'fulfilled') {
            toast.info('Сеанс удален'); closeDeleteConfirm(); dispatch(fetchAppoimentsList({ replace: true, noQuery: true }));
        } else { toast.error('Не удалось удалить сеанс'); }
    };

    const openCreateModal = (date: string, time: string, doctorId = '') => {
        setCreateDate(date); setCreateTime(time); setCreateDoctorId(doctorId); setIsCreateOpen(true);
    };

    /* ── Day view helpers ── */
    const tenMinMarks = useMemo(() =>
        Array.from({ length: (DAY_END - DAY_START) * 6 + 1 }, (_, i) => ({
            totalMins: i * 10,
            hour: DAY_START + Math.floor((i * 10) / 60),
            min: (i * 10) % 60,
            isHour: (i * 10) % 60 === 0,
        })),
        [],
    );

    const handleDayColClick = (e: React.MouseEvent<HTMLDivElement>, doctorId: string) => {
        if ((e.target as HTMLElement).closest(`.${cls.apptCard}`)) return;
        const relY = e.clientY - e.currentTarget.getBoundingClientRect().top;
        const snapped = Math.floor(relY / PX_PER_MIN / 10) * 10;
        const total = DAY_START * 60 + Math.min(snapped, (DAY_END - DAY_START) * 60 - 10);
        const h = Math.floor(total / 60);
        const m = total % 60;
        openCreateModal(toDateInputValue(anchorDate), `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`, doctorId);
    };

    /* ── Labels ── */
    const dateLabel = viewType === 'day'
        ? anchorDate.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
        : `${weekRange.start.toLocaleDateString('ru-RU')} — ${weekRange.end.toLocaleDateString('ru-RU')}`;

    const colCount = Math.max(doctors.length, 1);
    const dayGridCols = `52px repeat(${colCount}, minmax(200px, 1fr))`;

    /* ── Shared appointment card renderer for week table ── */
    const renderWeekCard = (event: Appointment) => {
        const sv = getAppointmentStart(event);
        const start = sv ? new Date(sv) : null;
        const end = start ? new Date(start.getTime() + (event.durationMin || 60) * 60_000) : null;
        const timeRange = start && end
            ? `${start.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}-${end.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`
            : '--:--';
        const doctorId = String(event.doctor?.id || '');
        const colorIdx = doctorColorMap.get(doctorId) ?? 0;
        const color = getDoctorColor(colorIdx);
        const isScheduled = !event.status || event.status === 'SCHEDULED';
        const wkCardStyle = isScheduled ? {
            background: `rgb(${color.bg} / 13%)`,
            borderLeftColor: `rgb(${color.border} / 75%)`,
        } : {};

        return (
            <div key={`${event.id}-${sv || event.createdAt}`} className={cls.wkCard} style={wkCardStyle}>
                <span className={cls.wkTime} style={isScheduled ? { color: color.timeText } : {}}>{timeRange}</span>
                <div className={cls.wkCardHead}>
                    <Button
                        className={cls.wkCardTitle}
                        theme={ButtonTheme.CLEAR}
                        onClick={() => event.procedure?.id && navigate(getRouteProcedureDetails(String(event.procedure.id)))}
                    >
                        {`Процедура: ${event.procedure?.name || '-'}`}
                    </Button>
                    <Button className={cls.wkEditBtn} theme={ButtonTheme.CLEAR} onClick={() => openEditModal(event)}>
                        <Icon Svg={EditIcon} width={14} height={14} color="stroke" />
                    </Button>
                    {canDeleteAppointment(event) && (
                        <Button className={cls.wkDeleteBtn} theme={ButtonTheme.CLEAR} onClick={() => openDeleteConfirm(event)} title="Удалить">×</Button>
                    )}
                </div>
                {event.services && event.services.length > 0 && (
                    <div className={cls.apptServices} title={event.services.map((s) => s.name).join(', ')}>
                        {event.services.slice(0, 3).map((s) => (
                            <span key={s.id ?? s.serviceItemId} className={cls.serviceChip}>{s.name}</span>
                        ))}
                        {event.services.length > 3 && (
                            <span className={cls.serviceChip}>+{event.services.length - 3}</span>
                        )}
                    </div>
                )}
                <Button
                    className={classNames(cls.wkLinkBtn, {}, [cls.wkRow])}
                    theme={ButtonTheme.CLEAR}
                    onClick={() => event.client?.id && navigate(getRouteClientDetails(String(event.client.id)))}
                >
                    {`Клиент: ${`${event.client?.firstName || ''} ${event.client?.lastName || ''}`.trim() || '-'}`}
                </Button>
                <Text className={cls.wkMetaLine} text={`Итог: ${event.finalAmount ?? Math.max(0, Number(event.procedure?.basePrice || 0) - Number(event.discountAmount || 0))} ₴`} />
            </div>
        );
    };

    /* ════════════════════════════════════════════════════════════════ */

    return (
        <DynamicModuleLoader reducers={reducers}>
            <Page className={classNames(cls.CalendarPage, {}, [className])}>
                <VStack gap="16" max>

                    {/* ── Top bar ── */}
                    <div className={cls.topBar}>
                        <div className={cls.viewToggle}>
                            <Button
                                theme={viewType === 'day' ? ButtonTheme.BACKGROUND_INVERTED : ButtonTheme.OUTLINE}
                                onClick={() => setViewType('day')}
                            >
                                День
                            </Button>
                            <Button
                                theme={viewType === 'week' ? ButtonTheme.BACKGROUND_INVERTED : ButtonTheme.OUTLINE}
                                onClick={() => setViewType('week')}
                            >
                                Неделя
                            </Button>
                        </div>

                        <div className={cls.navGroup}>
                            <Button theme={ButtonTheme.OUTLINE} onClick={onPrev}>← Назад</Button>
                            <Button theme={ButtonTheme.OUTLINE} onClick={onToday}>Сегодня</Button>
                            <Button theme={ButtonTheme.OUTLINE} onClick={onNext}>Вперед →</Button>
                        </div>

                        <span className={cls.dateLabel}>{dateLabel}</span>

                        <div className={cls.topBarRight}>
                            <Input
                                type="date"
                                value={toDateInputValue(anchorDate)}
                                onChange={(value) => { if (value) setAnchorDate(new Date(`${value}T12:00:00`)); }}
                            />
                            {viewType === 'week' && (
                                <Select label="Специалист" options={doctorsOptions} value={doctorFilter} onChange={setDoctorFilter} />
                            )}
                            <span className={cls.countBadge}>
                                {viewType === 'day' ? dayAppointments.length : filteredForWeek.length} записей
                            </span>
                        </div>
                    </div>

                    {/* ══════ DAY VIEW ══════ */}
                    {viewType === 'day' && (
                        <div className={cls.calendarOuter}>
                            <div className={cls.calendarGrid} style={{ gridTemplateColumns: dayGridCols }}>

                                {/* Header row */}
                                <div className={cls.cornerCell} />
                                {doctors.length > 0 ? doctors.map((doc) => {
                                    const color = getDoctorColor(doc.colorIdx);
                                    return (
                                        <div
                                            key={doc.id}
                                            className={cls.doctorHeader}
                                            style={{ borderBottom: `3px solid ${color.accent}` }}
                                        >
                                            <div
                                                className={cls.docAvatar}
                                                style={{ background: `rgb(${color.bg} / 22%)`, borderColor: `rgb(${color.border} / 45%)`, color: color.accent }}
                                            >
                                                {doc.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className={cls.docInfo}>
                                                <span className={cls.docName}>{doc.name}</span>
                                                {doc.specialty && <span className={cls.docSpecialty}>{doc.specialty}</span>}
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div className={cls.doctorHeader}><span className={cls.docName}>Специалисты</span></div>
                                )}

                                {/* Time column */}
                                <div className={cls.timeCol} style={{ height: `${TOTAL_HEIGHT}px` }}>
                                    {tenMinMarks.map(({ totalMins, hour, min, isHour }) => (
                                        <div
                                            key={totalMins}
                                            className={classNames(cls.timeMark, { [cls.timeMarkHour]: isHour })}
                                            style={{ top: `${totalMins * PX_PER_MIN}px` }}
                                        >
                                            {isHour
                                                ? `${hour}:00`
                                                : `${hour}:${String(min).padStart(2, '0')}`
                                            }
                                        </div>
                                    ))}
                                </div>

                                {/* Doctor columns */}
                                {(doctors.length > 0 ? doctors : [{ id: '', name: '', colorIdx: 0, specialty: undefined as string | undefined }]).map((doc) => {
                                    const docAppts = (appointmentsByDoctor.get(doc.id) || [])
                                        .sort((a, b) => (getAppointmentStart(a) || '').localeCompare(getAppointmentStart(b) || ''));

                                    return (
                                        <div
                                            key={doc.id || '__none__'}
                                            className={cls.doctorCol}
                                            style={{ height: `${TOTAL_HEIGHT}px` }}
                                            onClick={(e) => doc.id && handleDayColClick(e, doc.id)}
                                        >
                                            {tenMinMarks.map(({ totalMins, isHour }) => (
                                                <div
                                                    key={totalMins}
                                                    className={classNames(cls.hourLine, { [cls.hourLineMajor]: isHour })}
                                                    style={{ top: `${totalMins * PX_PER_MIN}px` }}
                                                />
                                            ))}

                                            {docAppts.map((appt) => {
                                                const sv = getAppointmentStart(appt);
                                                if (!sv) return null;
                                                const start = new Date(sv);
                                                const startMins = start.getHours() * 60 + start.getMinutes() - DAY_START * 60;
                                                const dur = appt.durationMin || 60;
                                                const top = Math.max(startMins * PX_PER_MIN, 0);
                                                const height = Math.max(dur * PX_PER_MIN, 32);
                                                const end = new Date(start.getTime() + dur * 60_000);
                                                const timeLabel = `${start.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
                                                const clientName = `${appt.client?.firstName || ''} ${appt.client?.lastName || ''}`.trim();
                                                const isScheduled = !appt.status || appt.status === 'SCHEDULED';
                                                const statusCls = appt.status === 'COMPLETED' ? cls.statusCompleted
                                                    : appt.status === 'CANCELLED' ? cls.statusCancelled
                                                        : appt.status === 'NO_SHOW' ? cls.statusNoShow : '';
                                                const color = getDoctorColor(doc.colorIdx);
                                                const cardStyle = isScheduled ? {
                                                    top: `${top}px`, height: `${height}px`,
                                                    background: `rgb(${color.bg} / 16%)`,
                                                    borderLeftColor: `rgb(${color.border} / 85%)`,
                                                } : { top: `${top}px`, height: `${height}px` };

                                                return (
                                                    <div
                                                        key={appt.id}
                                                        className={classNames(cls.apptCard, {}, [statusCls])}
                                                        style={cardStyle}
                                                    >
                                                        <span className={cls.apptTime} style={isScheduled ? { color: color.timeText } : {}}>{timeLabel}</span>
                                                        {clientName && (
                                                            <button className={cls.apptLink} onClick={(e) => { e.stopPropagation(); appt.client?.id && navigate(getRouteClientDetails(String(appt.client.id))); }}>
                                                                {clientName}
                                                            </button>
                                                        )}
                                                        {appt.procedure?.name && (
                                                            <button className={cls.apptProc} onClick={(e) => { e.stopPropagation(); appt.procedure?.id && navigate(getRouteProcedureDetails(String(appt.procedure.id))); }}>
                                                                {appt.procedure.name}
                                                            </button>
                                                        )}
                                                        {appt.services && appt.services.length > 0 && (
                                                            <div className={cls.apptServices} title={appt.services.map((s) => s.name).join(', ')}>
                                                                {appt.services.slice(0, 2).map((s) => (
                                                                    <span key={s.id ?? s.serviceItemId} className={cls.serviceChip}>{s.name}</span>
                                                                ))}
                                                                {appt.services.length > 2 && (
                                                                    <span className={cls.serviceChip}>+{appt.services.length - 2}</span>
                                                                )}
                                                            </div>
                                                        )}
                                                        {appt.note && (
                                                            <span className={cls.apptNote} title={appt.note}>
                                                                <span className={cls.apptNoteLabel}>Заметка:</span> {appt.note}
                                                            </span>
                                                        )}
                                                        <div className={cls.apptActions}>
                                                            <button className={cls.apptBtn} onClick={(e) => { e.stopPropagation(); openEditModal(appt); }} title="Редактировать">
                                                                <Icon Svg={EditIcon} width={11} height={11} color="stroke" />
                                                            </button>
                                                            {canDeleteAppointment(appt) && (
                                                                <button className={classNames(cls.apptBtn, {}, [cls.delBtn])} onClick={(e) => { e.stopPropagation(); openDeleteConfirm(appt); }} title="Удалить">
                                                                    ×
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ══════ WEEK VIEW ══════ */}
                    {viewType === 'week' && (
                        <>
                            <div className={cls.wkTableWrap}>
                                <table className={cls.wkTable}>
                                    <thead>
                                        <tr>
                                            <th className={cls.wkTimeCell}>Время</th>
                                            {weekDaysDates.map((dayDate, idx) => (
                                                <th key={dayDate.toISOString()} className={cls.wkDayHead}>
                                                    <Text title={WEEK_DAYS[idx]} bold />
                                                    <Text text={dayDate.toLocaleDateString('ru-RU')} />
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {timeSlots.map((slot) => (
                                            <tr key={slot}>
                                                <td className={cls.wkTimeCell}><Text text={slot} bold /></td>
                                                {weekDaysDates.map((dayDate) => {
                                                    const dk = dayDate.toDateString();
                                                    const events = weekEventsByDay[dk]?.[slot] || [];
                                                    const isBusy = busySlotsByDay.has(`${dk}|${slot}`);
                                                    return (
                                                        <td key={`${dk}-${slot}`} className={classNames(cls.wkCell, { [cls.wkBusyCell]: isBusy })}>
                                                            {events.length ? (
                                                                <div className={cls.wkCards}>{events.map(renderWeekCard)}</div>
                                                            ) : (
                                                                <Button className={cls.wkEmpty} theme={ButtonTheme.CLEAR} onClick={() => openCreateModal(toDateInputValue(dayDate), slot, doctorFilter !== 'all' ? doctorFilter : '')}>
                                                                    + Создать
                                                                </Button>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile list (week) */}
                            <div className={cls.mobileList}>
                                {weekDaysDates.map((dayDate, idx) => {
                                    const dk = dayDate.toDateString();
                                    const dayEvents = filteredForWeek
                                        .filter((e) => {
                                            const sv = getAppointmentStart(e);
                                            if (!sv) return false;
                                            const d = new Date(sv);
                                            return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toDateString() === dk;
                                        })
                                        .sort((a, b) => (getAppointmentStart(a) || '').localeCompare(getAppointmentStart(b) || ''));

                                    return (
                                        <div key={dk} className={cls.mobileDay}>
                                            <Text title={`${WEEK_DAYS[idx]} ${dayDate.toLocaleDateString('ru-RU')}`} bold />
                                            <div className={cls.wkCards}>
                                                {dayEvents.length
                                                    ? dayEvents.map(renderWeekCard)
                                                    : <Button className={cls.wkEmpty} theme={ButtonTheme.CLEAR} onClick={() => openCreateModal(toDateInputValue(dayDate), '10:00')}>+ Создать запись</Button>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}

                </VStack>
            </Page>

            {/* ── Edit modal ── */}
            <Modal isOpen={Boolean(editingAppointment)} onClose={closeEditModal} lazy>
                <VStack gap="16" max align="stretch">
                    <Text title="Редактирование сеанса" bold />

                    <div className={cls.editGrid}>
                        <Input label="Дата" type="date" value={editingDate} onChange={(v) => setEditingDate(v || '')} />
                        <Input label="Время" type="text" placeholder="11:00" value={editingTime} onChange={(v) => setEditingTime(v || '')} />
                    </div>

                    <div className={cls.editGrid}>
                        <Select label="Статус" options={STATUS_OPTIONS} value={editingStatus} onChange={(v) => setEditingStatus(v || 'SCHEDULED')} />
                        <Select label="Метод оплаты" options={pmOptions} value={editingPaymentMethod} onChange={(v) => setEditingPaymentMethod(v || 'CASH')} />
                    </div>

                    <Input
                        fullWidth
                        label="Процедура"
                        value={editingAppointment?.procedure?.name || '—'}
                        readonly
                    />

                    <div className={cls.editSection}>
                        <Text text="Услуги" bold className={cls.editSectionTitle} />
                        <VStack gap="8">
                            {editingServiceLines.map((item, index) => (
                                <div key={item.key} className={cls.editLineItem}>
                                    <Select
                                        label={index === 0 ? 'Услуга' : undefined}
                                        options={optionsForEditRow(item)}
                                        value={item.serviceId}
                                        defaultValue={servicesForEditingProcedure.length ? 'Выберите услугу' : '—'}
                                        readonly={!servicesForEditingProcedure.length && !item.serviceId}
                                        onChange={(v) => onChangeEditService(item.key, v)}
                                    />
                                    <span className={cls.editItemPrice}>
                                        {item.price > 0 ? `${item.price.toLocaleString('ru-RU')} ₴` : ''}
                                    </span>
                                    <button
                                        className={cls.editRemoveBtn}
                                        onClick={() => removeEditServiceLine(item.key)}
                                        type="button"
                                        title={editingServiceLines.length > 1 ? 'Удалить строку' : 'Сбросить услугу'}
                                    >×</button>
                                </div>
                            ))}
                        </VStack>
                        <button className={cls.editAddLineBtn} onClick={addEditServiceLine} type="button">
                            + Добавить услугу
                        </button>
                    </div>

                    <div className={cls.editGrid}>
                        <Input
                            fullWidth
                            label="Базовая стоимость"
                            type="number"
                            value={String(editTotalFromLines > 0 ? editTotalFromLines : editingFinalAmount)}
                            onChange={(v) => { if (editTotalFromLines === 0) setEditingFinalAmount(Number(v || 0)); }}
                            readonly={editTotalFromLines > 0}
                        />
                        <Input
                            fullWidth
                            label="Скидка (фикс.)"
                            type="number"
                            value={String(editingDiscount)}
                            onChange={(v) => setEditingDiscount(Number(v || 0))}
                        />
                    </div>

                    <div className={cls.editTotal}>
                        <span>Итого к оплате</span>
                        <span className={cls.editTotalAmount}>
                            {Math.max(0, (editTotalFromLines > 0 ? editTotalFromLines : editingFinalAmount) - editingDiscount).toLocaleString('ru-RU')} ₴
                        </span>
                    </div>

                    <Textarea fullWidth placeholder="Заметка" value={editingNote} onChange={(v) => setEditingNote(v || '')} />

                    <HStack justify="between" max>
                        {editingAppointment && canDeleteAppointment(editingAppointment) && (
                            <Button
                                theme={ButtonTheme.OUTLINE_RED}
                                onClick={() => {
                                    closeEditModal();
                                    openDeleteConfirm(editingAppointment);
                                }}
                            >
                                Удалить запись
                            </Button>
                        )}
                        <HStack gap="8" justify="end">
                            <Button theme={ButtonTheme.OUTLINE} onClick={closeEditModal}>Отмена</Button>
                            <Button theme={ButtonTheme.BACKGROUND_INVERTED} onClick={onSaveAppointment}>Сохранить</Button>
                        </HStack>
                    </HStack>
                </VStack>
            </Modal>

            <AppoimentFormModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                reloadPage={() => dispatch(fetchAppoimentsList({ replace: true, noQuery: true }))}
                initialDate={createDate}
                initialTime={createTime}
                initialDoctorId={createDoctorId}
            />

            <ConfirmActionModal
                isOpen={Boolean(deleteAppointment)}
                onClose={closeDeleteConfirm}
                onConfirm={onDeleteAppointment}
                title="Удалить сеанс?"
                description="Это действие нельзя отменить. Прошедшие сеансы удалить нельзя."
                cancelText="Отмена"
                confirmText="Удалить"
            />
        </DynamicModuleLoader>
    );
};

export default memo(CalendarPage);
