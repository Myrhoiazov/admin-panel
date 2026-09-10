import React, { memo, useCallback, useMemo, useState } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import s from './AppoimentsPage.module.scss';
import { Page } from '@/widgets/Page/Page';
import { Text } from '@/shared/ui/Text/Text';

import { appoimentsPageReducer, getAppointments } from '../../model/slices/appoimentsPageSlice';
import {
    DynamicModuleLoader,
    ReducersList,
} from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { HStack } from '@/shared/ui/Stack';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { fetchAppoimentsList } from '../../model/services/fetchAppoimentsList/fetchAppoimentsList';
import { initAppoimentPage } from '../../model/services/initAppoimentPage/initAppoimentPage';
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect';
import { useSearchParams } from 'react-router-dom';
import { AppoimentList } from '@/entities/Appointment';
import { useSelector } from 'react-redux';
import { AppoimentFilters } from '@/widgets/AppoimentFilters';
import { FiltersContainer } from '../FiltersContainer/FiltersContainer';
import { Button, ButtonTheme } from '@/shared/ui/Button';
import { Select } from '@/shared/ui/Select/Select';
import { Appointment } from '@/entities/Appointment';
import { EdditAppoimentDropdown } from '@/features/edditAppoimentDropdown';

interface AppoimentsPageProps {
    className?: string;
}

const reducers: ReducersList = {
    appoimentPage: appoimentsPageReducer,
};

const getAppointmentStartTime = (appointment: Appointment) => {
    const startValue = appointment.startAt || appointment.createdAt;
    const start = startValue ? new Date(startValue).getTime() : NaN;
    return Number.isNaN(start) ? null : start;
};

const getAppointmentEndTime = (appointment: Appointment) => {
    const start = getAppointmentStartTime(appointment);
    if (!start) {
        return null;
    }

    const end = appointment.endAt ? new Date(appointment.endAt).getTime() : NaN;
    if (!Number.isNaN(end)) {
        return end;
    }

    return start + (appointment.durationMin || 60) * 60 * 1000;
};

const canDeleteAppointment = (appointment: Appointment, now: number) => {
    const end = getAppointmentEndTime(appointment);
    return Boolean(appointment.id && end && end > now && (appointment.status || 'SCHEDULED') === 'SCHEDULED');
};

const AppoimentsPage = ({ className }: AppoimentsPageProps) => {
    const dispatch = useAppDispatch();
    const appoiments = useSelector(getAppointments.selectAll);
    const [searchParams] = useSearchParams();
    const [mode, setMode] = useState<'upcoming' | 'past'>('upcoming');
    const [doctorFilter, setDoctorFilter] = useState('all');
    const [procedureFilter, setProcedureFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    useInitialEffect(() => {
        dispatch(initAppoimentPage(searchParams));
    });

    const fetchAllAppointments = useCallback(() => {
        dispatch(fetchAppoimentsList({ replace: true, noQuery: true }));
    }, [dispatch]);

    const now = Date.now();
    const filteredAppointments = useMemo(
        () => appoiments.filter((a) => {
            const end = getAppointmentEndTime(a);
            if (!end) {
                return false;
            }
            const byMode = mode === 'upcoming' ? end > now : end <= now;
            const byDoctor = doctorFilter === 'all' || String(a.doctor?.id || a.doctorId || '') === doctorFilter;
            const byProcedure = procedureFilter === 'all'
                || (a.procedures || []).some((p) => String(p.procedure?.id ?? p.procedureId) === procedureFilter);
            const byStatus = statusFilter === 'all' || (a.status || 'SCHEDULED') === statusFilter;
            return byMode && byDoctor && byProcedure && byStatus;
        }),
        [appoiments, doctorFilter, mode, now, procedureFilter, statusFilter],
    );

    const doctorOptions = useMemo(() => {
        const map = new Map<string, string>();
        appoiments.forEach((a) => {
            const id = String(a.doctor?.id || a.doctorId || '');
            if (id) {
                map.set(id, a.doctor?.firstName || a.doctor?.email || `Доктор #${id}`);
            }
        });
        return [{ value: 'all', content: 'Все доктора' }, ...Array.from(map.entries()).map(([value, content]) => ({ value, content }))];
    }, [appoiments]);

    const procedureOptions = useMemo(() => {
        const map = new Map<string, string>();
        appoiments.forEach((a) => {
            (a.procedures || []).forEach((p) => {
                const id = String(p.procedure?.id ?? p.procedureId ?? '');
                if (id) {
                    map.set(id, p.procedure?.name || `Процедура #${id}`);
                }
            });
        });
        return [{ value: 'all', content: 'Все процедуры' }, ...Array.from(map.entries()).map(([value, content]) => ({ value, content }))];
    }, [appoiments]);

    return (
        <DynamicModuleLoader reducers={reducers}>
            <Page className={classNames(s.AppoimentPage, {}, [className])}>
                <HStack gap="32" justify="between" align="center" max>
                    <Text title="Список сеансов" bold />
                    <FiltersContainer reloadPage={fetchAllAppointments} />
                </HStack>
                <HStack gap="8" className={s.tabs}>
                    <Button
                        theme={mode === 'upcoming' ? ButtonTheme.BACKGROUND_INVERTED : ButtonTheme.OUTLINE}
                        onClick={() => setMode('upcoming')}
                    >
                        Предстоящие
                    </Button>
                    <Button
                        theme={mode === 'past' ? ButtonTheme.BACKGROUND_INVERTED : ButtonTheme.OUTLINE}
                        onClick={() => setMode('past')}
                    >
                        Прошлые
                    </Button>
                </HStack>
                <HStack gap="8" className={s.tabs}>
                    <Select label="Доктор" options={doctorOptions} value={doctorFilter} onChange={(v) => setDoctorFilter(v || 'all')} />
                    <Select label="Процедура" options={procedureOptions} value={procedureFilter} onChange={(v) => setProcedureFilter(v || 'all')} />
                    <Select
                        label="Статус"
                        options={[
                            { value: 'all', content: 'Все статусы' },
                            { value: 'SCHEDULED', content: 'Запланирован' },
                            { value: 'COMPLETED', content: 'Завершен' },
                            { value: 'CANCELLED', content: 'Отменен' },
                            { value: 'NO_SHOW', content: 'Не пришел' },
                        ]}
                        value={statusFilter}
                        onChange={(v) => setStatusFilter(v || 'all')}
                    />
                </HStack>
                <AppoimentList
                    appoiments={filteredAppointments}
                    className={s.list}
                    renderAction={(appoiment) => (
                        <EdditAppoimentDropdown
                            appointmentId={String(appoiment.id)}
                            reloadPage={fetchAllAppointments}
                            canDelete={canDeleteAppointment(appoiment, now)}
                        />
                    )}
                />
            </Page>
        </DynamicModuleLoader>
    );
};

export default memo(AppoimentsPage);
