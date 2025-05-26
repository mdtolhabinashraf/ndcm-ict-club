import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="bg-sidebar-primary/8 text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md p-1">
                <AppLogoIcon className="fill-current text-white dark:text-black" />
            </div>

            <span className="mb-0.5 truncate leading-none font-semibold">ICT Club</span>
        </>
    );
}
