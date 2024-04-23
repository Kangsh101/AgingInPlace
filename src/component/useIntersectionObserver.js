import { useEffect, useRef, useState } from 'react';

const useIntersectionObserver = (targetRef) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const observer = useRef();

    useEffect(() => {
        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setIsIntersecting(true);
                } else {
                    setIsIntersecting(false);
                }
            });
        };

        observer.current = new window.IntersectionObserver(observerCallback);

        if (targetRef.current) {
            observer.current.observe(targetRef.current);
        }

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [targetRef]);

    return isIntersecting;
};

export default useIntersectionObserver;
