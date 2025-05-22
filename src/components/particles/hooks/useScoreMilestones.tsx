import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../store/app-store';
import { GameActions } from '../../../store/game/game-actions';
import { GameSelectors } from '../../../store/game/game-selectors';
import { GameStatus } from '../../../store/game/game-model';

/**
 * Milestone interval at which to show the video (every 50 points)
 */
export const MILESTONE_INTERVAL = 50;

/**
 * Custom hook to track when score milestones are reached
 * Returns true when a milestone is hit
 */
export const useScoreMilestones = (): { showVideo: boolean; resetMilestone: () => void } => {
    const score = useSelector(GameSelectors.score);
    const running = useSelector(GameSelectors.running);
    const gameStatus = useSelector(GameSelectors.status);
    const [lastMilestone, setLastMilestone] = useState(0);
    const [showVideo, setShowVideo] = useState(false);
    const [prevStatus, setPrevStatus] = useState<GameStatus | null>(null);
    const [wasPaused, setWasPaused] = useState(false);
    const dispatch = useAppDispatch();
    
    // Reset milestone tracking when a new game starts
    useEffect(() => {
        // If the game transitions to STARTING or WELCOME state, reset the milestone
        if (
            (prevStatus !== null && prevStatus !== gameStatus) && 
            (gameStatus === GameStatus.STARTING || gameStatus === GameStatus.WELCOME)
        ) {
            setLastMilestone(0);
            setShowVideo(false);
        }
        
        // Keep track if we were paused by the video
        if (gameStatus === GameStatus.PAUSED && !wasPaused && showVideo) {
            setWasPaused(true);
        }
        
        // Store the current status for the next comparison
        setPrevStatus(gameStatus);
    }, [gameStatus, prevStatus, wasPaused, showVideo]);
    
    useEffect(() => {
        // Check if the current score has crossed a milestone threshold
        const currentMilestone = Math.floor(score / MILESTONE_INTERVAL) * MILESTONE_INTERVAL;
        
        // If score has reached a new milestone (divisible by 50) and it's greater than 0
        if (
            running && 
            currentMilestone > 0 && 
            currentMilestone > lastMilestone && 
            score >= currentMilestone
        ) {
            setLastMilestone(currentMilestone);
            setShowVideo(true);
            
            // Pause the game when video appears
            dispatch(GameActions.pause());
        }
    }, [score, lastMilestone, running, dispatch]);
    
    const resetMilestone = () => {
        setShowVideo(false);
        setWasPaused(false);
        
        // Resume the game after the video closes
        // We use run instead of resume because resume sets the status to STARTING
        dispatch(GameActions.run());
    };
    
    return { showVideo, resetMilestone };
}; 