import { Button } from '@mui/material';
import { Edit } from '@mui/icons-material';

export const EditMessageBtn = ({ onClick }) => {
    return (
        <Edit sx={{ fontSize: 30, color:'#0092ca', cursor:'pointer' }} onClick={onClick}/>

        // <Button sx={{ p: 0, margin: 0}} onClick={onClick}><Edit sx={{ fontSize: 30 }}/></Button>
    )
};