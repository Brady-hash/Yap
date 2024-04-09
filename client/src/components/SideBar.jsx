import { useState } from "react";
import { Box, Drawer, Button } from "@mui/material";
import { Close } from "@mui/icons-material/";
import LogoutBtn from '../components/btns/LogoutBtn';
import MyProfileBtn from '../components/btns/MyProfileBtn';
import { SearchBtn } from "./btns/SearchBtn";
import { SearchForm } from "./forms/SearchForm";

export const SideBar = ({ sideBarToggled, onClose }) => {
    const [searchOpen, setSearchOpen] = useState(false)
    return (
        <Drawer
            variant="temporary"
            anchor="left"
            open= {sideBarToggled}
            onClose={onClose}
            sx={{
                width: 240, 
                flexShrink: 0, 
                '& .MuiDrawer-paper': {
                    width: '20%', 
                    boxSizing: 'border-box', 
                    border: 'solid white 2px', 
                    bgcolor: '#444'
                },
            }}
        >
            <Box sx={{ border: 'solid white 2px'}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
   
                        <Close                         
                            variant='outlined' 
                            sx={{
                                fontSize: 30, 
                                color: "white", 
                                margin: '10px',
                                alignItems: 'left',
                                cursor: 'pointer'
                            }}
                            onClick={onClose} />
                </Box>
                    < LogoutBtn />
                    < MyProfileBtn />
                    < SearchBtn setSearchOpen={setSearchOpen} searchOpen={searchOpen} />
                    {searchOpen && <SearchForm searchOpen={searchOpen} setSearchOpen={setSearchOpen}/>}

            </Box>


        </Drawer>
    )
}