import {VFC} from 'react';
import {GameSelectors} from '../../store/game/game-selectors';
import {GamePieces} from '../molecules/game/GamePieces';
import {GameTools} from '../molecules/game/GameTools';
import {GameControls} from '../organisms/game/GameControls';
import {GameEngine} from '../organisms/game/GameEngine';
import {GameNumbers} from '../organisms/game/GameNumbers';
import {usePageView} from '../particles/hooks/usePageView';

export const GameMobile: VFC = () => {
    usePageView('/game/mobile');
    return (
        <div className="flex flex-col h-full p-4 pb-28">
            <GameNumbers className="mx-auto gap-2 mb-2" reverse={true} />
            <div className="grid grid-cols-mobile gap-2 mx-auto">
                <div className="flex flex-col">
                    <GamePieces
                        className="p-1"
                        label="Hold"
                        reverse={true}
                        selectPieces={GameSelectors.hold}
                    />
                    <GameTools className="mt-2 p-1" />
                </div>
                <div className="flex flex-col mb-8">
                    <GameEngine className="mb-2" />
                </div>
                <div className="flex flex-col">
                    <GamePieces
                        className="p-1"
                        label="Next"
                        reverse={true}
                        selectPieces={GameSelectors.next}
                    />
                </div>
            </div>
            
            {/* Left side: movement controls */}
            <div className="fixed left-0 top-1/3 transform -translate-y-1/2 pointer-events-none pl-2">
                <div className="pointer-events-auto">
                    <GameControls 
                        className="w-auto scale-75" 
                        position="left"
                        transparent={true}
                        controlsType="movement"
                    />
                </div>
            </div>
            
            {/* Right side: rotation controls */}
            <div className="fixed right-0 top-1/3 transform -translate-y-1/2 pointer-events-none pr-2">
                <div className="pointer-events-auto">
                    <GameControls 
                        className="w-auto scale-75"
                        position="right" 
                        transparent={true}
                        controlsType="rotation"
                    />
                </div>
            </div>
        </div>
    );
};
