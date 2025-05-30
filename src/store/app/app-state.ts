import {createSlice} from '@reduxjs/toolkit';
import ReactGA from 'react-ga';
import {KEY_BINDINGS} from '../../components/particles/key_bindings.types';
import {AppActions} from './app-actions';
import {APP_INITIAL_STATE, APP_NAME, AppModel} from './app-model';

export namespace AppState {
    const track = (action: string, value?: number) => {
        ReactGA.event({category: APP_NAME, action, value});
    };

    export const slice = createSlice({
        name: APP_NAME,
        initialState: APP_INITIAL_STATE,
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(AppActions.backgroundTheme, (state, {payload}) => {
                    state.background_theme = payload;
                    track('background_theme', 1);
                })
                .addCase(AppActions.ghostPiece, (state, {payload}) => {
                    state.ghost_piece =
                        payload === undefined
                            ? !state.ghost_piece
                            : Boolean(payload);
                })
                .addCase(AppActions.music, (state, {payload}) => {
                    state.music =
                        payload === undefined ? !state.music : Boolean(payload);
                    track('music', state.music ? 1 : 0);
                })
                .addCase(AppActions.musicVolume, (state, {payload}) => {
                    state.music_volume = payload;
                })
                .addCase(AppActions.musicType, (state, {payload}) => {
                    state.music_type = payload;
                    track('music_type', state.music_type);
                })
                .addCase(AppActions.sound, (state, {payload}) => {
                    state.sound =
                        payload === undefined ? !state.sound : Boolean(payload);
                    track('sound', state.sound ? 1 : 0);
                })
                .addCase(AppActions.soundVolume, (state, {payload}) => {
                    state.sound_volume = payload;
                })
                .addCase(AppActions.keys, (state, {payload}) => {
                    for (const key of KEY_BINDINGS) {
                        if (state.keys[key] === payload.code) {
                            state.keys[key] = '';
                            break;
                        }
                    }
                    state.keys[payload.keyOf] = payload.code;
                })
                .addCase(AppActions.open, (state, {payload}) => {
                    state.dialog = payload;
                })
                .addCase(AppActions.close, (state) => {
                    state.dialog = undefined;
                })
                .addCase(AppActions.startLevel, (state, {payload}) => {
                    const max_levels = 25;
                    const skip_levels = 5;
                    if (payload === undefined) {
                        if (state.start_level === 1) {
                            state.start_level = skip_levels;
                        } else {
                            state.start_level =
                                state.start_level < max_levels
                                    ? state.start_level + skip_levels
                                    : 1;
                        }
                    } else {
                        state.start_level = Math.max(
                            1,
                            Math.min(payload, max_levels)
                        );
                    }
                    track('start_level', state.start_level);
                })
                .addCase(AppActions.recordScore, (state, {payload}) => {
                    const high_scores = Array.from(
                        new Set([...state.high_scores, payload])
                    );
                    high_scores.sort((a, b) => a - b);
                    state.high_scores = high_scores.reverse().slice(0, 9);
                    track('high_scores', payload);
                })
                .addCase(AppActions.resetScore, (state) => {
                    state.high_scores = [];
                })
                .addCase(AppActions.resetOptions, (state) => {
                    track('reset_options');
                    const {dialog, high_scores} = state;
                    return {
                        ...APP_INITIAL_STATE,
                        dialog,
                        high_scores
                    };
                })
                .addCase(AppActions.persist, (state, {payload}) => {
                    return {...payload} satisfies AppModel;
                })
                .addCase(AppActions.setUsername, (state, {payload}) => {
                    state.username = payload;
                    state.has_username = true;
                });
        }
    });
}
