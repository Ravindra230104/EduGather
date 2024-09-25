import { useEffect, useState } from 'react';

const Counter = ({ target, duration }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = target;
        const range = end - start;
        const increment = end / (duration / 100);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.round(start));
            }
        }, 100);

        return () => clearInterval(timer);
    }, [target, duration]);

    return (
        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#007bff' }}>
            {count}
        </div>
    );
};

export default Counter;
