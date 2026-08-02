import { useEffect, useRef } from 'react';

export default function ScrollReveal({ as: Tag = 'section', children, className = '', ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reveal = () => {
      element.classList.add('opacity-100', 'translate-y-0');
      element.classList.remove('opacity-0', 'translate-y-10');
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) reveal();
      },
      { threshold: 0.1 },
    );

    observer.observe(element);

    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      reveal();
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`transition-all duration-700 opacity-0 translate-y-10 ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
