import { memo } from 'react';
import { Select } from '@/shared/ui/Select/Select';
import { Procedure } from '@/entities/Procedure';
import { classNames } from '@/shared/lib/classNames/classNames';
import { ProcedureRow, ServiceCategoryLite, servicesForProcedureId } from '../../lib/useProcedureRows/useProcedureRows';
import cls from './ProcedureServiceRows.module.scss';

interface ProcedureServiceRowsProps {
    className?: string;
    rows: ProcedureRow[];
    procedures?: Procedure[];
    allCategories: ServiceCategoryLite[];
    onChangeProcedure: (key: string, procedureId: string) => void;
    onChangeService: (key: string, serviceId: string) => void;
    onAddService: () => void;
    onAddProcedure: () => void;
    onRemove: (key: string) => void;
}

export const ProcedureServiceRows = memo((props: ProcedureServiceRowsProps) => {
    const {
        className, rows, procedures, allCategories,
        onChangeProcedure, onChangeService, onAddService, onAddProcedure, onRemove,
    } = props;

    const procedureOptions = (procedures || []).map((p) => ({ value: String(p.id), content: p.name ?? '' }));
    const lastProcedureId = [...rows].reverse().find((row) => row.procedureId)?.procedureId || '';
    const servicesForLastRow = servicesForProcedureId(allCategories, lastProcedureId);

    return (
        <div className={classNames(cls.ProcedureServiceRows, {}, [className])}>
            {rows.map((row, index) => {
                const servicesForRow = servicesForProcedureId(allCategories, row.procedureId);
                const serviceOptions = servicesForRow.map((s) => ({ value: String(s.id), content: s.name }));
                const options = row.serviceId && !servicesForRow.some((s) => String(s.id) === row.serviceId)
                    ? [{ value: row.serviceId, content: `${row.serviceName || 'Услуга'} (деактивирована)` }, ...serviceOptions]
                    : serviceOptions;

                return (
                    <div key={row.key} className={cls.row}>
                        <Select
                            label={index === 0 ? 'Процедура' : undefined}
                            options={procedureOptions}
                            value={row.procedureId}
                            defaultValue="Выберите процедуру"
                            onChange={(v) => onChangeProcedure(row.key, v)}
                        />
                        <Select
                            label={index === 0 ? 'Услуга' : undefined}
                            options={options}
                            value={row.serviceId}
                            defaultValue={row.procedureId
                                ? (options.length ? 'Выберите услугу' : '—')
                                : 'Сначала выберите процедуру'}
                            readonly={!row.procedureId || !options.length}
                            onChange={(v) => onChangeService(row.key, v)}
                        />
                        <span className={cls.price}>
                            {row.price > 0 ? `${row.price.toLocaleString('ru-RU')} ₴` : ''}
                        </span>
                        <button
                            className={cls.removeBtn}
                            onClick={() => onRemove(row.key)}
                            type="button"
                            title={rows.length > 1 ? 'Удалить строку' : 'Сбросить строку'}
                        >
                            ×
                        </button>
                    </div>
                );
            })}
            <div className={cls.actions}>
                <button
                    className={cls.addLineBtn}
                    onClick={onAddService}
                    type="button"
                    disabled={!lastProcedureId || !servicesForLastRow.length}
                >
                    + Добавить услугу
                </button>
                <button className={cls.addLineBtn} onClick={onAddProcedure} type="button">
                    + Добавить процедуру
                </button>
            </div>
        </div>
    );
});
