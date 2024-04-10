import { useState } from "react";
import { SideBar } from '../SideBar';
import { Dehaze, Close } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';


export const SideBarBtn = () => {
    const [sideBarToggled, setSideBarToggled ] = useState(false)

    const toggleSideBar = () => {
        setSideBarToggled(!sideBarToggled);
    }
    
    return (
        <>
            <IconButton 
                onClick={toggleSideBar}
                sx={{ 
                    color: 'white', 
                    m: 1,
                    position: 'absolute',
                    right: 10,
                    top: 10,
                    transition: 'transform 0.3s ease',
                    transform: sideBarToggled ? 'rotate(180deg)' : 'rotate(0deg)',
                    zIndex: 1300,
                }}
            >
                {sideBarToggled ? <Close sx={{ fontSize: 40}}/> : <Dehaze sx={{ fontSize: 40}}/>}
            </IconButton>
            {sideBarToggled && <SideBar sideBarToggled={sideBarToggled} onClose={toggleSideBar}/>}
        </>
    )
};