import { memo } from 'react';
import { HStack, VStack } from 'shared/ui/Stack';
import { TransactionTypeTabs } from 'features/TransactionTypeTabs';
import { useTransactionFilters } from '../../lib/hooks/useTransactionFilters';
import { TransactionFilters } from 'widgets/TransactionFilters';

interface FiltersContainerProps {
    className?: string;
    reloadPage?: () => void;
}

export const FiltersContainer = memo((props: FiltersContainerProps) => {
    const { className, reloadPage } = props;
    const { onChangeSearch, onChangeSort, onChangeOrder, onChangeType, search, sort, order, type } =
        useTransactionFilters();

    return (
        <VStack gap="16" align="end" max>
            <TransactionFilters
                onChangeOrder={onChangeOrder}
                onChangeSort={onChangeSort}
                onChangeSearch={onChangeSearch}
                search={search}
                sort={sort}
                order={order}
                className={className}
                reloadPage={reloadPage}
            />
            <TransactionTypeTabs value={type} onChangeType={onChangeType} />
        </VStack>
    );
});
