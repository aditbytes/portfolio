import { useState, type CSSProperties } from 'react';

interface Props {
  name: 'hero' | 'profile' | 'about';
  widths: number[];
  sizes: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * Responsive AVIF → WebP → JPEG portrait. If the image fails to load, the
 * frame keeps its aspect ratio and shows a quiet placeholder instead of a
 * broken-image icon.
 */
export function Portrait({ name, widths, sizes, alt, width, height, priority, className = '', style }: Props) {
  const [failed, setFailed] = useState(false);
  const srcset = (ext: string) => widths.map((w) => `/assets/portraits/${name}-${w}.${ext} ${w}w`).join(', ');
  const largest = widths[widths.length - 1];

  if (failed) {
    return (
      <div className={`portrait-fallback ${className}`} style={{ aspectRatio: `${width} / ${height}`, ...style }} role="img" aria-label={alt}>
        <span className="label">Image unavailable</span>
      </div>
    );
  }

  return (
    <picture className={className} style={style}>
      <source type="image/avif" srcSet={srcset('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcset('webp')} sizes={sizes} />
      <img
        src={`/assets/portraits/${name}-${largest}.jpg`}
        srcSet={srcset('jpg')}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        onError={() => setFailed(true)}
      />
    </picture>
  );
}
