import React, { useEffect, useRef, useState } from 'react';

const HOVER_INTERACTIVE_SELECTOR =
  'button, a, [role="button"], input[type="submit"], input[type="button"], .red-glow-border, [data-cursor="card"]';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const rafRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const stateRef = useRef('default');
  const clickedRef = useRef(false);

  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState('default');
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)');
    const updateEnabled = () => setEnabled(media.matches && window.innerWidth > 768);
    updateEnabled();
    media.addEventListener('change', updateEnabled);
    window.addEventListener('resize', updateEnabled);
    return () => {
      media.removeEventListener('change', updateEnabled);
      window.removeEventListener('resize', updateEnabled);
    };
  }, []);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    clickedRef.current = clicked;
  }, [clicked]);

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove('has-minimal-cursor');
      return;
    }

    document.body.classList.add('has-minimal-cursor');

    const onMouseMove = (event) => {
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
    };

    const onMouseDown = () => {
      setClicked(true);
      window.setTimeout(() => setClicked(false), 150);
    };

    const onMouseOver = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const interactive = target.closest(HOVER_INTERACTIVE_SELECTOR);
      setState(interactive ? 'interactive' : 'default');
    };

    const animate = () => {
      if (cursorRef.current) {
        const scale = clickedRef.current ? 0.82 : stateRef.current === 'interactive' ? 1.35 : 1;
        cursorRef.current.style.transform = `translate3d(${mouseRef.current.x}px, ${mouseRef.current.y}px, 0) scale(${scale})`;
      }

      rafRef.current = window.requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    rafRef.current = window.requestAnimationFrame(animate);

    return () => {
      document.body.classList.remove('has-minimal-cursor');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mousedown', onMouseDown);
      window.cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      className="minimal-cursor"
    />
  );
};

export default CustomCursor;
