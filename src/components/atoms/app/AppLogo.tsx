import classNames from 'classnames';
import {FC, useEffect, useState} from 'react';
import {useLetters} from '../../particles/hooks/useLetters';
import {ClassNameProps} from '../../particles/particles.types';

export interface AppLogoProps {
    name: string;
    speed?: number;
}

export const AppLogo: FC<AppLogoProps & ClassNameProps> = ({
    name,
    speed = 200,
    className
}) => {
    const [letters, colors] = useLetters(name, speed);
    const [welcomeLetters, setWelcomeLetters] = useState<Array<{key: string; char: string}>>([]);
    const [welcomeColors, setWelcomeColors] = useState<Record<string, string>>({});

    useEffect(() => {
        const welcomeText = "welcome to";
        const colorClasses = [
            'text-blue-500', 'text-green-500', 'text-purple-500', 
            'text-red-500', 'text-yellow-500', 'text-orange-500',
            'text-cyan-500', 'text-pink-500'
        ];
        
        // Initialize welcome letters with animations
        const welcomeResult: Array<{key: string; char: string}> = [];
        const welcomeColorMap: Record<string, string> = {};
        
        const delay = 100; // Slightly faster than the main title
        
        // Function to animate in individual welcome letters
        const animateWelcomeLetters = (index = 0) => {
            if (index >= welcomeText.length) return;
            
            const key = `welcome-${index}`;
            const char = welcomeText[index];
            welcomeResult.push({ key, char });
            
            // Assign a random color from our color classes
            const colorIndex = Math.floor(Math.random() * colorClasses.length);
            welcomeColorMap[key] = colorClasses[colorIndex];
            
            setWelcomeLetters([...welcomeResult]);
            setWelcomeColors({...welcomeColorMap});
            
            // Schedule the next letter
            setTimeout(() => animateWelcomeLetters(index + 1), delay);
        };
        
        // Start the welcome text animation
        setTimeout(() => animateWelcomeLetters(), 500);
    }, []);

    return (
        <div
            data-testid="app-logo"
            className={classNames('flex flex-col items-center', className)}
        >
            <div className="font-mono text-2xl mb-2 h-8 flex">
                {welcomeLetters.map(({key, char}) => (
                    <div
                        key={key}
                        className={`${welcomeColors[key]} transition-all duration-300 animate-bounce-once`}
                    >
                        {char === ' ' ? <span>&nbsp;</span> : char}
                    </div>
                ))}
            </div>
            <div className="flex text-4xl font-logo font-bold">
                {letters.map(({key, char}) => (
                    <div
                        data-testid={`app-logo-${key}`}
                        className={`${colors[key]} transition-all duration-300 animate-bounce-once`}
                        key={key}
                    >
                        {char}
                    </div>
                ))}
            </div>
        </div>
    );
};
