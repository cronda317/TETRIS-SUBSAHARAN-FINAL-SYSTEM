import {SoundTrack} from '../../components/particles/audio.types';
import {GameBuffer} from '../../engine/game-buffer';
import {GameGhost, GamePlayer} from '../../engine/game-player';
import {GameScreen} from '../../engine/game-screen';
import {TetrominosType} from '../../engine/game-tetrominos';

/**
 * Status controls the running state of the game.
 */
export enum GameStatus {
    /**
     * Shows the welcome screen.
     */
    WELCOME = 'welcome',
    /**
     * Shows the count down timer.
     */
    STARTING = 'starting',
    /**
     * Pieces are falling.
     */
    RUNNING = 'running',
    /**
     * Game is in progress but paused.
     */
    PAUSED = 'paused',
    /**
     * Game is over and collecting final points.
     */
    FINISHING = 'finishing',
    /**
     * Game is finished and final score is shown.
     */
    FINISHED = 'finished'
}

/**
 * Game tools that can be used to help the player
 */
export enum GameToolType {
    /**
     * Save the game state to resume later
     */
    SAVE_GAME = 'save_game',
    /**
     * Skip a difficult piece
     */
    SKIP_PIECE = 'skip_piece',
    /**
     * Clear the bottom row
     */
    CLEAR_ROW = 'clear_row'
}

/**
 * Represents a game tool
 */
export interface GameTool {
    /**
     * The type of tool
     */
    type: GameToolType;
    
    /**
     * Score required to use this tool
     */
    requiredScore: number;
    
    /**
     * Whether the tool is currently available
     */
    available: boolean;
    
    /**
     * Display name of the tool
     */
    name: string;
    
    /**
     * Tool description
     */
    description: string;
}

export type NextTetrominos = Array<TetrominosType | undefined>;

/**
 * The store for the game engine.
 */
export interface GameModel {
    /**
     * Defines the background buffer of blocks.
     */
    buffer: GameBuffer;

    /**
     * Speed for fast mode.
     */
    fast_speed: number;

    /**
     * Initial speed factor based on starting level
     * Used to maintain consistent game speed
     */
    initialSpeedFactor?: number;

    /**
     * Defines the location of the ghost piece.
     */
    ghost?: GameGhost;

    /**
     * Stores a piece being held.
     */
    hold?: TetrominosType;

    /**
     * Controls holding only once per turn.
     */
    hold_enable: boolean;

    /**
     * Player's current level.
     */
    level: number;

    /**
     * Number of lines cleared on current level.
     */
    lines_level: number;

    /**
     * Number of lines to clear current level.
     */
    lines_level_up: number;

    /**
     * Number of lines cleared so far.
     */
    lines_total: number;

    /**
     * Collection of pieces coming next.
     */
    next: NextTetrominos;

    /**
     * Number of pieces in the next queue.
     */
    next_max: number;

    /**
     * Defines the location of the current piece.
     */
    player?: GamePlayer;

    /**
     * Piece was hard dropped.
     */
    player_freeze: boolean;

    /**
     * Speed of repeating control inputs.
     */
    repeat_speed: number;

    /**
     * Uses to restart the game ticker.
     */
    restart_ticker: number;

    /**
     * Player's current score.
     */
    score: number;

    /**
     * Output buffer that combines the background buffer and player's falling
     * piece.
     */
    screen: GameScreen;

    /**
     * Player is holding the soft drop key.
     */
    soft_drop: boolean;

    /**
     * Next sound track ID.
     */
    sound_id: number;

    /**
     * Collection of sound tracks being played.
     */
    sound_tracks: Array<SoundTrack>;

    /**
     * Game status
     */
    status: GameStatus;

    /**
     * Displays a message to the player.
     */
    toast_message?: string;
    
    /**
     * Game tools that can be used
     */
    tools: Record<GameToolType, GameTool>;
    
    /**
     * Saved game state for the save tool
     */
    savedGame?: Omit<GameModel, 'savedGame' | 'tools'>;

    /**
     * Timestamp of when the game was saved
     */
    savedGameTimestamp?: string;

    /**
     * Flag to indicate that saved game prompt should be shown
     */
    hasSavedGamePrompt?: boolean;
}

/**
 * Default state of the store.
 */
export const GAME_INITIAL_STATE: GameModel = {
    buffer: {rows: [], width: 0, height: 0},
    restart_ticker: 0,
    fast_speed: 25,
    level: 1,
    lines_total: 0,
    lines_level: 0,
    lines_level_up: 1,
    hold_enable: true,
    next: [undefined, undefined, undefined],
    next_max: 3,
    player_freeze: false,
    repeat_speed: 100,
    score: 0,
    screen: [],
    soft_drop: false,
    sound_id: 1,
    sound_tracks: [],
    status: GameStatus.WELCOME,
    tools: {
        [GameToolType.SAVE_GAME]: {
            type: GameToolType.SAVE_GAME,
            requiredScore: 100,
            available: false,
            name: 'Save Game',
            description: 'Save current game to resume later (Costs 100 points)'
        },
        [GameToolType.SKIP_PIECE]: {
            type: GameToolType.SKIP_PIECE,
            requiredScore: 200,
            available: false,
            name: 'Skip Piece',
            description: 'Skip current difficult piece (Costs 200 points)'
        },
        [GameToolType.CLEAR_ROW]: {
            type: GameToolType.CLEAR_ROW,
            requiredScore: 150,
            available: false,
            name: 'Clear Row',
            description: 'Clear the bottom row (Costs 150 points)'
        }
    }
};

/**
 * Name of the store.
 */
export const GAME_NAME = 'game';
