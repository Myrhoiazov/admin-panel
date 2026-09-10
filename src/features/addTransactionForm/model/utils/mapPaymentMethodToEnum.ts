import { PaymentMethod } from "@/entities/PaymentMethod";

const PM_KEYS = new Set(Object.keys(PaymentMethod));

export const mapPaymentMethodToEnum = (method?: string): string => {
    if (!method) return 'CASH';
    // value is already a key like 'QR_CODE' — pass through directly
    if (PM_KEYS.has(method)) return method;
    // legacy fallback: value was a Russian label like 'QR-оплата' — find key by value
    const entry = Object.entries(PaymentMethod).find(([, v]) => v === method);
    if (entry) return entry[0];
    // Custom key not in enum (e.g., 'TEST') — pass through as-is
    return method;
};
