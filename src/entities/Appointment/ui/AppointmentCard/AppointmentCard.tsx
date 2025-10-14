import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import Textarea from '@/shared/ui/Textarea/Textarea';
import { Procedure } from '@/entities/Procedure';
import { Appointment } from '../../model/types/appoiment';
import { ProcedureSelect } from '../ProcedureSelect/ProcedureSelect';
import { Client } from '@/entities/Client';
import { ClientSelect } from '../ClientSelect/ClientSelect';
import { Input } from '@/shared/ui/Input/Input';
import { User } from '@/entities/User';
import { DoctorSelect } from '../DoctorSelect/DoctorSelect';

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
    onChangeImage?: (value?: File[]) => void;
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
        onChangeImage,
    } = props;
    const { t } = useTranslation();

    const selectedProcedure = procedures?.find((p) => p.id === data?.procedureId);
    const selectedClient = clients?.find((c) => c.id === data?.clientId);
    const selectedDoctor = doctors?.find((d) => d.id === data?.doctorId);

    return (
        <>
            <ProcedureSelect
                onChange={onChangeProcedure}
                value={selectedProcedure}
                options={procedures}
            />
            {clients?.length > 0 && (
                <ClientSelect onChange={onChangeClient} value={selectedClient} options={clients} />
            )}
            <DoctorSelect onChange={onChangeDoctor} value={selectedDoctor} options={doctors} />
            <Input
                fullWidth
                label="Загрузить фото"
                type="file"
                multiple
                placeholder={t('Загрузите фото')}
                onChange={(files) => {
                    if (Array.isArray(files)) {
                        onChangeImage?.(files);
                    } else if (files) {
                        onChangeImage?.([files]);
                    } else {
                        onChangeImage?.([]);
                    }
                }}
            />
            <Textarea
                placeholder="Добавить нотацию к процедуре"
                fullWidth
                value={data?.note ?? ''}
                onChange={onChangeNote}
            />
        </>
    );
});

export default AppointmentCard;
