import { Modal } from 'shared/ui/Modal/Modal';
import { Suspense } from 'react';
import { AppoimentFormAsync } from '../AppoimentForm/AppoimentForm.async';
import Loader from 'shared/ui/Loader/Loader';
import { classNames } from 'shared/lib/classNames/classNames';

interface AppoimentFormProps {
    className?: string;
    isOpen: boolean;
    onClose: () => void;
    reloadPage?: () => void;
}

export const AppoimentFormModal = ({
    className,
    isOpen,
    onClose,
    reloadPage,
}: AppoimentFormProps) => (
    <Modal className={classNames('', {}, [className])} isOpen={isOpen} onClose={onClose} lazy>
        <Suspense fallback={<Loader />}>
            <AppoimentFormAsync onSuccess={onClose} reloadPage={reloadPage} />
        </Suspense>
    </Modal>
);
