import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

export const Confirm = ({ action, confirmOpen, setConfirmOpen, actionFunction }) => {

    const handleConfirmAction = () => {
        actionFunction();
        setConfirmOpen(false);
    }
    
    return (
        <>
        <Dialog 
            open={confirmOpen}
        >
            <DialogTitle>{action}?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to {action}?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                <Button 
                    autoFocus
                    onClick={handleConfirmAction}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
        </>
    )
};