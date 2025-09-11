import { useTranslation } from 'react-i18next';
import { memo, useCallback, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { classNames } from 'shared/lib/classNames/classNames';
import { Text } from 'shared/ui/Text/Text';
import { AddCommentForm } from 'features/AddCommentForm';
import { CommentList } from 'entities/Comment';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect';
import { VStack } from 'shared/ui/Stack';
import Loader from 'shared/ui/Loader/Loader';
import { fetchCommentsByClientId } from '../../model/services/fetchCommentsByClientId/fetchCommentsByClientId';
import { getClientComments } from '../../model/slices/clientDetailsCommentsSlice';
import { getClientCommentsIsLoading } from '../../model/selectors/comments';
import { addCommentsForClient } from '../../model/services/addCommentsForClient/addCommentsForClient';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { getClientAppointments } from '../../model/slices/clientDetailsAppoimentsSlice';
import { getClientAppointmentsIsLoading } from 'pages/ClientsDetailsPage/model/selectors/appoiments';
import { AppoimentList } from 'entities/Appointment';
import { fetchAppoimentsByClientId } from '../../model/services/fetchAppoimentsByClientId/fetchAppoimentsByClientId';

interface ClientAppoimentsProps {
    className?: string;
    id?: string;
}

export const ClientAppoiments = memo((props: ClientAppoimentsProps) => {
    const { className, id } = props;
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const appointments = useSelector(getClientAppointments.selectAll);
    const appointmentsIsLoading = useSelector(getClientAppointmentsIsLoading);

    if (!id) {
        return;
    }

    useInitialEffect(() => {
        (() => {
            dispatch(fetchAppoimentsByClientId(id));
        })();
    });

    return (
        <VStack gap="16" max className={classNames('', {}, [className])}>
            <Text size="l" title={t('Сеансы')} />
            <AppoimentList appoiments={appointments} isLoading={appointmentsIsLoading} />
        </VStack>
    );
});
