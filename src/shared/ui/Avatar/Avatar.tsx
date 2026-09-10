import { CSSProperties, useMemo } from 'react';
import { classNames, Mods } from '@/shared/lib/classNames/classNames';
import cls from './Avatar.module.scss';
import { Skeleton } from '../Skeleton/Skeleton';
import UserIcon from '../../assets/icons/user-filled.svg';
import { Icon } from '../Icon/Icon';
import { AppImage } from '../AppImage';


interface AvatarProps {
    className?: string;
    src?: string;
    size?: number;
    alt?: string;
}

export const Avatar = ({ className, src, size = 100, alt }: AvatarProps) => {
    const mods: Mods = {};

    const styles = useMemo<CSSProperties>(
        () => ({
            width: size,
            height: size,
        }),
        [size],
    );

    const iconSize = Math.max(18, Math.round(size * 0.48));

    const fallback = (
        <div style={styles} className={classNames(cls.AvatarFallback, {}, [cls.loading])}>
            <Skeleton width="100%" height="100%" border="50%" />
        </div>
    );

    const errorFallback = (
        <div style={styles} className={classNames(cls.AvatarFallback, {}, [cls.error])}>
            <Icon width={iconSize} height={iconSize} Svg={UserIcon} color="stroke" />
        </div>
    );

    return (
        <AppImage
            fallback={fallback}
            errorFallback={errorFallback}
            src={src}
            alt={alt}
            style={styles}
            className={classNames(cls.Avatar, mods, [className])}
        />
    );
};
