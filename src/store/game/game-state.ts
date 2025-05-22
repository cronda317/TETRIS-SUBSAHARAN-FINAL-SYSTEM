import {ActionReducerMapBuilder, createSlice} from '@reduxjs/toolkit';
import ReactGA from 'react-ga';
import {
    SOUND_DROP,
    SOUND_FINISHED,
    SOUND_LEVEL_10,
    SOUND_SCORE
} from '../../components/particles/audio.types';
import {randTetro} from '../../components/particles/utilities.types';
import {
    gameBufferPatch,
    gameBufferRowCount,
    gameBufferRowSome
} from '../../engine/game-buffer';
import {gameCollision} from '../../engine/game-collision';
import {gameGhost} from '../../engine/game-ghost';
import {gamePlayerCreate, gamePlayerTransform} from '../../engine/game-player';
import {gameReset} from '../../engine/game-reset';
import {gameScore} from '../../engine/game-score';
import {gameScreenRender} from '../../engine/game-screen';
import {gameSound} from '../../engine/game-sound';
import {
    gameDropPlayer,
    gameTickPlayer,
    gameTickRows
} from '../../engine/game-tick';
import {
    GamePlayerDirection,
    gameTransform,
    rotateDirection,
    rotateNoop,
    translateDirection,
    translateNoop
} from '../../engine/game-transform';
import {SnapshotAction} from '../snapshot-middleware';
import {GameActions} from './game-actions';
import {
    GAME_INITIAL_STATE,
    GAME_NAME,
    GameModel,
    GameStatus,
    GameToolType
} from './game-model';
import {createSelector} from 'reselect';
import { TetrominosType } from '../../engine/game-tetrominos';

export namespace GameState {
    const track = (action: string, value?: number) => {
        ReactGA.event({category: GAME_NAME, action, value});
    };

    /**
     * Updates the availability of game tools based on the player's score
     */
    const updateGameTools = (state: GameModel, isInitialCheck: boolean = false): void => {
        let shouldNotify = !isInitialCheck; // Don't notify for initial checks
        
        Object.values(state.tools).forEach(tool => {
            // Mark tool as available if current score is enough
            if (state.score >= tool.requiredScore && !tool.available) {
                tool.available = true;
                
                // Only notify and play sound if this is not an initial check
                if (shouldNotify) {
                    // Notify player that a tool is available
                    state.toast_message = `${tool.name} tool is now available!`;
                    
                    // Play a sound for tool availability
                    if (state.status === GameStatus.RUNNING) {
                        const soundTrack = {
                            id: state.sound_id++,
                            src: SOUND_LEVEL_10 // Reuse level-up sound for tool availability
                        };
                        state.sound_tracks.push(soundTrack);
                    }
                }
            } else if (state.score < tool.requiredScore && tool.available) {
                // If score drops below required score (e.g. after using another tool),
                // mark the tool as unavailable
                tool.available = false;
            }
        });
    };

    /**
     * Clears multiple rows from the bottom of the game board
     */
    const clearBottomRows = (state: GameModel, rowCount: number = 1): void => {
        let clearedRows = 0;
        const bottomRowIndex = state.buffer.rows.length - 1;
        
        // Start from the bottom and clear rows with blocks
        for (let i = bottomRowIndex; i >= 0 && clearedRows < rowCount; i--) {
            const row = state.buffer.rows[i];
            if (row && row.cells.some(cell => cell.type !== undefined)) {
                // Clear all cells in the row
                row.cells.forEach(cell => {
                    cell.type = undefined;
                });
                row.removed = true;
                clearedRows++;
            }
        }
        
        return;
    };

