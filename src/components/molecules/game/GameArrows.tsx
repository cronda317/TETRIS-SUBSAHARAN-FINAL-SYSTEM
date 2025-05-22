import classNames from 'classnames';
import {FC} from 'react';
import {
    FaChevronDown,
    FaChevronLeft,
    FaChevronRight,
    FaChevronUp
} from 'react-icons/fa';
import {GameDrop} from '../../atoms/game/GameDrop';
import {GameMove} from '../../atoms/game/GameMove';
import {ClassNameProps} from '../../particles/particles.types';
import {UiButtonShape} from '../../particles/ui/UiButton';
import {ControlsPosition} from '../../organisms/game/GameControls';

export interface GameArrowsProps {
    disabled?: boolean;
    hardDrop: string;
    left: string;
    onHardDrop: () => void;
    onLeft: () => void;
    onRight: () => void;
    onSoftDrop: (fast: boolean) => void;
    right: string;
    softDrop: string;
    speed?: number;
    position?: ControlsPosition;
}

export const GameArrows: FC<GameArrowsProps & ClassNameProps> = ({
    disabled,
    hardDrop,
    left,
    right,
    softDrop,
    onHardDrop,
    onLeft,
    onRight,
    onSoftDrop,
    speed = 500,
    position = 'bottom',
    className
}) => {
    const isVertical = position === 'left' || position === 'right';
    
    if (isVertical) {
        return (
            <div className={classNames(className, 'w-full')}>
                <div className="flex justify-center mb-2">
                    <GameDrop
                        disabled={disabled}
                        icon={<FaChevronUp />}
                        keyCode={hardDrop}
                        onDrop={(enable) => {
                            enable && onHardDrop();
                        }}
                        shape={UiButtonShape.UP}
                    />
                </div>
                <div className="flex justify-between mb-2">
                    <GameMove
                        disabled={disabled}
                        icon={<FaChevronLeft />}
                        keyCode={left}
                        onMove={onLeft}
                        speed={speed}
                        shape={UiButtonShape.LEFT}
                    />
                    <GameMove
                        disabled={disabled}
                        icon={<FaChevronRight />}
                        keyCode={right}
                        onMove={onRight}
                        speed={speed}
                        shape={UiButtonShape.RIGHT}
                    />
                </div>
                <div className="flex justify-center">
                    <GameDrop
                        disabled={disabled}
                        icon={<FaChevronDown />}
                        keyCode={softDrop}
                        onDrop={onSoftDrop}
                        shape={UiButtonShape.DOWN}
                    />
                </div>
            </div>
        );
    }
    
    return (
        <div className={classNames(className, 'grid grid-cols-3 gap-1')}>
            <div className="col-start-2 flex justify-center">
                <GameDrop
                    disabled={disabled}
                    icon={<FaChevronUp />}
                    keyCode={hardDrop}
                    onDrop={(enable) => {
                        enable && onHardDrop();
                    }}
                    shape={UiButtonShape.UP}
                />
            </div>
            <div className="col-start-1 flex justify-end">
                <GameMove
                    disabled={disabled}
                    icon={<FaChevronLeft />}
                    keyCode={left}
                    onMove={onLeft}
                    speed={speed}
                    shape={UiButtonShape.LEFT}
                />
            </div>
            <div className="col-start-3 flex justify-start">
                <GameMove
                    disabled={disabled}
                    icon={<FaChevronRight />}
                    keyCode={right}
                    onMove={onRight}
                    speed={speed}
                    shape={UiButtonShape.RIGHT}
                />
            </div>
            <div className="col-start-2 flex justify-center">
                <GameDrop
                    disabled={disabled}
                    icon={<FaChevronDown />}
                    keyCode={softDrop}
                    onDrop={onSoftDrop}
                    shape={UiButtonShape.DOWN}
                />
            </div>
        </div>
    );
};
