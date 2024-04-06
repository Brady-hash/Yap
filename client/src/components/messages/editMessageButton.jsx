import { Button } from '@mui/material';
import { Edit } from '@mui/icons-material';

export const EditMessageButton = ({ onClick }) => {
    return (
        <Button sx={{ p: 0 }} onClick={onClick}><Edit sx={{ fontSize: 30 }}/></Button>
    )
};