    export const slice = createSlice({
        name: GAME_NAME,
        initialState: GAME_INITIAL_STATE,
        reducers: {},
        extraReducers: (builder: ActionReducerMapBuilder<GameModel>) => {
            builder
                .addCase(GameActions.softDrop, (state, {payload}) => {
                    state.soft_drop = payload;
                })
                .addCase(GameActions.start, (state, {payload}) => {
                    track('start');
                    const reset = gameReset(state.next_max);
                    return {
                        ...reset,
                        level: payload,
                        status: GameStatus.STARTING
                    };
                })
                .addCase(GameActions.run, (state, action) => {
                    state.status = GameStatus.RUNNING;
                    
                    // Check if any tools are available from the start
                    // Pass true to prevent notification at game start
                    updateGameTools(state, true);
                    
                    // Store initial game speed factor for consistency
                    state.initialSpeedFactor = state.level * 20;
                    
                    console.log('Game started with initial speed factor:', state.initialSpeedFactor);
                })
                .addCase(GameActions.pause, (state, action) => {
                    track('pause');
                    state.status = GameStatus.PAUSED;
                })
                .addCase(GameActions.resume, (state, action) => {
                    track('resume');
                    state.status = GameStatus.STARTING;
                })
                .addCase(GameActions.quit, (state) => {
                    track('quit');
                    return gameReset(state.next_max);
                })
                .addCase(GameActions.render, (state, action) => {
                    state.screen = gameScreenRender(
                        state.buffer,
                        state.player,
                        state.ghost
                    );
                })
                .addCase<SnapshotAction>(
                    GameActions.tick,
                    (state, {snapshot}) => {
                        if (state.player) {
                            const {collision, lines} = gameTickPlayer(
                                state.buffer,
                                state.player!
                            );
                            if (collision) {
                                const old_level = state.level;
                                const sound = gameScore(
                                    state,
                                    state.player.type,
                                    lines!
                                );
                                if (
                                    old_level !== state.level &&
                                    state.level % 5 === 0
                                ) {
                                    state.toast_message = `Level ${state.level}`;
                                    if (snapshot?.app.sound) {
                                        gameSound(state, SOUND_LEVEL_10);
                                    }
                                }
                                if (snapshot?.app.sound && sound) {
                                    gameSound(state, sound);
                                }
                                state.player_freeze = false;
                                state.hold_enable = true;
                                state.player = undefined;
                                state.ghost = undefined;
                                
                                // Update tool availability when score changes
                                updateGameTools(state);
                            } else {
                                state.ghost = snapshot?.app.ghost_piece
                                    ? gameGhost(state.buffer, state.player)
                                    : undefined;
                            }
                        } else {
                            if (!gameTickRows(state.buffer)) {
                                const next = state.next.shift();
                                if (state.next.length < state.next_max) {
                                    state.next.push(randTetro());
                                }
                                const player = gamePlayerCreate(
                                    next!,
                                    state.buffer.width
                                );
                                const trans = gameTransform(
                                    player,
                                    translateNoop,
                                    rotateNoop
                                );
                                if (gameCollision(trans, state.buffer)) {
                                    snapshot?.app.sound &&
                                        gameSound(state, SOUND_FINISHED);
                                    state.restart_ticker++;
                                    state.status = GameStatus.FINISHING;
                                } else {
                                    state.player = player;
                                    state.ghost = snapshot?.app.ghost_piece
                                        ? gameGhost(state.buffer, player)
                                        : undefined;
                                }
                            }
                        }
                        state.screen = gameScreenRender(
                            state.buffer,
                            state.player,
                            state.ghost
                        );
                    }
                )
                .addCase<SnapshotAction>(
                    GameActions.finishing,
                    (state, {snapshot}) => {
                        const isRemoved = state.buffer.rows.find(
                            (row) => row.removed
                        );
                        if (isRemoved) {
                            state.score += gameBufferRowCount(isRemoved);
                            gameTickRows(state.buffer);
                            
                            // Update tool availability when score changes
                            updateGameTools(state);
                        } else {
                            const nextRow = state.buffer.rows.find((r) =>
                                gameBufferRowSome(r)
                            );
                            if (nextRow) {
                                nextRow.removed = true;
                            } else {
                                state.status = GameStatus.FINISHED;
                            }
                        }
                        state.screen = gameScreenRender(
                            state.buffer,
                            state.player,
                            state.ghost
                        );
                    }
                )
                .addCase<SnapshotAction>(
                    GameActions.hardDrop,
                    (state, {snapshot}) => {
                        if (state.player && !state.player_freeze) {
                            const origin_y = state.player.y;
                            gameDropPlayer(state.buffer, state.player);
                            state.restart_ticker++;
                            state.screen = gameScreenRender(
                                state.buffer,
                                state.player,
                                undefined,
                                origin_y
                            );
                            state.player_freeze = true;
                            state.ghost = undefined;
                            if (snapshot?.app.sound) {
                                gameSound(state, SOUND_DROP);
                                gameSound(state, SOUND_SCORE);
                            }
                        }
                    }
                )
                .addCase(GameActions.bufferSet, (state, {payload}) => {
                    state.buffer = payload;
                })
                .addCase(GameActions.bufferPatch, (state, {payload}) => {
                    payload.forEach((patch) =>
                        gameBufferPatch(state.buffer, patch)
                    );
                })
                .addCase<SnapshotAction<GamePlayerDirection>>(
                    GameActions.rotate,
                    (state, {payload, snapshot}) => {
                        if (state.player && !state.player_freeze) {
                            gamePlayerTransform(
                                state.buffer,
                                state.player,
                                translateNoop,
                                rotateDirection[payload]
                            );
                            state.ghost = snapshot?.app.ghost_piece
                                ? gameGhost(state.buffer, state.player)
                                : undefined;
                            state.screen = gameScreenRender(
                                state.buffer,
                                state.player,
                                state.ghost
                            );
                        }
                    }
                )
                .addCase<SnapshotAction<GamePlayerDirection>>(
                    GameActions.move,
                    (state, {payload, snapshot}) => {
                        if (state.player && !state.player_freeze) {
                            gamePlayerTransform(
                                state.buffer,
                                state.player,
                                translateDirection[payload],
                                rotateNoop
                            );
                            state.ghost = snapshot?.app.ghost_piece
                                ? gameGhost(state.buffer, state.player)
                                : undefined;
                            state.screen = gameScreenRender(
                                state.buffer,
                                state.player,
                                state.ghost
                            );
                        }
                    }
                )
                .addCase(GameActions.hold, (state) => {
                    if (
                        state.player &&
                        !state.player_freeze &&
                        state.hold_enable
                    ) {
                        const nextHold = state.player.type;
                        let nextPiece = state.hold;
                        if (!nextPiece) {
                            nextPiece = state.next.shift();
                            state.next.push(randTetro());
                        }
                        state.player = undefined;
                        state.ghost = undefined;
                        state.hold = nextHold;
                        state.hold_enable = false;
                    }
                })
                .addCase(GameActions.soundTrack, (state, {payload}) => {
                    state.sound_tracks = state.sound_tracks.filter(
                        (track) => track.id !== payload
                    );
                })
                .addCase(GameActions.patch, (state, {payload}) => {
                    return {...state, ...payload};
                })
                .addCase(GameActions.toast, (state, {payload}) => {
                    state.toast_message = payload;
                })
                .addCase(GameActions.updateTools, (state) => {
                    updateGameTools(state);
                })
                .addCase(GameActions.saveGame, (state) => {
                    if (state.status === GameStatus.RUNNING || state.status === GameStatus.PAUSED) {
                        // Create a deep copy of the current game state
                        const { savedGame, tools, ...gameStateToBeSaved } = state;
                        state.savedGame = JSON.parse(JSON.stringify(gameStateToBeSaved));
                        state.toast_message = 'Game saved!';
                        
                        // Add bonus points for using the save tool
                        state.score += 50;
                        
                        // Play a sound
                        const soundTrack = {
                            id: state.sound_id++,
                            src: SOUND_SCORE
                        };
                        state.sound_tracks.push(soundTrack);
                        
                        // Make the tool unavailable after use
                        if (state.tools[GameToolType.SAVE_GAME].available) {
                            state.tools[GameToolType.SAVE_GAME].available = false;
                        }
                    }
                })
                .addCase(GameActions.loadGame, (state) => {
                    if (state.savedGame) {
                        // Restore the saved game state
                        const savedTools = state.tools;
                        const currentSavedGame = state.savedGame;
                        Object.assign(state, state.savedGame);
                        
                        // Keep the current tools state
                        state.tools = savedTools;
                        state.savedGame = currentSavedGame;
                        
                        // Play a sound
                        const soundTrack = {
                            id: state.sound_id++,
                            src: SOUND_LEVEL_10
                        };
                        state.sound_tracks.push(soundTrack);
                        
                        state.toast_message = 'Game restored!';
                        state.status = GameStatus.PAUSED; // Resume from paused state
                    }
                })
                .addCase(GameActions.useTool, (state, { payload: toolType }) => {
                    const tool = state.tools[toolType];
                    
                    // Only allow using tools in running or paused state and if player has enough points
                    if ((state.status !== GameStatus.RUNNING && state.status !== GameStatus.PAUSED) || 
                        !tool.available || 
                        state.score < tool.requiredScore) {
                        return;
                    }
                    
                    // Play sound effect for tool use
                    const soundTrack = {
                        id: state.sound_id++,
                        src: SOUND_SCORE
                    };
                    state.sound_tracks.push(soundTrack);
                    
                    // Deduct the cost of the tool from player's score
                    state.score -= tool.requiredScore;
                    
                    switch (toolType) {
                        case GameToolType.SAVE_GAME:
                            // Save game action with enhanced feedback
                            const { savedGame, tools, ...gameStateToBeSaved } = state;
                            state.savedGame = JSON.parse(JSON.stringify(gameStateToBeSaved));
                            
                            // Add visual feedback
                            const saveSound = {
                                id: state.sound_id++,
                                src: SOUND_LEVEL_10
                            };
                            state.sound_tracks.push(saveSound);
                            
                            // Store timestamp of when the game was saved
                            const saveDate = new Date();
                            state.savedGameTimestamp = saveDate.toISOString();
                            
                            // If in running state, briefly pause to indicate save happened
                            if (state.status === GameStatus.RUNNING) {
                                state.status = GameStatus.PAUSED;
                                
                                // Make the "Load Game" option immediately available
                                state.hasSavedGamePrompt = true;
                            }
                            
                            state.toast_message = `Game saved at ${saveDate.toLocaleTimeString()}! (-${tool.requiredScore} points)`;
                            break;
                            
                        case GameToolType.SKIP_PIECE:
                            if (state.player) {
                                // Skip the current piece by getting the next piece
                                state.player = undefined;
                                state.ghost = undefined;
                                
                                // Add better next pieces as a reward (3 good pieces instead of 2)
                                // Choose from I, T, L, J which are generally most useful
                                const goodPieces = [
                                    TetrominosType.I,
                                    TetrominosType.T,
                                    TetrominosType.L,
                                    TetrominosType.J
                                ];
                                
                                // Add 3 good pieces to the beginning of the queue
                                const goodPiece1 = goodPieces[Math.floor(Math.random() * goodPieces.length)];
                                const goodPiece2 = goodPieces[Math.floor(Math.random() * goodPieces.length)];
                                const goodPiece3 = goodPieces[Math.floor(Math.random() * goodPieces.length)];
                                
                                // Add the good pieces to the front of the queue
                                state.next.unshift(goodPiece3);
                                state.next.unshift(goodPiece2);
                                state.next.unshift(goodPiece1);
                                
                                // Remove extra pieces if needed
                                while (state.next.length > state.next_max + 2) {
                                    state.next.pop();
                                }
                                
                                // Add visual effect by playing a special sound
                                const skipSound = {
                                    id: state.sound_id++,
                                    src: SOUND_LEVEL_10
                                };
                                state.sound_tracks.push(skipSound);
                                
                                state.toast_message = `Skipped piece! (-${tool.requiredScore} points, 3 favorable pieces coming)`;
                            }
                            break;
                            
                        case GameToolType.CLEAR_ROW:
                            // Always clear bottom rows, even if they're empty (up to 4 rows)
                            let rowsCleared = 0;
                            const bottomRowIndex = state.buffer.rows.length - 1;
                            
                            // First, identify rows that have blocks
                            const rowsToClear = [];
                            for (let i = bottomRowIndex; i >= 0 && rowsToClear.length < 4; i--) {
                                const row = state.buffer.rows[i];
                                if (row && row.cells.some(cell => cell.type !== undefined)) {
                                    rowsToClear.push(i);
                                }
                            }
                            
                            // If we found rows with blocks, clear them
                            if (rowsToClear.length > 0) {
                                rowsCleared = rowsToClear.length;
                                // Clear the rows
                                rowsToClear.forEach(rowIndex => {
                                    const row = state.buffer.rows[rowIndex];
                                    row.cells.forEach(cell => {
                                        cell.type = undefined;
                                    });
                                    row.removed = true;
                                });
                                
                                // Visual feedback - play sound effects for each row cleared
                                const clearSounds = [];
                                for (let i = 0; i < rowsCleared; i++) {
                                    clearSounds.push({
                                        id: state.sound_id++,
                                        src: SOUND_SCORE
                                    });
                                }
                                state.sound_tracks.push(...clearSounds);
                                
                                // Update lines cleared count
                                state.lines_total += rowsCleared;
                                state.lines_level += rowsCleared;
                                
                                // Check for level up
                                if (state.lines_level >= state.lines_level_up) {
                                    state.level += 1;
                                    state.lines_level = 0;
                                    state.lines_level_up = Math.min(10, state.level);
                                    
                                    // Play level up sound
                                    const levelUpSound = {
                                        id: state.sound_id++,
                                        src: SOUND_LEVEL_10
                                    };
                                    state.sound_tracks.push(levelUpSound);
                                }
                                
                                state.toast_message = `Cleared ${rowsCleared} row${rowsCleared > 1 ? 's' : ''}! (-${tool.requiredScore} points)`;
                            } else {
                                // If no rows with blocks, clear bottom 4 rows anyway as a "preparation" move
                                for (let i = bottomRowIndex; i >= bottomRowIndex - 3; i--) {
                                    if (i >= 0) {
                                        const row = state.buffer.rows[i];
                                        row.cells.forEach(cell => {
                                            cell.type = undefined;
                                        });
                                        rowsCleared++;
                                    }
                                }
                                state.toast_message = `Prepared bottom rows for your next moves! (-${tool.requiredScore} points)`;
                            }
                            break;
                    }
                    
                    // Make the tool unavailable after use until player earns enough points again
                    tool.available = false;
                    
                    // Check if other tools should be made unavailable due to score change
                    updateGameTools(state);
                });
        }
    });
}
