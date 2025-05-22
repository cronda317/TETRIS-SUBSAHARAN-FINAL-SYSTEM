import { FC, useState } from 'react';
import { ClassNameProps } from '../../particles/particles.types';
import { UiButton } from '../../particles/ui/UiButton';

export interface UsernameFormProps {
    onSubmit: (username: string) => void;
}

export const UsernameForm: FC<UsernameFormProps & ClassNameProps> = ({
    className,
    onSubmit
}) => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate username
        if (!username.trim()) {
            setError('Please enter a username');
            return;
        }
        
        if (username.length < 3) {
            setError('Username must be at least 3 characters');
            return;
        }
        
        // Clear any errors and submit
        setError(null);
        onSubmit(username);
    };

    return (
        <div className={`flex flex-col items-center p-6 ${className || ''}`}>
            <h2 className="text-xl mb-4 font-medium text-primary">Enter Your Username</h2>
            <p className="text-sm mb-6 text-center">
                Please enter a username before starting the game.
            </p>
            
            <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your username"
                    className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                              bg-white dark:bg-gray-800 mb-4 focus:outline-none 
                              focus:ring-2 focus:ring-blue-300 dark:focus:ring-yellow-400"
                    maxLength={15}
                />
                
                {error && (
                    <div className="text-red-500 dark:text-red-400 text-sm mb-4">
                        {error}
                    </div>
                )}
                
                <UiButton 
                    type="submit" 
                    className="px-6 py-2 mt-2"
                    primary
                >
                    Continue
                </UiButton>
            </form>
        </div>
    );
}; 