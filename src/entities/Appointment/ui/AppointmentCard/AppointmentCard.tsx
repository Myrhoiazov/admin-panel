import { useTranslation } from 'react-i18next';
import { memo } from 'react';
import Textarea from 'shared/ui/Textarea/Textarea';
import { Procedure } from 'entities/Procedure';
import { Appointment } from '../../model/types/appoiment';
import { ProcedureSelect } from '../ProcedureSelect/ProcedureSelect';
import { Client } from 'entities/Client';
import { ClientSelect } from '../ClientSelect/ClientSelect';
import { Input } from 'shared/ui/Input/Input';

export interface AppointmentCardProps {
    data?: Appointment;
    error?: string;
    procedures?: Procedure[];
    clients?: Client[];
    isLoading?: boolean;
    onChangeProcedure?: (value?: Procedure) => void;
    onChangeClient?: (value?: Client) => void;
    onChangeNote?: (value?: string) => void;
    onChangeImage?: (value?: File) => void;
}

export const AppointmentCard = memo((props: AppointmentCardProps) => {
    const {
        data,
        onChangeProcedure,
        onChangeNote,
        procedures,
        clients,
        onChangeClient,
        onChangeImage,
    } = props;
    const { t } = useTranslation();

    const selectedProcedure = procedures?.find((p) => p.id === data?.procedureId);
    const selectedClient = clients?.find((c) => c.id === data?.clientId);

    return (
        <>
            <ProcedureSelect
                onChange={onChangeProcedure}
                value={selectedProcedure}
                options={procedures}
            />
            <ClientSelect onChange={onChangeClient} value={selectedClient} options={clients} />
            <Input
                fullWidth
                label="Загрузить фото"
                type="file"
                placeholder={t('Загрузите фото')}
                onChange={(value: string | File) => {
                    if (value instanceof File) {
                        onChangeImage?.(value);
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
