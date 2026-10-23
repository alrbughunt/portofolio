import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

export default function CursorGlow() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    if (reduceMotion || window.matchMedia('(pointer: coarse)').matches) return undefined;
    const cursor = cursorRef.current;
    if (!cursor) return undefined;
    const onPointerMove = (event: PointerEvent) => {
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      cursor.classList.add('is-visible');
      const target = event.target instanceof Element ? event.target.closest('a, button, [data-cursor="interactive"]') : null;
      cursor.classList.toggle('is-active', Boolean(target));
    };
    const onPointerLeave = () => cursor.classList.remove('is-visible', 'is-active');
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [reduceMotion]);

  if (reduceMotion) return null;
  return <div className="custom-cursor-glow" ref={cursorRef} aria-hidden="true" />;
}
