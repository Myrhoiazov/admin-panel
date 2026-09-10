export const QUESTIONNAIRE_ITEMS = [
    'Анкета',
    'Фото 3Д',
    'Фото',
    'Био',
    'Контурная пластика',
    'Коллагестимуляция',
    'Ботокс',
    'Смас',
    'Морфеус',
    'Люмекка',
    'Лютроник',
    'Пилинг',
] as const;

export type QuestionnaireData = Record<string, string>; // item → ISO date when checked

export function parseQuestionnaire(raw?: string | null): QuestionnaireData {
    if (!raw) return {};
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            return Object.fromEntries(parsed.map((item) => [String(item), '']));
        }
        if (typeof parsed === 'object' && parsed !== null) {
            return parsed as QuestionnaireData;
        }
    } catch {
        // ignore
    }
    return {};
}

export function formatQuestionnaireDate(iso: string): string {
    if (!iso) return '';
    try {
        return new Intl.DateTimeFormat('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(new Date(iso));
    } catch {
        return '';
    }
}
