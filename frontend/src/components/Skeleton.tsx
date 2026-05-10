import type { CSSProperties } from 'react';

interface Props {
  width?: number | string;
  height?: number | string;
  radius?: number;
  style?: CSSProperties;
  aspectRatio?: string;
}

export function Skeleton({ width, height, radius = 8, aspectRatio, style }: Props) {
  return (
    <div
      className="md-skeleton"
      aria-hidden
      style={{
        width: width ?? '100%',
        height,
        aspectRatio,
        borderRadius: radius,
        ...style,
      }}
    />
  );
}
