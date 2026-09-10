import { Modal } from '@/shared/ui/Modal/Modal';
import { Suspense } from 'react';
import { ClientFormAsync } from '../ClientForm/ClientForm.async';
import Loader from '@/shared/ui/Loader/Loader';
import { classNames } from '@/shared/lib/classNames/classNames';

interface ClientFormProps {
    className?: string;
    isOpen: boolean;
    onClose: () => void;
    reloadPage?: () => void;
    clientId?: string;
}

export const ClientFormModal = ({ className, isOpen, onClose, reloadPage, clientId }: ClientFormProps) => (
    <Modal className={classNames('', {}, [className])} isOpen={isOpen} onClose={onClose} lazy>
        <Suspense fallback={<Loader />}>
            <ClientFormAsync onSuccess={onClose} reloadPage={reloadPage} clientId={clientId} />
        </Suspense>
    </Modal>
);
