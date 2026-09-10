import { memo } from 'react';
import { useClientFilters } from '../../lib/hooks/useClientFilters';
import { ClientFilters } from '@/widgets/ClientFilters';
import { VStack } from '@/shared/ui/Stack';

interface FiltersContainerProps {
    className?: string;
    reloadPage?: () => void;
}

export const FiltersContainer = memo((props: FiltersContainerProps) => {
    const { className, reloadPage } = props;
    const { onChangeSearch, onChangeSort, onChangeOrder, search, sort, order } =
        useClientFilters();

    return (
        <VStack gap="16" align="end">
            <ClientFilters
                onChangeOrder={onChangeOrder}
                onChangeSort={onChangeSort}
                onChangeSearch={onChangeSearch}
                search={search}
                sort={sort}
                order={order}
                className={className}
                reloadPage={reloadPage}
            />
        </VStack>
    );
});
