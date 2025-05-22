import { FC } from 'react';
import { UsernameForm } from '../../molecules/app/UsernameForm';
import { UiDialog } from '../../particles/ui/UiDialog';

export interface UsernameDialogProps {
    open: boolean;
    onSubmit: (username: string) => void;
}

export const UsernameDialog: FC<UsernameDialogProps> = ({
    open,
    onSubmit
}) => {
    // Use UiDialog directly since we're not using Redux state for this dialog
    return (
        <UiDialog
            className="max-w-md"
            title="Welcome" 
            open={open}
            // No onClose provided to prevent closing
        >
            <UsernameForm onSubmit={onSubmit} />
        </UiDialog>
    );
}; 