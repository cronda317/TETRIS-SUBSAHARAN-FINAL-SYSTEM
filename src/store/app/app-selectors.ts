import {createSelector} from '@reduxjs/toolkit';
import {selectRoot} from '../select-root';
import {AppDialogType, AppModel, AppPersist} from './app-model';

export namespace AppSelectors {
    /**
     * Root app selector.
     */
    export const app = createSelector(selectRoot, (state) => state.app);

    /**
     * Selects the current background theme.
     */
    export const backgroundTheme = createSelector(app, (app) => app.background_theme);

    /**
     * Selects high scores.
     */
    export const highScores = createSelector(app, (app) => app.high_scores);

    /**
     * Selects ghost piece.
     */
    export const ghostPiece = createSelector(app, (app) => app.ghost_piece);

    /**
     * Selects if music is enabled.
     */
    export const music = createSelector(app, (app) => Boolean(app.music));

    /**
     * Selects if music is enabled.
     */
    export const musicType = createSelector(app, (app) => app.music_type);

    /**
     * Selects if music is enabled.
     */
    export const musicVolume = createSelector(app, (app) => app.music_volume);

    /**
     * Selects if sound is enabled.
     */
    export const sound = createSelector(app, (app) => Boolean(app.sound));

    /**
     * Selects sound volume.
     */
    export const soundVolume = createSelector(app, (app) => app.sound_volume);

    /**
     * Selects which dialog is displayed.
     */
    export const dialog = createSelector(app, (app) => app.dialog);

    /**
     * Selects if a given dialog is visible.
     */
    export const isOpen = (show: AppDialogType) =>
        createSelector(dialog, (dialog) => dialog === show);

    /**
     * Selects player's starting level.
     */
    export const startLevel = createSelector(app, (app) => app.start_level);

    /**
     * Selects the keyboard key bindings.
     */
    export const keys = createSelector(app, (app) => app.keys);

    /**
     * Selects if the user has set a username.
     */
    export const hasUsername = createSelector(app, (app) => app.has_username);

    /**
     * Selects the user's username.
     */
    export const username = createSelector(app, (app) => app.username || '');

    /**
     * Selects values to persist to local storage.
     */
    export const persist = createSelector(
        backgroundTheme,
        ghostPiece,
        startLevel,
        sound,
        soundVolume,
        music,
        musicVolume,
        musicType,
        highScores,
        keys,
        username,
        hasUsername,
        (
            background_theme,
            ghost_piece,
            start_level,
            sound,
            sound_volume,
            music,
            music_volume,
            music_type,
            high_scores,
            keys,
            username,
            has_username
        ): AppPersist => {
            return {
                background_theme,
                ghost_piece,
                start_level,
                sound,
                sound_volume,
                music,
                music_volume,
                music_type,
                high_scores,
                keys,
                username,
                has_username
            };
        }
    );
}
