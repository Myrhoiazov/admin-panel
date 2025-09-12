import { memo } from 'react';
import { useAppoimentFilters } from '../../lib/hooks/useAppoimentFilters';
import { ClientFilters } from 'widgets/ClientFilters';
import { ClientTypeTabs } from 'features/ClientTypeTabs';
import { VStack } from 'shared/ui/Stack';
import { AppoimentFilters } from 'widgets/AppoimentFilters';

interface FiltersContainerProps {
    className?: string;
    reloadPage?: () => void;
}

export const FiltersContainer = memo((props: FiltersContainerProps) => {
    const { className, reloadPage } = props;
    const { onChangeSearch, onChangeOrder, onChangeType, search, order } = useAppoimentFilters();

    return (
        <VStack gap="16" align="end">
            <AppoimentFilters
                // onChangeOrder={onChangeOrder}
                onChangeSearch={onChangeSearch}
                search={search}
                // order={order}
                className={className}
                reloadPage={reloadPage}
            />
            {/* <ClientTypeTabs value={type} onChangeType={onChangeType} /> */}
        </VStack>
    );
});
