import { memo } from 'react';
import Textarea from '@/shared/ui/Textarea/Textarea';
import { Procedure } from '@/entities/Procedure';
import { Appointment } from '../../model/types/appoiment';
import { ProcedureSelect } from '../ProcedureSelect/ProcedureSelect';
import { Client } from '@/entities/Client';
import { ClientSelect } from '../ClientSelect/ClientSelect';
import { User } from '@/entities/User';
import { DoctorSelect } from '../DoctorSelect/DoctorSelect';
import { VStack } from '@/shared/ui/Stack';
import cls from './AppointmentCard.module.scss';

export interface AppointmentCardProps {
    data?: Appointment;
    error?: string;
    procedures?: Procedure[];
    clients?: Client[];
    doctors?: User[];
    isLoading?: boolean;
    onChangeProcedure?: (value?: Procedure) => void;
    onChangeClient?: (value?: Client) => void;
    onChangeDoctor?: (value?: User) => void;
    onChangeNote?: (value?: string) => void;
}

export const AppointmentCard = memo((props: AppointmentCardProps) => {
    const {
        data,
        doctors,
        isLoading,
        error,
        onChangeDoctor,
        onChangeProcedure,
        onChangeNote,
        procedures,
        clients = [],
        onChangeClient,
    } = props;

    const selectedProcedure = procedures?.find((p) => p.id === data?.procedures?.[0]?.procedureId);
    const selectedClient = clients?.find((c) => c.id === data?.clientId);
    const selectedDoctor = doctors?.find((d) => d.id === data?.doctorId);

    return (
        <VStack max gap="16" className={cls.AppointmentCard}>
            <ProcedureSelect
                onChange={onChangeProcedure}
                value={selectedProcedure}
                options={procedures}
            />
            {clients?.length > 0 && (
                <ClientSelect onChange={onChangeClient} value={selectedClient} options={clients} />
            )}
            <DoctorSelect onChange={onChangeDoctor} value={selectedDoctor} options={doctors} />
            <Textarea
                placeholder="Добавить нотацию к процедуре"
                fullWidth
                value={data?.note ?? ''}
                onChange={onChangeNote}
            />
        </VStack>
    );
});

export default AppointmentCard;
