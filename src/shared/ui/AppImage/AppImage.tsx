import {
    ImgHTMLAttributes,
    memo,
    ReactElement,
    useMemo,
    useLayoutEffect,
    useState,
} from 'react';

interface AppImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    className?: string;
    fallback?: ReactElement;
    errorFallback?: ReactElement;
}

export const AppImage = memo((props: AppImageProps) => {
    const {
        className,
        src,
        alt = 'image',
        errorFallback,
        fallback,
        ...otherProps
    } = props;
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const normalizedSrc = useMemo(() => {
        if (!src) {
            return '';
        }

        const normalizedApi = (__API__ || '').replace(/\/$/, '');
        if (!normalizedApi) {
            return src;
        }

        if (src.startsWith('/upload/')) {
            return `${normalizedApi}${src}`;
        }

        try {
            const srcUrl = new URL(src);
            if (srcUrl.pathname.startsWith('/upload/')) {
                return `${normalizedApi}${srcUrl.pathname}`;
            }
        } catch {
            return src;
        }

        return src;
    }, [src]);

    useLayoutEffect(() => {
        if (!normalizedSrc) {
            setIsLoading(false);
            setHasError(true);
            return;
        }

        setIsLoading(true);
        setHasError(false);

        const img = new Image();
        img.src = normalizedSrc;
        img.onload = () => {
            setIsLoading(false);
        };
        img.onerror = () => {
            setIsLoading(false);
            setHasError(true);
        };
    }, [normalizedSrc]);

    if (isLoading && fallback) {
        return fallback;
    }

    if (hasError && errorFallback) {
        return errorFallback;
    }

    return <img className={className} src={normalizedSrc || src} alt={alt} {...otherProps} />;
});
