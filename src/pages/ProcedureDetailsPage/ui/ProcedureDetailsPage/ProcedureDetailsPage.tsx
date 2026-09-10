import React, { memo, useState } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import s from './ProcedureDetailsPage.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { Page } from '@/widgets/Page/Page';
import { Text } from '@/shared/ui/Text/Text';
import { ProcedureDetails } from '@/entities/Procedure';
import { HStack, VStack } from '@/shared/ui/Stack';
import { Button, ButtonTheme } from '@/shared/ui/Button';
import EditIcon from '@/shared/assets/icons/edit-icon.svg';
import { Icon } from '@/shared/ui/Icon/Icon';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig';
import { $apiPrivate } from '@/shared/api/api';
import { toast } from 'react-toastify';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { useSelector } from 'react-redux';
import { getUserAuthData } from '@/entities/User';

interface ProcedureDetailsPageProps {
    className?: string;
}

const ProcedureDetailsPage = ({ className }: ProcedureDetailsPageProps) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const authData = useSelector(getUserAuthData);
    const isAdmin = Boolean(authData?.isAdmin);

    const onDelete = async () => {
        try {
            setIsDeleting(true);
            await $apiPrivate.delete(`/procedures/${id}`);
            toast.success('Процедура удалена');
            navigate(RoutePath.procedures);
        } catch {
            toast.error('Не удалось удалить процедуру');
        } finally {
            setIsDeleting(false);
        }
    };

    if (!id) {
        return (
            <Page className={classNames(s.ProcedureDetailsPage, {}, [className])}>
                <Text title="Не выбран ID процедуры" size="l" bold />
            </Page>
        );
    }

    return (
        <Page className={classNames(s.ProcedureDetailsPage, {}, [className])}>
            <VStack gap="16" max className={s.header}>
                <HStack justify="between" align="center" max>
                    <Text title="Карточка процедуры" size="l" className={s.title} bold />
                    {isAdmin && (
                        <HStack gap="8">
                            <Button
                                theme={ButtonTheme.OUTLINE}
                                className={s.editButton}
                                onClick={() => navigate(`${RoutePath.procedures_edit}${id}`)}
                            >
                                <Icon Svg={EditIcon} width={18} height={18} color="stroke" />
                                Редактировать
                            </Button>
                            <Button
                                theme={ButtonTheme.OUTLINE_RED}
                                onClick={() => setShowConfirm(true)}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Удаление...' : 'Удалить'}
                            </Button>
                        </HStack>
                    )}
                </HStack>
                <Text text="Описание, показания, реабилитация и стоимость процедуры" className={s.subtitle} />
                <ProcedureDetails id={id} />
            </VStack>
            <ConfirmModal
                isOpen={showConfirm}
                message="Удалить эту процедуру? Это действие нельзя отменить."
                onConfirm={() => { setShowConfirm(false); onDelete(); }}
                onCancel={() => setShowConfirm(false)}
            />
        </Page>
    );
};

export default memo(ProcedureDetailsPage);
