import { TransactionCategory } from "@/entities/TransactionCategory";

const CAT_KEYS = new Set(Object.keys(TransactionCategory));

export const mapExpenseCategoryToEnum = (category?: string): string => {
    if (!category) return 'COSMETICS';
    // value is already a key like 'TOTIS' — pass through directly
    if (CAT_KEYS.has(category)) return category;
    // legacy fallback: value was a label like 'Totis' — find key by value
    const entry = Object.entries(TransactionCategory).find(([, v]) => v === category);
    if (entry) return entry[0];
    // Custom key not in enum (e.g., 'MY_CATEGORY') — pass through as-is
    return category;
};
