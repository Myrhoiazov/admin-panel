import { TransactionCategory } from "entities/TransactionCategory";


export const mapExpenseCategoryToEnum = (
    category?: TransactionCategory
): keyof typeof TransactionCategory => {
    switch (category) {
        case TransactionCategory.MERZ:
            return 'MERZ';
        case TransactionCategory.TOTIS:
            return 'TOTIS';
        case TransactionCategory.EMET:
            return 'EMET';
        case TransactionCategory.COSMOLOOK:
            return 'COSMOLOOK';
        case TransactionCategory.PHARMACY:
            return 'PHARMACY';
        case TransactionCategory.OTHER:
            return 'OTHER';
        default:
            return 'COSMETICS';
    }
};
