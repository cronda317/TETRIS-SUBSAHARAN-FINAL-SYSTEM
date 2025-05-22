'use client';

import {useMediaQuery} from '@material-ui/core';
import {FC, useMemo} from 'react';
import {useSelector} from 'react-redux';
import {environment} from '../../environment/environment';
import {useAppDispatch} from '../../store/app-store';
import {AppActions} from '../../store/app/app-actions';
import {AppSelectors} from '../../store/app/app-selectors';
import {GameSelectors} from '../../store/game/game-selectors';
import {GameStatus} from '../../store/game/game-model';
import {FinishDialog} from '../organisms/dialogs/FinishDialog';
import {HighScoresDialog} from '../organisms/dialogs/HighScoresDialog';
import {OptionsDialog} from '../organisms/dialogs/OptionsDialog';
import {PauseDialog} from '../organisms/dialogs/PauseDialog';
import {UsernameDialog} from '../organisms/dialogs/UsernameDialog';
import {UiThemeProvider} from '../particles/contexts/UiThemeContext';
import {usePageView} from '../particles/hooks/usePageView';
import {usePersist} from '../particles/hooks/usePersist';
import {useScoreMilestones} from '../particles/hooks/useScoreMilestones';
import {useTitle} from '../particles/hooks/useTitle';
import {GameVideoPopup} from '../molecules/game/GameVideoPopup';
import {GameDesktop} from './GameDesktop';
import {GameMobile} from './GameMobile';
import {Welcome} from './Welcome';

export interface AppProps {
    version: string;
}

export const App: FC<AppProps> = ({version}) => {
    const welcoming = useSelector(GameSelectors.welcoming);
    const isWideScreen = useMediaQuery('(min-width:600px)');
    const isShortScreen = useMediaQuery('(max-height:850px)');
    const isNarrowScreen = useMediaQuery('(max-width:380px)');
    const gameStatus = useSelector(GameSelectors.status);
    const isActiveGame = gameStatus === GameStatus.RUNNING || gameStatus === GameStatus.PAUSED;
    const { showVideo, resetMilestone } = useScoreMilestones();
    const hasUsername = useSelector(AppSelectors.hasUsername);
    const dispatch = useAppDispatch();

    usePageView('/');
    usePersist(version, environment.storageKey);
    useTitle();

    // Handle username submission
    const handleUsernameSubmit = (username: string) => {
        dispatch(AppActions.setUsername(username));
    };

    const game = useMemo(() => {
        return (
            <UiThemeProvider
                transparent={!isWideScreen}
                large={!isWideScreen && !isNarrowScreen}
            >
                {isWideScreen ? (
                    <GameDesktop floatControls={isShortScreen} />
                ) : (
                    <GameMobile />
                )}
            </UiThemeProvider>
        );
    }, [isWideScreen, isShortScreen, isNarrowScreen]);

    return (
        <div className="flex flex-col w-full h-full">
            {welcoming ? <Welcome /> : game}
            <PauseDialog />
            <FinishDialog />
            <HighScoresDialog />
            <OptionsDialog version={version} />
            {isActiveGame && showVideo && <GameVideoPopup onClose={resetMilestone} />}
            
            {/* Username Dialog - shows when user hasn't set a username yet */}
            <UsernameDialog 
                open={!hasUsername} 
                onSubmit={handleUsernameSubmit} 
            />
        </div>
    );
};
