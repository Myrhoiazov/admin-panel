import { memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '@/shared/lib/classNames/classNames';
import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce';
import { Input } from '@/shared/ui/Input/Input';
import { Icon } from '@/shared/ui/Icon/Icon';
import { $apiPrivate } from '@/shared/api/api';
import { formatClientOption, Client } from '@/entities/Client';
import { IProfile } from '@/entities/Profile';
import { Procedure } from '@/entities/Procedure';
import {
    getRouteClientDetails,
    getRouteAppointmentDetails,
    getRouteProcedureDetails,
    getRouteProfile,
} from '@/shared/const/router';
import SearchIcon from '@/shared/assets/icons/search.svg';
import { SearchResults, SearchAppointment, EMPTY_SEARCH_RESULTS } from '../../model/types/search';
import { formatAppointmentOption } from '../../model/lib/formatAppointmentOption';
import { formatStaffOption } from '../../model/lib/formatStaffOption';
import cls from './GlobalSearch.module.scss';

export const GLOBAL_SEARCH_MIN_QUERY_LENGTH = 2;
const SEARCH_DEBOUNCE_MS = 300;

interface GlobalSearchProps {
    className?: string;
}

export const GlobalSearch = memo((props: GlobalSearchProps) => {
    const { className } = props;
    const containerRef = useRef<HTMLDivElement>(null);

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResults>(EMPTY_SEARCH_RESULTS);
    const [isSearching, setIsSearching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const search = useDebounce(async (value: string) => {
        const trimmed = value.trim();
        if (trimmed.length < GLOBAL_SEARCH_MIN_QUERY_LENGTH) {
            setResults(EMPTY_SEARCH_RESULTS);
            setIsSearching(false);
            return;
        }
        setIsSearching(true);
        try {
            const { data } = await $apiPrivate.get<SearchResults>(`/search?q=${encodeURIComponent(trimmed)}`);
            setResults(data || EMPTY_SEARCH_RESULTS);
        } catch {
            setResults(EMPTY_SEARCH_RESULTS);
        } finally {
            setIsSearching(false);
        }
    }, SEARCH_DEBOUNCE_MS);

    const onChange = (value?: string) => {
        const next = value || '';
        setQuery(next);
        setIsOpen(true);
        search(next);
    };

    const closeDropdown = () => {
        setIsOpen(false);
    };

    const onSelectResult = () => {
        setQuery('');
        setResults(EMPTY_SEARCH_RESULTS);
        closeDropdown();
    };

    useEffect(() => {
        const onClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                closeDropdown();
            }
        };
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') closeDropdown();
        };

        document.addEventListener('mousedown', onClickOutside);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('mousedown', onClickOutside);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    const trimmedQuery = query.trim();
    const showDropdown = isOpen && trimmedQuery.length >= GLOBAL_SEARCH_MIN_QUERY_LENGTH;
    const hasAnyResults = results.clients.length > 0
        || results.appointments.length > 0
        || results.procedures.length > 0
        || results.staff.length > 0;

    return (
        <div ref={containerRef} className={classNames(cls.GlobalSearch, {}, [className])}>
            <Input
                fullWidth
                size="s"
                placeholder="Поиск..."
                addonLeft={<Icon Svg={SearchIcon} color="stroke" />}
                value={query}
                onChange={onChange}
                onFocus={() => setIsOpen(true)}
                autoComplete="off"
            />
            {showDropdown && (
                <div className={cls.dropdown}>
                    {isSearching && <div className={cls.searching}>Поиск...</div>}
                    {!isSearching && !hasAnyResults && <div className={cls.empty}>Ничего не найдено</div>}
                    {!isSearching && results.clients.length > 0 && (
                        <SearchSection title="Клиенты">
                            {results.clients.map((client: Client) => (
                                <SearchResultLink
                                    key={`client-${client.id}`}
                                    to={getRouteClientDetails(String(client.id))}
                                    onClick={onSelectResult}
                                >
                                    {formatClientOption(client)}
                                </SearchResultLink>
                            ))}
                        </SearchSection>
                    )}
                    {!isSearching && results.appointments.length > 0 && (
                        <SearchSection title="Сеансы">
                            {results.appointments.map((appointment: SearchAppointment) => (
                                <SearchResultLink
                                    key={`appointment-${appointment.id}`}
                                    to={getRouteAppointmentDetails(String(appointment.id))}
                                    onClick={onSelectResult}
                                >
                                    {formatAppointmentOption(appointment)}
                                </SearchResultLink>
                            ))}
                        </SearchSection>
                    )}
                    {!isSearching && results.procedures.length > 0 && (
                        <SearchSection title="Процедуры">
                            {results.procedures.map((procedure: Procedure) => (
                                <SearchResultLink
                                    key={`procedure-${procedure.id}`}
                                    to={getRouteProcedureDetails(String(procedure.id))}
                                    onClick={onSelectResult}
                                >
                                    {procedure.name}
                                </SearchResultLink>
                            ))}
                        </SearchSection>
                    )}
                    {!isSearching && results.staff.length > 0 && (
                        <SearchSection title="Сотрудники">
                            {results.staff.map((user: IProfile) => (
                                <SearchResultLink
                                    key={`staff-${user.id}`}
                                    to={getRouteProfile(String(user.id))}
                                    onClick={onSelectResult}
                                >
                                    {formatStaffOption(user)}
                                </SearchResultLink>
                            ))}
                        </SearchSection>
                    )}
                </div>
            )}
        </div>
    );
});

interface SearchSectionProps {
    title: string;
    children: React.ReactNode;
}

const SearchSection = ({ title, children }: SearchSectionProps) => (
    <div className={cls.section}>
        <div className={cls.sectionTitle}>{title}</div>
        <ul className={cls.options}>{children}</ul>
    </div>
);

interface SearchResultLinkProps {
    to: string;
    onClick: () => void;
    children: React.ReactNode;
}

const SearchResultLink = ({ to, onClick, children }: SearchResultLinkProps) => (
    <li className={cls.option}>
        <Link to={to} className={cls.optionLink} onClick={onClick}>
            {children}
        </Link>
    </li>
);
