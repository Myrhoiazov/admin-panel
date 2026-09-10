import { memo } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Icon } from '../Icon/Icon';
import { Text } from '../Text/Text';
import cls from './EmptyState.module.scss';
import SearchIcon from '@/shared/assets/icons/search.svg';

interface EmptyStateProps {
    className?: string;
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    title: string;
    description?: string;
}

export const EmptyState = memo((props: EmptyStateProps) => {
    const { className, icon, title, description } = props;

    return (
        <div className={classNames(cls.EmptyState, {}, [className])}>
            <div className={cls.iconWrap}>
                <Icon Svg={icon || SearchIcon} width={26} height={26} color="stroke" />
            </div>
            <Text text={title} size="m" bold align="center" className={cls.title} />
            {description && (
                <Text text={description} size="s" align="center" className={cls.description} />
            )}
        </div>
    );
});
