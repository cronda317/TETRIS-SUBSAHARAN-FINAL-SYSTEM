import classNames from 'classnames';
import {FC} from 'react';
import {useSelector} from 'react-redux';
import {GamePlayerDirection} from '../../../engine/game-transform';
import {useAppDispatch} from '../../../store/app-store';
import {AppSelectors} from '../../../store/app/app-selectors';
import {GameActions} from '../../../store/game/game-actions';
import {GameSelectors} from '../../../store/game/game-selectors';
import {GameHold} from '../../atoms/game/GameHold';
import {GameRotate} from '../../atoms/game/GameRotate';
import {GameSettings} from '../../atoms/game/GameSettings';
import {GameArrows} from '../../molecules/game/GameArrows';
import {
    UiThemeProvider,
    useUiTheme
} from '../../particles/contexts/UiThemeContext';
import {KeyBindings} from '../../particles/key_bindings.types';
import {ClassNameProps} from '../../particles/particles.types';

export type ControlsPosition = 'left' | 'right' | 'bottom';
export type ControlsType = 'movement' | 'rotation' | 'all';

export interface GameControlsProps {
    selectEnabled?: () => boolean;
    selectHoldEnabled?: () => boolean;
    selectKeys?: () => KeyBindings;
    selectRepeatSpeed?: () => number;
    transparent?: boolean;
    position?: ControlsPosition;
    controlsType?: ControlsType;
}

export const GameControls: FC<GameControlsProps & ClassNameProps> = ({
    selectKeys = AppSelectors.keys,
    selectRepeatSpeed = GameSelectors.repeatSpeed,
    selectEnabled = GameSelectors.running,
    selectHoldEnabled = GameSelectors.holdEnabled,
    transparent,
    position = 'bottom',
    controlsType = 'all',
    className
}) => {
    const {left, right, rotate_left, rotate_right, soft_drop, hard_drop, hold} =
        useSelector(selectKeys);
    const repeatSpeed = useSelector(selectRepeatSpeed);
    const enabled = useSelector(selectEnabled);
    const holdEnabled = useSelector(selectHoldEnabled);
    const dispatch = useAppDispatch();
    const {large} = useUiTheme();

    const isVertical = position === 'left' || position === 'right';
    const showMovement = controlsType === 'movement' || controlsType === 'all';
    const showRotation = controlsType === 'rotation' || controlsType === 'all';
    
    const containerClasses = classNames(
        className,
        'flex',
        {
            'flex-col': isVertical,
            'items-center': isVertical,
            'gap-4': isVertical,
            'bg-white/20 backdrop-blur-sm rounded-lg p-3': isVertical,
        }
    );

    return (
        <div className={containerClasses}>
            <UiThemeProvider transparent={Boolean(transparent)} large={large}>
                {showMovement && (
                    <div className="flex justify-center items-center">
                        <GameArrows
                            disabled={!enabled}
                            left={left}
                            right={right}
                            softDrop={soft_drop}
                            hardDrop={hard_drop}
                            onLeft={() =>
                                dispatch(GameActions.move(GamePlayerDirection.LEFT))
                            }
                            onRight={() =>
                                dispatch(GameActions.move(GamePlayerDirection.RIGHT))
                            }
                            onSoftDrop={(fast) => dispatch(GameActions.softDrop(fast))}
                            onHardDrop={() => dispatch(GameActions.hardDrop())}
                            speed={repeatSpeed}
                            position={position}
                        />
                    </div>
                )}
                
                {isVertical ? (
                    <>
                        {showRotation && (
                            <div className="flex flex-col items-center gap-4">
                                <GameRotate
                                    disabled={!enabled}
                                    keyCodeLeft={rotate_left}
                                    keyCodeRight={rotate_right}
                                    onRotateLeft={() =>
                                        dispatch(
                                            GameActions.rotate(GamePlayerDirection.LEFT)
                                        )
                                    }
                                    onRotateRight={() =>
                                        dispatch(
                                            GameActions.rotate(GamePlayerDirection.RIGHT)
                                        )
                                    }
                                />
                                <GameHold
                                    keyCode={hold}
                                    disabled={!enabled || !holdEnabled}
                                    onHold={() => {
                                        dispatch(GameActions.hold());
                                        dispatch(GameActions.tick());
                                    }}
                                />
                                <GameSettings />
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {showRotation && (
                            <>
                                <div className="flex relative ml-auto">
                                    <GameHold
                                        className="absolute top-0 left-0"
                                        keyCode={hold}
                                        disabled={!enabled || !holdEnabled}
                                        onHold={() => {
                                            dispatch(GameActions.hold());
                                            dispatch(GameActions.tick());
                                        }}
                                    />
                                    <GameRotate
                                        disabled={!enabled}
                                        keyCodeLeft={rotate_left}
                                        keyCodeRight={rotate_right}
                                        onRotateLeft={() =>
                                            dispatch(
                                                GameActions.rotate(GamePlayerDirection.LEFT)
                                            )
                                        }
                                        onRotateRight={() =>
                                            dispatch(
                                                GameActions.rotate(GamePlayerDirection.RIGHT)
                                            )
                                        }
                                    />
                                </div>
                                <GameSettings className="absolute top-0 right-0" />
                            </>
                        )}
                    </>
                )}
            </UiThemeProvider>
        </div>
    );
};
