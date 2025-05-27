import { useEffect, useState } from 'react';

export function AppHeaderMessage({ message, startAt, endAt, title }: { message?: string; startAt?: Date; endAt?: Date; title?: string }) {
    const [timeLeft, setTimeLeft] = useState<string | null>(null);
    const [isOngoing, setIsOngoing] = useState(false);
    const [isTimedOut, setIsTimedOut] = useState(false);

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
                setIsOngoing(false);
                setIsTimedOut(false);
            } else if (endAt && now >= startAt && now <= endAt) {
                setIsOngoing(true);
                setIsTimedOut(false);
            } else {
                setIsOngoing(false);
                setIsTimedOut(true);
            }
            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s left`);
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
        return () => clearInterval(timer);
    }, [startAt, endAt]);

    if (!message || isTimedOut) return null;

    return (
        <div className="bg-focus/15 flex h-full w-full flex-col items-center justify-center py-2 text-[10px] sm:text-sm">
            <div className="text-focus relative flex max-w-7xl items-center font-medium">
                <div className="flex items-center justify-center gap-2">
                    {isOngoing && title ? (
                        <>
                            <span>{title} event is ongoing</span>
                            <div className="bg-focus/80 h-4 w-4 animate-pulse rounded-full border-4 sm:h-5 sm:w-5"></div>
                        </>
                    ) : (
                        <>
                            {message}
                            {startAt && (
                                <>
                                    <span> - {timeLeft}</span>{' '}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
