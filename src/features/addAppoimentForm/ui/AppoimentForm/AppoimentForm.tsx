import { classNames } from '@/shared/lib/classNames/classNames';
import { useTranslation } from 'react-i18next';
import cls from './AppoimentForm.module.scss';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { VStack, HStack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text/Text';
import { Button, ButtonTheme } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input/Input';
import { Select } from '@/shared/ui/Select/Select';
import {
    DynamicModuleLoader,
    ReducersList,
} from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { appoimentActions, appoimentReducer } from '../../model/slices/appoimentSlice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { getAddAppoimentProcedures } from '../../model/selectors/getAddAppoimentProcedures/getAddAppoimentProcedures';
import { Procedure } from '@/entities/Procedure';
import { addAppoiment } from '../../model/services/addAppoiment/addAppoiment';
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect';
import { fetchProceduresList } from '../../model/services/fetchProceduresList/fetchProceduresList';
import { getAddAppoimentForm } from '@/features/addAppoimentForm/model/selectors/getAddAppoimentForm/getAddClientForm';
import { Client } from '@/entities/Client/model/types/client';
import { ClientAutocomplete, CLIENT_SEARCH_MIN_QUERY_LENGTH, isValidUkrainianPhone, normalizeUkrainianPhone } from '@/entities/Client';
import { User } from '@/entities/User';
import { getAddAppoimentDoctors } from '../../model/selectors/getAddAppoimentDocters/getAddAppoimentDocters';
import { fetchDoctorsList } from '../../model/services/fetchDoctorsList/fetchDoctorsList';
import { toast } from 'react-toastify';
import { $apiPrivate } from '@/shared/api/api';
import { Appointment, ProcedureServiceRows, useProcedureRows, groupProcedureRows, computeProceduresTotal } from '@/entities/Appointment';
import { DoctorSelect } from '@/entities/Appointment/ui/DoctorSelect/DoctorSelect';
import Textarea from '@/shared/ui/Textarea/Textarea';

interface ServiceItem { id: number; name: string; price: number; }
interface ServiceCategory { id: number; name: string; procedureId: number | null; items: ServiceItem[]; }

const STATUS_OPTIONS = [
    { value: 'SCHEDULED', content: 'Запланирован' },
    { value: 'COMPLETED', content: 'Завершен' },
    { value: 'CANCELLED', content: 'Отменен' },
    { value: 'NO_SHOW', content: 'Не пришел' },
];

const DEFAULT_DURATION_OPTIONS = [
    { value: '20', content: '20 мин' },
    { value: '40', content: '40 мин' },
    { value: '60', content: '60 мин' },
    { value: '120', content: '120 мин' },
    { value: 'custom', content: 'Произвольное' },
];

const toDateInputValue = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

const getAppointmentStart = (a: Appointment) => a.startAt || a.createdAt;

const initialReducers: ReducersList = { addAppoimentForm: appoimentReducer };

const AppoimentForm = memo((props: {
    className?: string;
    isOpen?: boolean;
    onSuccess: () => void;
    reloadPage?: () => void;
    userId?: string;
    initialDate?: string;
    initialTime?: string;
    initialDoctorId?: string;
}) => {
    const { className, isOpen, initialDate, initialDoctorId, initialTime, onSuccess, reloadPage, userId } = props;
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [allCategories, setAllCategories] = useState<ServiceCategory[]>([]);
    const { rows, addServiceLine, addProcedureLine, onChangeRowProcedure, onChangeRowService, removeRow, resetRows } = useProcedureRows();
    const [showCustomDuration, setShowCustomDuration] = useState(false);
    const [customDurationInput, setCustomDurationInput] = useState('60');
    const [note, setNote] = useState('');

    // client quick-search / create
    const [clientQuery, setClientQuery] = useState('');
    const [foundClient, setFoundClient] = useState<Client | null>(null);
    const [hasNoMatches, setHasNoMatches] = useState(false);
    const [newClientPhone, setNewClientPhone] = useState('');
    const [newClientFirstName, setNewClientFirstName] = useState('');
    const [newClientLastName, setNewClientLastName] = useState('');
    const [firstNameTouched, setFirstNameTouched] = useState(false);
    const [phoneError, setPhoneError] = useState<string | undefined>();

    // whether the search text itself looks like a phone number rather than a name — if so, that
    // same text becomes the new client's phone directly instead of asking for it a second time
    const clientQueryLooksLikePhone = useMemo(() => /^[+\d][\d\s-]*$/.test(clientQuery.trim()), [clientQuery]);

    const procedures = useSelector(getAddAppoimentProcedures);
    const docters = useSelector(getAddAppoimentDoctors);
    const formData = useSelector(getAddAppoimentForm);

    // "Main" procedure of the session — the first row with a procedure selected — used only to
    // derive default duration/time-slot options, not for pricing (see computeProceduresTotal).
    const primaryProcedureId = rows.find((row) => row.procedureId)?.procedureId || '';
    const primaryProcedure = procedures?.find((p) => String(p.id) === primaryProcedureId);
    const appointmentDate = formData?.startAt ? String(formData.startAt).slice(0, 10) : (initialDate || toDateInputValue(new Date()));
    const appointmentTime = formData?.startAt && String(formData.startAt).includes('T')
        ? String(formData.startAt).slice(11, 16)
        : (initialTime || '');
    const durationValue = String(formData?.durationMin || primaryProcedure?.defaultDurationMin || '60');
    const statusValue = formData?.status || 'SCHEDULED';

    const totalAmount = computeProceduresTotal(rows, (procedures || []).map((p) => ({ id: Number(p.id), basePrice: p.basePrice })));

    useInitialEffect(() => {
        dispatch(fetchProceduresList());
        dispatch(fetchDoctorsList());
    });

    useEffect(() => {
        $apiPrivate.get<ServiceCategory[]>('/services')
            .then(({ data }) => setAllCategories(data || []))
            .catch(() => {});
        $apiPrivate.get<Appointment[]>('/appointments')
            .then(({ data }) => setAppointments(data || []))
            .catch(() => {});
    }, []);

    // Re-seeds the form every time the modal is opened (not just on first mount) — the form
    // instance stays mounted (hidden) between opens, and its Redux slice is shared with any
    // other appointment-form instance (e.g. the calendar's), so without this the doctor/date
    // picked there would leak into a later open of this one.
    useEffect(() => {
        if (isOpen === false) return;
        const baseDate = initialDate || toDateInputValue(new Date());
        const baseTime = initialTime || '10:00';
        dispatch(appoimentActions.updateAppoiment({
            startAt: `${baseDate}T${baseTime}:00`,
            doctorId: initialDoctorId,
            paymentMethod: 'CASH',
            status: 'SCHEDULED',
            durationMin: 60,
            discountAmount: 0,
        }));
    }, [dispatch, initialDate, initialDoctorId, initialTime, isOpen]);

    useEffect(() => {
        if (userId) dispatch(appoimentActions.updateAppoiment({ clientId: userId }));
    }, [dispatch, userId]);

    const onClientQueryChange = useCallback((value: string) => {
        setClientQuery(value);
        if (foundClient) {
            setFoundClient(null);
            dispatch(appoimentActions.updateAppoiment({ clientId: undefined }));
        }
    }, [dispatch, foundClient]);

    const onClientResultsChange = useCallback((results: Client[], query: string) => {
        setHasNoMatches(query.length >= CLIENT_SEARCH_MIN_QUERY_LENGTH && results.length === 0);
    }, []);

    const onClientFound = useCallback((client: Client) => {
        setFoundClient(client);
        setHasNoMatches(false);
        setPhoneError(undefined);
        dispatch(appoimentActions.updateAppoiment({ clientId: String(client.id) }));
    }, [dispatch]);

    const onResetClient = useCallback(() => {
        setFoundClient(null);
        setClientQuery('');
        setHasNoMatches(false);
        setNewClientPhone('');
        setNewClientFirstName('');
        setNewClientLastName('');
        setFirstNameTouched(false);
        setPhoneError(undefined);
        dispatch(appoimentActions.updateAppoiment({ clientId: undefined }));
    }, [dispatch]);

    // When the search text isn't phone-shaped (a name search came up empty), mirror it into the
    // "Имя" field so the user doesn't have to retype what they already searched for — keeps
    // following the live search text until the user edits the field themselves.
    useEffect(() => {
        if (!hasNoMatches || clientQueryLooksLikePhone || firstNameTouched) return;
        setNewClientFirstName(clientQuery.trim());
    }, [hasNoMatches, clientQueryLooksLikePhone, clientQuery, firstNameTouched]);

// -- (procedure/service row handlers now come from useProcedureRows) --

    // Keeps the default duration in sync with the session's "main" procedure (first row) —
    // only fires when that procedure actually changes, so it doesn't fight a duration the user
    // picked manually afterwards.
    const prevPrimaryProcedureIdRef = useRef('');
    useEffect(() => {
        if (primaryProcedureId && primaryProcedureId !== prevPrimaryProcedureIdRef.current) {
            const proc = procedures?.find((p) => String(p.id) === primaryProcedureId);
            dispatch(appoimentActions.updateAppoiment({ durationMin: proc?.defaultDurationMin || 60 }));
        }
        prevPrimaryProcedureIdRef.current = primaryProcedureId;
    }, [primaryProcedureId, procedures, dispatch]);

    const onChangeRowServiceForRow = useCallback((key: string, serviceId: string) => {
        const row = rows.find((r) => r.key === key);
        const servicesForRow = row
            ? allCategories.filter((c) => c.procedureId === Number(row.procedureId)).flatMap((c) => c.items)
            : [];
        onChangeRowService(key, serviceId, servicesForRow);
    }, [rows, allCategories, onChangeRowService]);

    const onChangeDoctor = useCallback((value?: User) => {
        dispatch(appoimentActions.updateAppoiment({ doctorId: value?.id }));
    }, [dispatch]);

    const onChangeDate = useCallback((value?: string) => {
        dispatch(appoimentActions.updateAppoiment({ startAt: `${value || ''}T${appointmentTime}:00` }));
    }, [appointmentTime, dispatch]);

    const onChangeTime = useCallback((value?: string) => {
        dispatch(appoimentActions.updateAppoiment({ startAt: `${appointmentDate}T${value || ''}:00` }));
    }, [appointmentDate, dispatch]);

    const onChangeDuration = useCallback((value?: string) => {
        if (value === 'custom') {
            setShowCustomDuration(true);
        } else {
            setShowCustomDuration(false);
            dispatch(appoimentActions.updateAppoiment({ durationMin: Number(value || 60) }));
        }
    }, [dispatch]);

    const onChangeCustomDuration = useCallback((value?: string) => {
        setCustomDurationInput(value || '');
        const mins = Number(value || 0);
        if (mins > 0) dispatch(appoimentActions.updateAppoiment({ durationMin: mins }));
    }, [dispatch]);

    const onChangeStatus = useCallback((value?: string) => {
        dispatch(appoimentActions.updateAppoiment({
            status: (value || 'SCHEDULED') as 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW',
        }));
    }, [dispatch]);

    const durationOptions = useMemo(() => {
        if (!formData?.doctorId || !appointmentDate || !appointmentTime) {
            return DEFAULT_DURATION_OPTIONS;
        }
        const start = new Date(`${appointmentDate}T${appointmentTime || '00:00'}:00`);
        const sameDayAppts = appointments
            .filter((item) => String(item.doctorId || item.doctor?.id || '') === String(formData.doctorId))
            .map((item) => {
                const startValue = getAppointmentStart(item);
                const from = startValue ? new Date(startValue) : null;
                const to = item.endAt ? new Date(item.endAt) : (from ? new Date(from.getTime() + (item.durationMin || 60) * 60000) : null);
                return { from, to };
            })
            .filter((item): item is { from: Date; to: Date } => Boolean(item.from && item.to))
            .filter((item) => item.from.toDateString() === start.toDateString())
            .sort((a, b) => a.from.getTime() - b.from.getTime());

        const dayEnd = new Date(`${appointmentDate}T21:00:00`);
        const nextAppt = sameDayAppts.find((item) => item.from.getTime() > start.getTime());
        const hardEnd = nextAppt ? nextAppt.from : dayEnd;
        const maxMinutes = Math.max(20, Math.floor((hardEnd.getTime() - start.getTime()) / 60000));
        const options = [20, 40, 60, 120]
            .filter((m) => m <= maxMinutes)
            .map((m) => ({ value: String(m), content: `${m} мин` }));

        if (primaryProcedure?.durationType === 'FLEXIBLE' || primaryProcedure?.isFlexibleDuration) {
            options.push({ value: String(maxMinutes), content: `Гибко (${maxMinutes} мин)` });
        }

        const base = options.length ? options : [{ value: '20', content: '20 мин' }];
        return [...base, { value: 'custom', content: 'Произвольное' }];
    }, [appointmentDate, appointmentTime, appointments, primaryProcedure, formData?.doctorId]);

    const availableTimeOptions = useMemo(() => {
        if (!formData?.doctorId || !appointmentDate) return [];
        const durationMin = Number(durationValue || 60);
        const now = new Date();
        const slots: Array<{ value: string; content: string }> = [];
        for (let minutes = 8 * 60; minutes <= 20 * 60; minutes += 20) {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            const time = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
            const slotStart = new Date(`${appointmentDate}T${time}:00`);
            if (slotStart < now) continue;
            const slotEnd = new Date(slotStart.getTime() + durationMin * 60000);
            const hasOverlap = appointments.some((item) => {
                const doctorId = String(item.doctorId || item.doctor?.id || '');
                if (doctorId !== String(formData.doctorId)) return false;
                const startValue = getAppointmentStart(item);
                if (!startValue) return false;
                const itemStart = new Date(startValue);
                const itemEnd = item.endAt ? new Date(item.endAt) : new Date(itemStart.getTime() + (item.durationMin || 60) * 60000);
                return slotStart < itemEnd && slotEnd > itemStart;
            });
            if (!hasOverlap && slotEnd <= new Date(`${appointmentDate}T21:00:00`)) {
                slots.push({ value: time, content: time });
            }
        }
        return slots;
    }, [appointmentDate, appointments, durationValue, formData?.doctorId]);

    useEffect(() => {
        if (!formData?.doctorId || !appointmentDate || !availableTimeOptions.length) return;
        const hasSelectedTime = availableTimeOptions.some((item) => item.value === appointmentTime);
        if (!hasSelectedTime) onChangeTime(availableTimeOptions[0].value);
    }, [appointmentDate, appointmentTime, availableTimeOptions, formData?.doctorId, onChangeTime]);

    const validationError = useMemo(() => {
        if (formData?.doctorId && appointmentDate && availableTimeOptions.length === 0) {
            return 'На выбранный день нет свободного времени для этого доктора';
        }
        return '';
    }, [appointmentDate, availableTimeOptions.length, formData?.doctorId]);

    const onSave = useCallback(async () => {
        const groupedProcedures = groupProcedureRows(rows);
        let clientId = formData?.clientId;

        // create new client if searched but not found in DB
        if (!clientId && !userId && hasNoMatches) {
            const rawPhone = clientQueryLooksLikePhone ? clientQuery : newClientPhone;
            const normalizedPhone = normalizeUkrainianPhone(rawPhone);
            if (!isValidUkrainianPhone(normalizedPhone)) {
                setPhoneError('Введите номер в формате +380XXXXXXXXX');
                toast.error('Некорректный номер телефона нового клиента');
                return;
            }
            try {
                const { data: newClient } = await $apiPrivate.post<{ id: number }>('/clients', {
                    phoneNumber: normalizedPhone,
                    firstName: newClientFirstName.trim() || undefined,
                    lastName: newClientLastName.trim() || undefined,
                });
                clientId = String(newClient.id);
                dispatch(appoimentActions.updateAppoiment({ clientId }));
            } catch {
                toast.error('Не удалось создать клиента');
                return;
            }
        }

        if (!clientId || groupedProcedures.length === 0 || !formData?.doctorId || !appointmentDate || !appointmentTime) {
            toast.error(t('Заполните клиента, процедуру, доктора, дату и время'));
            return;
        }
        if (validationError) { toast.error(validationError); return; }

        const durationMin = Number(durationValue || primaryProcedure?.defaultDurationMin || 60);
        const startAt = new Date(`${appointmentDate}T${appointmentTime}:00`);
        if (startAt < new Date()) {
            toast.error('Нельзя создать запись на прошедшее время. Выберите другое время.');
            return;
        }
        const endAt = new Date(startAt.getTime() + durationMin * 60000);

        const result = await dispatch(addAppoiment({
            data: {
                startAt: startAt.toISOString(),
                endAt: endAt.toISOString(),
                durationMin,
                discountAmount: 0,
                finalAmount: totalAmount,
                paymentMethod: 'CASH',
                status: statusValue,
                note: note || undefined,
                procedures: groupedProcedures,
            },
        }));
        if (result.meta.requestStatus === 'fulfilled') {
            onSuccess();
            reloadPage?.();
            dispatch(appoimentActions.cleanForm());
            resetRows([]);
            setNote('');
            setClientQuery('');
            setFoundClient(null);
            setHasNoMatches(false);
            setNewClientPhone('');
            setNewClientFirstName('');
            setNewClientLastName('');
            setFirstNameTouched(false);
            setPhoneError(undefined);
            toast.success(t('Запись успешно добавлена'));
        } else {
            toast.error(t('Не удалось создать сеанс. Проверьте свободное окно доктора'));
        }
    }, [
        appointmentDate, appointmentTime, clientQuery, clientQueryLooksLikePhone, dispatch,
        durationValue, primaryProcedure,
        formData?.clientId, formData?.doctorId, hasNoMatches, rows, resetRows,
        newClientFirstName, newClientLastName, newClientPhone, note, onSuccess, reloadPage,
        statusValue, t, totalAmount, userId, validationError,
    ]);

    const selectedDoctor = docters?.find((d) => String(d.id) === String(formData?.doctorId));

    return (
        <DynamicModuleLoader reducers={initialReducers}>
            <div className={classNames(cls.AppoimentForm, {}, [className])}>
                <VStack gap="16" className={cls.header}>
                    <Text size="m" title={t('Создать новую запись')} bold />

                    {!userId && (
                        <div className={cls.clientBlock}>
                            {foundClient ? (
                                <div className={cls.clientFound}>
                                    ✓ Клиент найден: <strong>{foundClient.firstName} {foundClient.lastName}</strong> — {foundClient.phoneNumber}
                                    <button className={cls.clientReset} onClick={onResetClient}>× сбросить</button>
                                </div>
                            ) : (
                                <>
                                    <ClientAutocomplete
                                        label="Клиент (телефон или имя)"
                                        placeholder="+380... или имя"
                                        value={clientQuery}
                                        onChange={onClientQueryChange}
                                        onSelect={onClientFound}
                                        onResultsChange={onClientResultsChange}
                                    />
                                    {hasNoMatches && (
                                        <div className={cls.clientNew}>
                                            <span>Клиент не найден — будет создан новый</span>
                                            {clientQueryLooksLikePhone ? (
                                                <>
                                                    <div className={cls.clientNewPhone}>
                                                        Телефон: <strong>{normalizeUkrainianPhone(clientQuery)}</strong>
                                                    </div>
                                                    <div className={cls.grid2}>
                                                        <Input
                                                            fullWidth
                                                            label="Имя"
                                                            placeholder="Имя"
                                                            value={newClientFirstName}
                                                            onChange={(v) => { setNewClientFirstName(v || ''); setFirstNameTouched(true); }}
                                                        />
                                                        <Input
                                                            fullWidth
                                                            label="Фамилия (необязательно)"
                                                            placeholder="Фамилия"
                                                            value={newClientLastName}
                                                            onChange={(v) => setNewClientLastName(v || '')}
                                                        />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className={cls.grid2}>
                                                        <Input
                                                            fullWidth
                                                            label="Телефон"
                                                            type="tel"
                                                            placeholder="+380..."
                                                            value={newClientPhone}
                                                            onChange={(v) => { setNewClientPhone(v || ''); setPhoneError(undefined); }}
                                                        />
                                                        <Input
                                                            fullWidth
                                                            label="Имя"
                                                            placeholder="Имя"
                                                            value={newClientFirstName}
                                                            onChange={(v) => { setNewClientFirstName(v || ''); setFirstNameTouched(true); }}
                                                        />
                                                    </div>
                                                    <Input
                                                        fullWidth
                                                        label="Фамилия (необязательно)"
                                                        placeholder="Фамилия"
                                                        value={newClientLastName}
                                                        onChange={(v) => setNewClientLastName(v || '')}
                                                    />
                                                </>
                                            )}
                                            {phoneError && <Text text={phoneError} variant="error" />}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    <div className={cls.grid2}>
                        <DoctorSelect
                            onChange={onChangeDoctor}
                            value={selectedDoctor}
                            options={docters}
                        />
                    </div>

                    <div className={cls.grid2}>
                        <Input
                            fullWidth
                            label="Дата"
                            type="date"
                            min={toDateInputValue(new Date())}
                            value={appointmentDate}
                            onChange={onChangeDate}
                        />
                        <Select
                            label="Время"
                            options={availableTimeOptions}
                            value={formData?.doctorId && availableTimeOptions.length ? appointmentTime : ''}
                            defaultValue={formData?.doctorId && appointmentDate ? 'Выберите время' : 'Сначала выберите доктора'}
                            readonly={!formData?.doctorId || !appointmentDate || !availableTimeOptions.length}
                            onChange={onChangeTime}
                        />
                    </div>

                    <div className={cls.grid2}>
                        <div>
                            <Select
                                label="Длительность"
                                options={durationOptions}
                                value={showCustomDuration ? 'custom' : durationValue}
                                onChange={onChangeDuration}
                            />
                            {showCustomDuration && (
                                <Input
                                    fullWidth
                                    label="Минуты"
                                    type="number"
                                    placeholder="90"
                                    value={customDurationInput}
                                    onChange={onChangeCustomDuration}
                                />
                            )}
                        </div>
                        <Select
                            label="Статус"
                            options={STATUS_OPTIONS}
                            value={statusValue}
                            onChange={onChangeStatus}
                        />
                    </div>

                    {validationError && (
                        <Text text={validationError} className={cls.validationError} />
                    )}

                    <div className={cls.section}>
                        <Text text="Процедуры и услуги" bold className={cls.sectionTitle} />
                        <ProcedureServiceRows
                            rows={rows}
                            procedures={procedures}
                            allCategories={allCategories}
                            onChangeProcedure={onChangeRowProcedure}
                            onChangeService={onChangeRowServiceForRow}
                            onAddService={addServiceLine}
                            onAddProcedure={addProcedureLine}
                            onRemove={removeRow}
                        />
                    </div>

                    {totalAmount > 0 && (
                        <div className={cls.total}>
                            <span>Итого</span>
                            <span className={cls.totalAmount}>{totalAmount.toLocaleString('ru-RU')} ₴</span>
                        </div>
                    )}

                    <Textarea
                        placeholder="Нотация к записи (необязательно)"
                        fullWidth
                        value={note}
                        onChange={setNote}
                    />

                    <Button fullWidth onClick={onSave} theme={ButtonTheme.BACKGROUND_INVERTED}>
                        {t('Добавить')}
                    </Button>
                </VStack>
            </div>
        </DynamicModuleLoader>
    );
});

export default AppoimentForm;
