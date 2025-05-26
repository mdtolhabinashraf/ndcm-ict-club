import { cn } from '@/lib/utils';
import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon({ className, ...props }: { className: string } & ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <div className={cn('size-fit', className)}>
            <img src="/apple-touch-icon.png" alt="ict_club_logo" {...props} />
        </div>
    );
}
