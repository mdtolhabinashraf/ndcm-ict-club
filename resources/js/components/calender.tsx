import { useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export function Calendar({ events }: { events: { id?: number; title?: string; start?: string; end?: string }[] }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [todayDate, setTodayDate] = useState(new Date());
    const [hoveredDate, setHoveredDate] = useState<string | null>(null); // Track hovered date

    useEffect(() => {
        const today = new Date();
        setTodayDate(today); // Track today's date separately
        setCurrentDate(today);
    }, []);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), daysInMonth).getDay();

    // Calculate days from the previous month
    const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    const leadingDays = Array.from({ length: firstDayOfMonth }, (_, i) => prevMonthDays - firstDayOfMonth + i + 1);

    // Calculate days from the next month
    const trailingDays = Array.from({ length: 42 - (leadingDays.length + daysInMonth) }, (_, i) => i + 1);

    // Combine all days to ensure 6 full rows (42 days)
    const days = [
        ...leadingDays.map((day) => ({ day, isCurrentMonth: false })),
        ...Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, isCurrentMonth: true })),
        ...trailingDays.map((day) => ({ day, isCurrentMonth: false })),
    ];

    // Find event for the hovered date
    const hoveredEvent = hoveredDate ? events?.find((event) => (event.start ?? '').startsWith(hoveredDate)) : null;

    return (
        <div className="flex items-center justify-center px-4 py-8">
            <div className="flex items-center justify-center rounded-lg border-1 shadow-lg">
                <div className="p-6 md:p-8">
                    <div className="flex items-center justify-between">
                        <span tabIndex={0} className="text-base font-bold text-gray-800 focus:outline-none dark:text-gray-100">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </span>
                        <div className="flex items-center">
                            <button
                                aria-label="calendar backward"
                                className="text-gray-800 hover:text-gray-400 focus:text-gray-400 dark:text-gray-100"
                                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="icon icon-tabler icon-tabler-chevron-left"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <polyline points="15 6 9 12 15 18" />
                                </svg>
                            </button>
                            <button
                                aria-label="calendar forward"
                                className="ml-3 text-gray-800 hover:text-gray-400 focus:text-gray-400 dark:text-gray-100"
                                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="icon icon-tabler icon-tabler-chevron-right"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path stroke="none" d="M0 0h24V24H0z" fill="none" />
                                    <polyline points="9 6 15 12 9 18" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                                        <th key={day}>
                                            <div className="flex h-[50px] w-[40px] items-end justify-center">
                                                <p className="text-center text-base font-medium text-gray-800 dark:text-gray-100">{day}</p>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 6 }).map((_, weekIndex) => (
                                    <tr key={weekIndex}>
                                        {days.slice(weekIndex * 7, weekIndex * 7 + 7).map(({ day, isCurrentMonth }, dayIndex) => {
                                            const isToday =
                                                day === todayDate.getDate() &&
                                                currentDate.getMonth() === todayDate.getMonth() &&
                                                currentDate.getFullYear() === todayDate.getFullYear() &&
                                                isCurrentMonth;

                                            const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + (isCurrentMonth ? 1 : isCurrentMonth === false && day > 15 ? 0 : 2)).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                            const event = events?.find((event) => (event.start ?? '').startsWith(dateString));

                                            return (
                                                <td key={dayIndex} className="">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div
                                                                className={`flex h-[40px] w-[40px] cursor-pointer ${
                                                                    event ? 'flex flex-col items-center' : 'items-end'
                                                                } justify-center`}
                                                            >
                                                                <p
                                                                    className={`text-base font-medium ${
                                                                        isToday
                                                                            ? 'bg-focus/15 text-focus flex h-[32px] w-[32px] items-center justify-center rounded-full'
                                                                            : isCurrentMonth
                                                                              ? 'text-gray-500 dark:text-gray-100'
                                                                              : 'text-gray-400 dark:text-gray-600'
                                                                    }`}
                                                                >
                                                                    {day}
                                                                </p>
                                                                {event ? <div className="bg-focus h-[5px] w-[5px] rounded-full"></div> : ''}
                                                            </div>
                                                        </TooltipTrigger>
                                                        {event && (
                                                            <TooltipContent>
                                                                <a href={`/events/${event.id}`}>
                                                                    <p className="text-lg font-bold">
                                                                        {(event.title ?? '').split(' ').slice(0, 5).join(' ')}
                                                                        {(event.title ?? '').split(' ').length > 5 && '...'}
                                                                    </p>
                                                                    <p className="text-sm">
                                                                        {event.start ? new Date(event.start).toLocaleString() : 'N/A'} -{' '}
                                                                        {event.end ? new Date(event.end).toLocaleString() : 'N/A'}
                                                                    </p>
                                                                </a>
                                                            </TooltipContent>
                                                        )}
                                                    </Tooltip>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
