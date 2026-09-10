import React, { memo, useState } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import s from './ProcedureItem.module.scss';
import { Procedure } from '../../model/types/procedure';
import { Card } from '@/shared/ui/Card/Card';
import { AppImage } from '@/shared/ui/AppImage';
import { Link } from 'react-router-dom';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig';
import { VStack } from '@/shared/ui/Stack';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';

interface ProcedureItemProps {
    className?: string;
    procedure: Procedure;
    onDelete?: (id: string) => void;
}

const ProcedureItem = ({ className, procedure, onDelete }: ProcedureItemProps) => {
    const [showConfirm, setShowConfirm] = useState(false);

    const image = procedure?.image
        ? Array.isArray(procedure.image)
            ? procedure.image[0]
            : procedure.image
        : '';
    return (
        <>
            <Card
                className={classNames(s.ProcedureItem, {}, [className])}
                shadow="shadowAccent"
                padding="0"
            >
                <Link to={`${RoutePath.procedures_details}${procedure.id}`} className={s.link}>
                    <VStack gap="8" align="stretch" justify="start" className={s.content}>
                        <span className={s.imageWrapper}>
                            <AppImage className={s.image} src={image as string} alt={procedure.name} />
                            <span className={s.overlay} />
                        </span>
                        {onDelete && (
                            <button
                                className={s.deleteBtn}
                                title="Удалить процедуру"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowConfirm(true);
                                }}
                            >
                                ×
                            </button>
                        )}
                        <span className={s.title}>{procedure.name || 'Без названия'}</span>
                    </VStack>
                </Link>
            </Card>
            {onDelete && (
                <ConfirmModal
                    isOpen={showConfirm}
                    message={`Удалить процедуру «${procedure.name}»? Это действие нельзя отменить.`}
                    onConfirm={() => {
                        setShowConfirm(false);
                        onDelete(String(procedure.id));
                    }}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </>
    );
};

export default memo(ProcedureItem);
