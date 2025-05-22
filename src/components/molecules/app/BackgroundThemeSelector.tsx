import { FC } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../store/app-store';
import { AppActions } from '../../../store/app/app-actions';
import { AppSelectors } from '../../../store/app/app-selectors';
import { BackgroundTheme } from '../../../store/app/app-model';
import { ClassNameProps } from '../../particles/particles.types';

interface ThemeOption {
    value: BackgroundTheme;
    label: string;
    bgColor: string;
}

// Define all the available themes with vibrant, easily distinguishable colors
const themeOptions: ThemeOption[] = [
    { value: BackgroundTheme.BLUE, label: 'Blue', bgColor: 'bg-blue-500' },
    { value: BackgroundTheme.GREEN, label: 'Green', bgColor: 'bg-green-500' },
    { value: BackgroundTheme.PURPLE, label: 'Purple', bgColor: 'bg-purple-500' },
    { value: BackgroundTheme.RED, label: 'Red', bgColor: 'bg-red-500' },
    { value: BackgroundTheme.YELLOW, label: 'Yellow', bgColor: 'bg-yellow-500' },
    { value: BackgroundTheme.PINK, label: 'Pink', bgColor: 'bg-pink-500' },
    { value: BackgroundTheme.ORANGE, label: 'Orange', bgColor: 'bg-orange-500' },
    { value: BackgroundTheme.CYAN, label: 'Cyan', bgColor: 'bg-cyan-500' }
];

export const BackgroundThemeSelector: FC<ClassNameProps> = ({ className }) => {
    const currentTheme = useSelector(AppSelectors.backgroundTheme);
    const dispatch = useAppDispatch();

    const handleThemeChange = (theme: BackgroundTheme) => {
        dispatch(AppActions.backgroundTheme(theme));
    };

    return (
        <div className={`${className || ''}`}>
            <div className="grid grid-cols-3 gap-2">
                {themeOptions.map((theme) => (
                    <div
                        key={theme.value}
                        className={`
                            ${theme.bgColor} rounded-md p-1 cursor-pointer
                            border border-white dark:border-gray-700
                            hover:brightness-110 transition-all
                            ${currentTheme === theme.value ? 'ring-2 ring-white dark:ring-gray-300' : ''}
                        `}
                        onClick={() => handleThemeChange(theme.value)}
                        title={theme.label}
                    >
                        <div className="h-10 flex items-end justify-center">
                            <div className="text-white font-bold text-xs shadow-sm">
                                {theme.label}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}; 