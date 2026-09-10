import { memo, useState } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce';
import { Input } from '@/shared/ui/Input/Input';
import { $apiPrivate } from '@/shared/api/api';
import { Client } from '../../model/types/client';
import { formatClientOption } from '../../model/lib/formatClientOption';
import cls from './ClientAutocomplete.module.scss';

export const CLIENT_SEARCH_MIN_QUERY_LENGTH = 2;
const SEARCH_DEBOUNCE_MS = 500;

interface ClientAutocompleteProps {
    className?: string;
    value: string;
    onChange: (value: string) => void;
    onSelect: (client: Client) => void;
    onResultsChange?: (results: Client[], query: string) => void;
    label?: string;
    placeholder?: string;
}

export const ClientAutocomplete = memo((props: ClientAutocompleteProps) => {
    const { className, value, onChange, onSelect, onResultsChange, label, placeholder } = props;
    const [results, setResults] = useState<Client[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const search = useDebounce(async (query: string) => {
        const trimmed = query.trim();
        if (trimmed.length < CLIENT_SEARCH_MIN_QUERY_LENGTH) {
            setResults([]);
            setIsSearching(false);
            onResultsChange?.([], trimmed);
            return;
        }
        setIsSearching(true);
        try {
            const { data } = await $apiPrivate.get<Client[]>(`/clients?_q=${encodeURIComponent(trimmed)}`);
            const found = data || [];
            setResults(found);
            onResultsChange?.(found, trimmed);
        } catch {
            setResults([]);
            onResultsChange?.([], trimmed);
        } finally {
            setIsSearching(false);
        }
    }, SEARCH_DEBOUNCE_MS);

    const onChangeHandler = (newValue?: string) => {
        onChange(newValue || '');
        search(newValue || '');
    };

    const onSelectHandler = (client: Client) => {
        setResults([]);
        onSelect(client);
    };

    return (
        <div className={classNames(cls.ClientAutocomplete, {}, [className])}>
            <Input
                fullWidth
                label={label}
                placeholder={placeholder}
                value={value}
                onChange={onChangeHandler}
                autoComplete="off"
            />
            {isSearching && <span className={cls.searching}>Поиск...</span>}
            {results.length > 0 && (
                <ul className={cls.options}>
                    {results.map((client) => (
                        <li
                            key={client.id}
                            className={cls.option}
                            onMouseDown={(e) => {
                                // onMouseDown fires before the input's onBlur, so the click registers
                                // before the dropdown would otherwise disappear
                                e.preventDefault();
                                onSelectHandler(client);
                            }}
                        >
                            {formatClientOption(client)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
});
