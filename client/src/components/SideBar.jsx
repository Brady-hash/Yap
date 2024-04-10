import { useState } from "react";
import { Box, Drawer, Button, Avatar } from "@mui/material";
import { Close } from "@mui/icons-material/";
import LogoutBtn from '../components/btns/LogoutBtn';
import MyProfileBtn from '../components/btns/MyProfileBtn';
import { SearchBtn } from "./btns/SearchBtn";
import { SearchForm } from "./forms/SearchForm";

export const SideBar = ({ sideBarToggled }) => {
    const [searchOpen, setSearchOpen] = useState(false)
    return (
        <Drawer
            variant="temporary"
            anchor="right"
            open= {sideBarToggled}
            sx={{
                width: 240, 
                flexShrink: 0, 
                '& .MuiDrawer-paper': {
                    width: '70%', 
                    boxSizing: 'border-box', 
                    border: 'solid #444 2px', 
                    bgcolor: '#333',
                },
            }}
        >
            <Box sx={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'}}>
            <Avatar 
                    src="/Yap-Logo.png"
                    sx={{
                    width: '45vw', 
                    height: '45vw',
                    maxWidth: 300, // Maximum size
                    maxHeight: 300, // Maximum size
                    minWidth: 60, // Minimum size
                    minHeight: 60, // Minimum size
                    margin: 'auto', // Center the Avatar in its container
                    marginTop: 10, // Adjust top margin
                }}
            />
                <Box sx={{ height: '45%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-evenly'}}>

                    < MyProfileBtn sx={{ bgcolor: '#222831', right: 10, '&:hover': { bgcolor: '#455d7a'}}}/>
                    < SearchBtn setSearchOpen={setSearchOpen} sx={{ bgcolor: '#222831', right: 10, '&:hover': { bgcolor: '#455d7a'}}} searchOpen={searchOpen}  />
                

                    < LogoutBtn sx={{ bgcolor: '#be3144', right: 10, '&:hover': { bgcolor: '#e84a5f' }}}/>
                    {searchOpen && <SearchForm searchOpen={searchOpen} setSearchOpen={setSearchOpen}/>}
                </Box>


            </Box>


        </Drawer>
    )
}