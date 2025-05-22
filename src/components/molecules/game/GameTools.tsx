import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../store/app-store';
import { GameActions } from '../../../store/game/game-actions';
import { GameSelectors } from '../../../store/game/game-selectors';
import { GameTool, GameToolType } from '../../../store/game/game-model';
import { ClassNameProps } from '../../particles/particles.types';
import { FaSave, FaForward, FaTrash } from 'react-icons/fa';

export const GameTools: FC<ClassNameProps> = ({ className }) => {
    const tools = useSelector(GameSelectors.tools);
    const availableTools = useSelector(GameSelectors.availableTools);
    const score = useSelector(GameSelectors.score);
    const hasSavedGame = useSelector(GameSelectors.hasSavedGame);
    const dispatch = useAppDispatch();
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

    const handleUseTool = (toolType: GameToolType) => {
        dispatch(GameActions.useTool(toolType));
    };

    // Get icon for tool type
    const getToolIcon = (type: GameToolType) => {
        switch (type) {
            case GameToolType.SAVE_GAME:
                return <FaSave className="text-lg" />;
            case GameToolType.SKIP_PIECE:
                return <FaForward className="text-lg" />;
            case GameToolType.CLEAR_ROW:
                return <FaTrash className="text-lg" />;
            default:
                return null;
        }
    };

    // Get cost text for using a tool
    const getToolCostText = (tool: GameTool) => {
        return `Costs ${tool.requiredScore} points`;
    };

    // Get detailed description for tool
    const getToolDescription = (tool: GameTool) => {
        switch (tool.type) {
            case GameToolType.SAVE_GAME:
                return `Save your current game to resume later (Costs ${tool.requiredScore} points)`;
            case GameToolType.SKIP_PIECE:
                return `Skip the current piece and get 3 favorable pieces next (Costs ${tool.requiredScore} points)`;
            case GameToolType.CLEAR_ROW:
                return `Clear up to 4 bottom rows and earn line-clearing points (Costs ${tool.requiredScore} points)`;
            default:
                return tool.description;
        }
    };

    // Show progress towards unlocking tools
    const getToolProgress = (tool: GameTool) => {
        if (tool.available) return 100;
        const progress = Math.min(100, Math.floor((score / tool.requiredScore) * 100));
        return progress;
    };
    
    // Show tooltip for tool
    const showTooltip = (toolType: string) => {
        setActiveTooltip(toolType);
    };
    
    // Hide tooltip
    const hideTooltip = () => {
        setActiveTooltip(null);
    };

    // Load saved game function
    const handleLoadGame = () => {
        if (hasSavedGame) {
            dispatch(GameActions.loadGame());
        }
    };

    return (
        <div className={`${className || ''} flex flex-col`}>
            <div className="text-sm font-medium mb-1 text-primary flex items-center">
                <span>Game Tools</span>
            </div>
            <div className="flex flex-col space-y-3">
                {Object.values(tools).map((tool) => (
                    <div key={tool.type} className="flex flex-col relative">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div 
                                    className={`p-2 rounded-full ${tool.available 
                                        ? 'bg-green-500 text-white cursor-pointer hover:bg-green-600 transform hover:scale-110 transition-all shadow-md animate-pulse' 
                                        : 'bg-gray-300 text-gray-500 opacity-70'}`}
                                    onClick={() => tool.available && handleUseTool(tool.type)}
                                    onMouseEnter={() => showTooltip(tool.type)}
                                    onMouseLeave={hideTooltip}
                                    title={tool.available ? `Use ${tool.name}` : `Need ${tool.requiredScore} points`}
                                >
                                    {getToolIcon(tool.type)}
                                </div>
                                <div className="ml-2 flex flex-col">
                                    <div className="text-sm font-medium">{tool.name}</div>
                                    {!tool.available && (
                                        <div className="text-[10px] text-gray-500">
                                            {score}/{tool.requiredScore} points
                                        </div>
                                    )}
                                    {tool.available && (
                                        <div className="text-[10px] text-green-600 font-medium">
                                            {getToolCostText(tool)} <span className="text-blue-500">• Click to use!</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Tool progress bar */}
                        {!tool.available && (
                            <div className="w-full bg-gray-200 h-1 mt-1 rounded-full overflow-hidden">
                                <div
                                    className="bg-blue-500 h-1 transition-all duration-300"
                                    style={{ width: `${getToolProgress(tool)}%` }}
                                ></div>
                            </div>
                        )}
                        
                        {/* Tooltip */}
                        {activeTooltip === tool.type && (
                            <div className="absolute z-10 left-0 top-10 w-56 p-2 mt-1 text-xs bg-gray-800 text-white rounded shadow-lg border border-blue-400">
                                {getToolDescription(tool)}
                            </div>
                        )}
                    </div>
                ))}
                
                {/* Load saved game button */}
                {hasSavedGame && (
                    <div 
                        className="mt-2 p-2 rounded bg-blue-500 text-white text-center text-xs cursor-pointer hover:bg-blue-600 transition-all shadow-md"
                        onClick={handleLoadGame}
                    >
                        Load Saved Game
                    </div>
                )}
            </div>
        </div>
    );
}; 