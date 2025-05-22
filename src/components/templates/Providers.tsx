'use client';

import {FC, PropsWithChildren, useMemo} from 'react';
import {Provider} from 'react-redux';
import {getAppStore} from '../../store/app-store';
import {AppTheme} from '../atoms/app/AppTheme';
import {BackgroundThemeProvider} from '../particles/contexts/BackgroundThemeProvider';

export const Providers: FC<PropsWithChildren> = ({children}) => {
    const store = useMemo(() => getAppStore(), []);
    return (
        <Provider store={store}>
            <BackgroundThemeProvider>
            <AppTheme>{children}</AppTheme>
            </BackgroundThemeProvider>
        </Provider>
    );
};
