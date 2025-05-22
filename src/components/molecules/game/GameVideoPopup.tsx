import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GameSelectors } from '../../../store/game/game-selectors';
import { ClassNameProps } from '../../particles/particles.types';
import { UiDialog } from '../../particles/ui/UiDialog';
import { MILESTONE_INTERVAL } from '../../particles/hooks/useScoreMilestones';

export interface GameVideoPopupProps {
    onClose: () => void;
}

export const GameVideoPopup: FC<GameVideoPopupProps & ClassNameProps> = ({
    className,
    onClose
}) => {
    const [showVideo, setShowVideo] = useState(true);
    const score = useSelector(GameSelectors.score);
    const milestone = Math.floor(score / MILESTONE_INTERVAL) * MILESTONE_INTERVAL;
    
    // YouTube video embedding with specific parameters
    const videoUrl = "https://www.youtube.com/embed/G38Rxt7N-Og?autoplay=1&mute=0&controls=1&start=0&rel=0";

    useEffect(() => {
        // Auto-close the video after 10 seconds if the user doesn't close it manually
        const timer = setTimeout(() => {
            setShowVideo(false);
            onClose();
        }, 10000);

        return () => clearTimeout(timer);
    }, [onClose]);
    
    // Enable backdrop clicks to close the dialog
    const handleBackdropClick = () => {
        setShowVideo(false);
        onClose();
    };

    return (
        <UiDialog
            className="max-w-[640px]"
            title={`Score Milestone: ${milestone} Points!`}
            open={showVideo}
            onClose={handleBackdropClick}
        >
            <div className="flex flex-col items-center">
                <div className="mb-4 text-center">
                    Congratulations on reaching {milestone} points! Enjoy this video!
                </div>
                <iframe
                    width="560"
                    height="315"
                    src={videoUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </UiDialog>
    );
}; 