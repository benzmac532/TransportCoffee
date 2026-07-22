import { useEffect, useRef, useState } from 'react';

const DEFAULT_ROOT_MARGIN = '0px 0px -8% 0px';
const DEFAULT_THRESHOLD = 0.14;

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Scroll/entrance reveal wrapper.
 * Timing comes from CSS vars (--motion-duration, --motion-stagger, etc.).
 * Pass `delaySteps` to stagger via calc(var(--motion-stagger) * n).
 */
export default function Reveal({
  as: Tag = 'div',
  variant = 'up',
  delaySteps = 0,
  className = '',
  children,
  once = true,
  rootMargin = DEFAULT_ROOT_MARGIN,
  threshold = DEFAULT_THRESHOLD,
  ...props
}) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (prefersReducedMotion()) {
      setRevealed(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setRevealed(true);
        if (once) observer.disconnect();
      },
      { rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  const classes = ['reveal', `reveal-${variant}`, revealed ? 'is-revealed' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag
      ref={ref}
      className={classes}
      {...props}
      style={{
        ...(props.style || {}),
        '--reveal-delay': `calc(var(--motion-stagger) * ${Math.max(0, delaySteps)})`,
      }}
    >
      {children}
    </Tag>
  );
}
