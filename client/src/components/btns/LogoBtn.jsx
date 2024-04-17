import { Avatar } from "@mui/material";
import logoSrc from '../../images/Yap-Logo.png'

export const LogoBtn = () => {
    return (
        <Avatar 
        src={logoSrc}
        sx={{
                height: '100px',
                width: '100px'
            }}
        />
    )
};