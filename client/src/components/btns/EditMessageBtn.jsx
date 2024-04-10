import { Edit } from '@mui/icons-material';

export const EditMessageBtn = ({ onClick }) => {
    return (
        <Edit sx={{ fontSize: 30, color:'#0092ca', cursor:'pointer' }} onClick={onClick}/>

    )
};