import {StylesProvider} from '@material-ui/core/styles';
import {FC, PropsWithChildren} from 'react';

export const AppTheme: FC<PropsWithChildren> = ({children}) => {
    return <StylesProvider injectFirst>{children}</StylesProvider>;
};
