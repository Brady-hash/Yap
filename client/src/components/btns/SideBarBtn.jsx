import { useState } from "react";
import { SideBar } from '../SideBar';
import { Dehaze } from  '@mui/icons-material';

export const SideBarBtn = () => {
    const [sideBarToggled, setSideBarToggled ] = useState(false)

    const toggleSideBar = () => {
        setSideBarToggled(!sideBarToggled);
    }
    
    return (
        <>
            <Dehaze 
            onClick={toggleSideBar}
            sx={{ 
                color: "white",
                fontSize: 30,
                margin: "5px",
                cursor: "pointer"
                }} 
            />
            {sideBarToggled && <SideBar sideBarToggled={sideBarToggled} onClose={toggleSideBar}/>}
        </>
    )
};