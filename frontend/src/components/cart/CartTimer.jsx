import React, { useState, useEffect } from 'react';

const CartTimer = ({ expiresAt, onExpire }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const expiry = new Date(expiresAt);
            const diff = expiry - now;

            if (diff <= 0) {
                clearInterval(interval);
                setTimeLeft('00:00');
                onExpire();
            } else {
                const minutes = Math.floor((diff / 1000 / 60) % 60);
                const seconds = Math.floor((diff / 1000) % 60);
                setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresAt, onExpire]);

    return (
        <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
            <span>⏱</span>
            <span>{timeLeft}</span>
        </div>
    );
};

export default CartTimer;
