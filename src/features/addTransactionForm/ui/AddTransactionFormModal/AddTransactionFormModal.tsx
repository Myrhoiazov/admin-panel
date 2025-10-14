import { Modal } from '@/shared/ui/Modal/Modal';
import { Suspense } from 'react';
import { AddTransactionFormAsync } from '../AddTransactionForm/AddTransactionForm.async';
import Loader from '@/shared/ui/Loader/Loader';
import { classNames } from '@/shared/lib/classNames/classNames';

interface AddTransactionFormProps {
    className?: string;
    isOpen: boolean;
    onClose: () => void;
    reloadPage?: () => void;
}

export const AddTransactionFormModal = ({
    className,
    isOpen,
    onClose,
    reloadPage,
}: AddTransactionFormProps) => (
    <Modal className={classNames('', {}, [className])} isOpen={isOpen} onClose={onClose} lazy>
        <Suspense fallback={<Loader />}>
            <AddTransactionFormAsync onSuccess={onClose} reloadPage={reloadPage} />
        </Suspense>
    </Modal>
);
