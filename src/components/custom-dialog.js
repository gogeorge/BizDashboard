import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';


export const CustomDialog = ({open, title, desc, btnText, close}) => {

    return (
        <Dialog
            open={open}
            onClose={() => close}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
            {title}
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {desc}
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={() => close} color='secondary'>Cancel</Button>
            <Button onClick={() => {
                setOpen(false)
                reload()
            }} autoFocus>
                {btnText}
            </Button>
            </DialogActions>
        </Dialog>
    )
}

