import { useCallback, useState } from 'react';

export interface ServiceItemLite { id: number; name: string; price: number; }
export interface ServiceCategoryLite { id: number; name: string; procedureId: number | null; items: ServiceItemLite[]; }

export interface ProcedureRow {
    key: string;
    procedureId: string;
    serviceId: string;
    serviceName: string;
    price: number;
}

export const makeRowKey = () => Math.random().toString(36).slice(2);

export const emptyProcedureRow = (procedureId = ''): ProcedureRow => ({
    key: makeRowKey(),
    procedureId,
    serviceId: '',
    serviceName: '',
    price: 0,
});

export const servicesForProcedureId = (allCategories: ServiceCategoryLite[], procedureId: string): ServiceItemLite[] =>
    procedureId ? allCategories.filter((c) => c.procedureId === Number(procedureId)).flatMap((c) => c.items) : [];

/**
 * Total across all procedure groups in the row list: a group with at least one selected
 * service sums its rows' prices; a group with a procedure chosen but no service yet falls
 * back to that procedure's basePrice (generalizes the old single-procedure `totalAmount ||
 * procedure.basePrice` fallback to each procedure independently).
 */
export const computeProceduresTotal = (
    rows: ProcedureRow[],
    procedures: { id: number; basePrice?: number }[],
): number => {
    const order: number[] = [];
    const byProcedure = new Map<number, ProcedureRow[]>();
    rows.forEach((row) => {
        if (!row.procedureId) return;
        const procedureId = Number(row.procedureId);
        if (!byProcedure.has(procedureId)) {
            byProcedure.set(procedureId, []);
            order.push(procedureId);
        }
        byProcedure.get(procedureId)!.push(row);
    });

    return order.reduce((sum, procedureId) => {
        const groupRows = byProcedure.get(procedureId)!;
        if (groupRows.some((row) => row.serviceId)) {
            return sum + groupRows.reduce((rowSum, row) => rowSum + (row.price || 0), 0);
        }
        const procedure = procedures.find((p) => p.id === procedureId);
        return sum + Number(procedure?.basePrice || 0);
    }, 0);
};

/**
 * Groups rows sharing a procedureId into one entry each (in first-seen order), the shape the
 * backend expects for `procedures: [{ procedureId, serviceItemIds }]`. Rows with no procedure
 * selected are dropped — they're incomplete, not a group of their own.
 */
export const groupProcedureRows = (rows: ProcedureRow[]): { procedureId: number; serviceItemIds: number[] }[] => {
    const order: number[] = [];
    const byProcedure = new Map<number, number[]>();
    rows.forEach((row) => {
        if (!row.procedureId) return;
        const procedureId = Number(row.procedureId);
        if (!byProcedure.has(procedureId)) {
            byProcedure.set(procedureId, []);
            order.push(procedureId);
        }
        if (row.serviceId) byProcedure.get(procedureId)!.push(Number(row.serviceId));
    });
    return order.map((procedureId) => ({ procedureId, serviceItemIds: byProcedure.get(procedureId)! }));
};

/**
 * Shared row-state logic for the "процедура + услуга" list used by both the appointment
 * create form and the edit modal. A row is a (procedureId, serviceId) pair; "+ Добавить
 * услугу" duplicates the row's own procedure with an empty service, "+ Добавить процедуру"
 * adds a row with an empty procedure.
 */
export const useProcedureRows = (initial?: ProcedureRow[]) => {
    const [rows, setRows] = useState<ProcedureRow[]>(initial?.length ? initial : [emptyProcedureRow()]);

    const resetRows = useCallback((next: ProcedureRow[]) => {
        setRows(next.length ? next : [emptyProcedureRow()]);
    }, []);

    const addServiceLine = useCallback(() => {
        setRows((prev) => {
            const lastProcedureId = [...prev].reverse().find((row) => row.procedureId)?.procedureId || '';
            return [...prev, emptyProcedureRow(lastProcedureId)];
        });
    }, []);

    const addProcedureLine = useCallback(() => {
        setRows((prev) => [...prev, emptyProcedureRow()]);
    }, []);

    const onChangeRowProcedure = useCallback((key: string, procedureId: string) => {
        setRows((prev) => prev.map((row) => (row.key === key
            ? { ...row, procedureId, serviceId: '', serviceName: '', price: 0 }
            : row)));
    }, []);

    const onChangeRowService = useCallback((key: string, serviceId: string, servicesForRow: ServiceItemLite[]) => {
        setRows((prev) => prev.map((row) => {
            if (row.key !== key) return row;
            const service = servicesForRow.find((item) => String(item.id) === serviceId);
            return { ...row, serviceId, serviceName: service?.name || '', price: service?.price || 0 };
        }));
    }, []);

    const removeRow = useCallback((key: string) => {
        setRows((prev) => {
            if (prev.length === 1) {
                return prev.map((row) => (row.key === key ? emptyProcedureRow() : row));
            }
            return prev.filter((row) => row.key !== key);
        });
    }, []);

    const totalAmount = rows.reduce((sum, row) => sum + (row.price || 0), 0);

    return {
        rows,
        resetRows,
        addServiceLine,
        addProcedureLine,
        onChangeRowProcedure,
        onChangeRowService,
        removeRow,
        totalAmount,
    };
};
