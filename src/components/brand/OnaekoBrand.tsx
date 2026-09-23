interface BrandProps {
    src?: string;
    alt?: string;
    width?: number | string;
    height?: number | string;
    className?: string;
}

/** Wordmark — same asset path as onaeko-accounts. */
export function OnaekoLogo({
    src = '/blocks/onaeko.png',
    alt = 'Onaeko',
    width = 140,
    height = 32,
    className = '',
}: BrandProps) {
    return (
        <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={`object-contain ${className}`}
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
            }}
        />
    );
}

/** Mark / icon — same asset path as onaeko-accounts. */
export function OnaekoIcon({
    src = '/blocks/onaeko-icon.png',
    alt = 'Onaeko',
    width = 32,
    height = 32,
    className = '',
}: BrandProps) {
    return (
        <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={`object-contain ${className}`}
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
            }}
        />
    );
}
