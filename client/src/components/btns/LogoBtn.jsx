import { Avatar } from "@mui/material";
import logoSrc from '../../images/Yap-Logo.png'

export const LogoBtn = () => {
    return (
        <Avatar 
        src={logoSrc}
        sx={{
                p:0,
                height: '80px',
                width: '80px'
            }}
        />
    )
};