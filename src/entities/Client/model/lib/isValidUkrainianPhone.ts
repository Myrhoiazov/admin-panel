const UA_PHONE_PATTERN = /^\+380\d{9}$/;

export const isValidUkrainianPhone = (phone?: string): boolean => {
    if (!phone) return false;
    const normalized = phone.replace(/[\s-]/g, '');
    return UA_PHONE_PATTERN.test(normalized);
};

// Accepts common local formats a person would actually type — "0XXXXXXXXX" or "380XXXXXXXXX"
// without the "+" — and turns them into the canonical "+380XXXXXXXXX". Anything else (already
// canonical, or not recognizable as a UA number) is returned with only spaces/dashes stripped,
// so isValidUkrainianPhone can still reject it and show the usual format error.
export const normalizeUkrainianPhone = (phone?: string): string => {
    if (!phone) return '';
    const cleaned = phone.replace(/[\s-]/g, '');
    if (/^0\d{9}$/.test(cleaned)) return `+38${cleaned}`;
    if (/^380\d{9}$/.test(cleaned)) return `+${cleaned}`;
    return cleaned;
};
