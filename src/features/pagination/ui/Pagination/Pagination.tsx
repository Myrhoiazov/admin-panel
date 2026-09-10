import { memo, useMemo } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './Pagination.module.scss';

interface PaginationProps {
    className?: string;
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export const Pagination = memo((props: PaginationProps) => {
    const { className, totalItems, itemsPerPage, currentPage, onPageChange } = props;

    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    const pages = useMemo(() => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const start = Math.max(1, currentPage - 1);
        const end = Math.min(totalPages, currentPage + 1);
        const values: Array<number | '...'> = [1];

        if (start > 2) {
            values.push('...');
        }

        for (let i = start; i <= end; i += 1) {
            if (i !== 1 && i !== totalPages) {
                values.push(i);
            }
        }

        if (end < totalPages - 1) {
            values.push('...');
        }

        if (totalPages > 1) {
            values.push(totalPages);
        }

        return values;
    }, [currentPage, totalPages]);

    if (totalItems <= itemsPerPage) {
        return null;
    }

    return (
        <div className={classNames(cls.Pagination, {}, [className])}>
            <button
                type="button"
                className={cls.navBtn}
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                {'<'}
            </button>
            {pages.map((page, idx) =>
                page === '...' ? (
                    <span key={`dots-${idx}`} className={cls.dots}>
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        type="button"
                        className={classNames(cls.pageBtn, { [cls.active]: page === currentPage })}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                )
            )}
            <button
                type="button"
                className={cls.navBtn}
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                {'>'}
            </button>
        </div>
    );
});

