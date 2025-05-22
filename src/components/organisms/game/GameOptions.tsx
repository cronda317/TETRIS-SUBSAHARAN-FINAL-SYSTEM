import classNames from 'classnames';
import {FC} from 'react';
import {useAppDispatch} from '../../../store/app-store';
import {AppActions} from '../../../store/app/app-actions';
import {BackgroundThemeSelector} from '../../molecules/app/BackgroundThemeSelector';
import {ClassNameProps} from '../../particles/particles.types';
import {UiButton} from '../../particles/ui/UiButton';
import {OptionsAudio} from '../options/OptionsAudio';
import {OptionsGame} from '../options/OptionsGame';
import {OptionsKeyBindings} from '../options/OptionsKeyBindings';

export const GameOptions: FC<ClassNameProps> = ({
    className
}) => {
    const dispatch = useAppDispatch();
    return (
        <div className={classNames(className, 'flex flex-col')}>
            <div className="grid grid-cols-2 gap-y-1 gap-x-3">
                <div className="col-span-2 mb-1 text-sm font-medium text-primary">Game Controls</div>
                <OptionsKeyBindings />
                
                <div className="col-span-2 mt-2 mb-1 text-sm font-medium text-primary">Game Settings</div>
                <OptionsGame />
                
                <div className="col-span-2 mt-2 mb-1 text-sm font-medium text-primary">Background Theme</div>
                <div className="col-span-2">
                    <BackgroundThemeSelector />
                </div>
                
                <div className="col-span-2 mt-2 mb-1 text-sm font-medium text-primary">Audio Settings</div>
                <OptionsAudio />
                
                <UiButton
                    className="mt-3 py-1.5 text-sm"
                    onClick={() => dispatch(AppActions.resetScore())}
                >
                    Reset High Scores
                </UiButton>
                <UiButton
                    className="mt-3 py-1.5 text-sm"
                    onClick={() => dispatch(AppActions.resetOptions())}
                >
                    Reset Options
                </UiButton>
            </div>
        </div>
    );
};
