// Logo da marca: badge circular com camadas de ondas + silhueta de baleia.
// Tudo herda das CSS vars (--accent, --bg, --bg-2, --ink-4) — tematiza ao vivo.

export function WhaleMark({ size = 44 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
        <defs>
          <clipPath id="md-ring">
            <circle cx="50" cy="50" r="45" />
          </clipPath>
        </defs>

        {/* outer rim */}
        <circle cx="50" cy="50" r="49" fill="var(--ink-4)" opacity="0.55" />
        <circle cx="50" cy="50" r="45" fill="var(--bg-2)" />

        <g clipPath="url(#md-ring)">
          {/* distant water — pale accent layer */}
          <path
            fill="var(--accent)"
            opacity="0.32"
            d="M -5 52
               C 18 42 38 56 58 50
               C 75 45 92 52 105 48
               L 105 100 L -5 100 Z"
          />
          {/* whale silhouette — tail flukes left, back arches right under surface */}
          <path
            fill="var(--accent)"
            opacity="0.72"
            d="M -5 70
               C 4 64 9 50 14 42
               C 17 38 22 40 22 46
               C 22 51 20 56 18 60
               C 28 55 48 53 64 58
               C 80 62 92 60 105 56
               L 105 100 L -5 100 Z"
          />
          {/* foreground swell */}
          <path
            fill="var(--accent)"
            d="M -5 82
               C 18 76 32 90 52 86
               C 72 82 86 92 105 86
               L 105 100 L -5 100 Z"
          />
          {/* eye */}
          <circle cx="72" cy="62" r="6.5" fill="var(--bg)" opacity="0.9" />
          <circle cx="72" cy="62" r="3" fill="var(--accent)" />
        </g>
      </svg>
    </div>
  );
}
