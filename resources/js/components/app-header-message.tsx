import { useEffect, useState } from 'react';

export function AppHeaderMessage({ message, startAt }: { message?: string; startAt?: Date }) {
    const [timeLeft, setTimeLeft] = useState<string | null>(null);

    useEffect(() => {
        if (!startAt) return;

        const updateCountdown = () => {
            const now = new Date();
            let diff = startAt.getTime() - now.getTime();
            let days = 0,
                hours = 0,
                minutes = 0,
                seconds = 0;

            if (diff > 0) {
                days = Math.floor(diff / (1000 * 60 * 60 * 24));
                hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                seconds = Math.floor((diff % (1000 * 60)) / 1000);
            }
            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s left`);
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
        return () => clearInterval(timer);
    }, [startAt]);

    if (!message) return null;

    return (
        <div className="bg-focus/15 flex h-full w-full flex-col items-center justify-center py-2 text-[10px] sm:text-sm">
            <div className="text-focus relative flex max-w-7xl items-center font-medium">
                <p>
                    {message}
                    {startAt && (
                        <>
                            <span> - {timeLeft}</span>{' '}
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}
