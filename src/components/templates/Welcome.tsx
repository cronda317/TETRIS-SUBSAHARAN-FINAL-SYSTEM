import {FC, useMemo} from 'react';
import {useSelector} from 'react-redux';
import {AppActions} from '../../store/app/app-actions';
import {AppDialogType} from '../../store/app/app-model';
import {AppSelectors} from '../../store/app/app-selectors';
import {GameActions} from '../../store/game/game-actions';
import {AppLogo} from '../atoms/app/AppLogo';
import {AppMenu, AppMenuItem} from '../atoms/app/AppMenu';
import {environment} from '../../environment/environment';

export interface WelcomeProps {
    selectStart?: () => number;
}

export const Welcome: FC<WelcomeProps> = ({
    selectStart = AppSelectors.startLevel
}) => {
    const startLevel = useSelector(selectStart);
    const username = useSelector(AppSelectors.username);

    const menu: Array<AppMenuItem> = useMemo(() => {
        return [
            {
                title: 'New Game',
                action: GameActions.start(startLevel),
                active: true
            },
            {title: `Level: ${startLevel}`, action: AppActions.startLevel()},
            {
                title: 'High Scores',
                action: AppActions.open(AppDialogType.HIGH_SCORES)
            },
            {title: 'Options', action: AppActions.open(AppDialogType.OPTIONS)}
        ];
    }, [startLevel]);

    return (
        <div className="flex flex-col h-full justify-center">
            <div className="flex-1 flex flex-col justify-center items-center">
                <AppLogo
                    className="mb-8"
                    name="Tetris Sub-Saharan Mindanao"
                />
                
                {/* Display username */}
                {username && (
                    <div className="text-center mb-6 text-xl font-medium text-primary">
                        Welcome, {username}!
                    </div>
                )}
                
                <AppMenu className="w-44" items={menu} />
            </div>
        </div>
    );
};
