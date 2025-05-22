import {VFC} from 'react';
import {GameSelectors} from '../../store/game/game-selectors';
import {GamePieces} from '../molecules/game/GamePieces';
import {GameTools} from '../molecules/game/GameTools';
import {GameControls} from '../organisms/game/GameControls';
import {GameEngine} from '../organisms/game/GameEngine';
import {GameNumbers} from '../organisms/game/GameNumbers';
import {usePageView} from '../particles/hooks/usePageView';

export interface GameDesktopProps {
    floatControls: boolean;
}

export const GameDesktop: VFC<GameDesktopProps> = ({floatControls}) => {
    usePageView('/game/desktop');
    return (
        <>
            <div className="grid grid-cols-desktop gap-4 m-auto py-4 pb-28">
                <div className="flex flex-col">
                    <GamePieces
                        reverse={true}
                        className="p-4"
                        label="Hold"
                        selectPieces={GameSelectors.hold}
                    />
                    <GameTools className="mt-4 p-4" />
                    <GameNumbers className="flex-col mt-auto gap-4" />
                </div>
                <div className="flex flex-col">
                    <GameEngine className="mb-8" />
                </div>
                <div className="flex flex-col">
                    <GamePieces
                        className="p-4"
                        label="Next"
                        reverse={true}
                        selectPieces={GameSelectors.next}
                    />
                </div>
            </div>
            
            {/* Left side: movement controls only */}
            <div className="fixed left-0 top-1/3 transform -translate-y-1/2 pointer-events-none pl-4">
                <div className="pointer-events-auto">
                    <GameControls
                        className="w-auto"
                        position="left"
                        transparent={true}
                        controlsType="movement"
                    />
                </div>
            </div>
            
            {/* Right side: rotation and other controls */}
            <div className="fixed right-0 top-1/3 transform -translate-y-1/2 pointer-events-none pr-4">
                <div className="pointer-events-auto">
                    <GameControls
                        className="w-auto"
                        position="right"
                        transparent={true}
                        controlsType="rotation"
                    />
                </div>
            </div>
        </>
    );
};

