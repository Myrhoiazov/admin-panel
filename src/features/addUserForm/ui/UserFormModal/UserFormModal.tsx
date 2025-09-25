import { Modal } from 'shared/ui/Modal/Modal';
import { Suspense } from 'react';
import { UserFormAsync } from '../UserForm/UserForm.async';
import Loader from 'shared/ui/Loader/Loader';
import { classNames } from 'shared/lib/classNames/classNames';

interface UserFormModalProps {
    className?: string;
    isOpen: boolean;
    onClose: () => void;
    reloadPage?: () => void;
}

export const UserFormModal = ({ className, isOpen, onClose, reloadPage }: UserFormModalProps) => (
    <Modal className={classNames('', {}, [className])} isOpen={isOpen} onClose={onClose} lazy>
        <Suspense fallback={<Loader />}>
            <UserFormAsync onSuccess={onClose} reloadPage={reloadPage} />
        </Suspense>
    </Modal>
);
