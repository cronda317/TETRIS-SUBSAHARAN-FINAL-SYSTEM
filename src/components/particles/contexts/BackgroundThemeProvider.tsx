import { FC, PropsWithChildren, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppSelectors } from '../../../store/app/app-selectors';
import { BackgroundTheme } from '../../../store/app/app-model';

// Define the background theme classes
const themeClasses: Record<BackgroundTheme, string> = {
    [BackgroundTheme.BLUE]: 'bg-blue-500',
    [BackgroundTheme.GREEN]: 'bg-green-500',
    [BackgroundTheme.PURPLE]: 'bg-purple-500',
    [BackgroundTheme.RED]: 'bg-red-500',
    [BackgroundTheme.YELLOW]: 'bg-yellow-500',
    [BackgroundTheme.ORANGE]: 'bg-orange-500',
    [BackgroundTheme.CYAN]: 'bg-cyan-500',
    [BackgroundTheme.PINK]: 'bg-pink-500'
};

export const BackgroundThemeProvider: FC<PropsWithChildren> = ({ children }) => {
    const backgroundTheme = useSelector(AppSelectors.backgroundTheme);

    useEffect(() => {
        // Remove all theme classes first
        Object.values(themeClasses).forEach(themeClass => {
            document.body.classList.remove(themeClass);
        });

        // Add the current theme class
        document.body.classList.add(themeClasses[backgroundTheme]);
    }, [backgroundTheme]);

    return <>{children}</>;
}; 