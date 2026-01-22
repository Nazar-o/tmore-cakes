'use client';

import { useEffect, useRef, useState } from 'react';

interface FadeInSectionProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

export default function FadeInSection({ children, delay = 0, className = '' }: FadeInSectionProps) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Optionally disconnect after first trigger for performance
                    // observer.disconnect();
                }
            },
            {
                threshold: 0.1, // Trigger when 10% of the element is visible
                rootMargin: '0px 0px -50px 0px', // Start animation slightly before element enters viewport
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <div
            ref={ref}
            className={`fade-in-section ${isVisible ? 'fade-in-visible' : ''} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}
