import { FormControlLabel, Switch } from '@mui/material';
import { ModeNight, Brightness7 } from '@mui/icons-material';
import { useThemeContext } from '../../context/ThemeContext';

export const ToggleThemeBtn = ({ sx }) => {
    const { toggleTheme, theme, isDarkMode} = useThemeContext();
    return(
        <>
                        <FormControlLabel
                    control={
                        <Switch
                        disableRipple
                        checked={isDarkMode}
                        onChange={toggleTheme}
                        icon={<Brightness7 sx={{ color: 'yellow', transform: 'translateY(-6.5px) translateX(-5px)', fontSize: 35, boxShadow: 'none'}}/>}
                        checkedIcon={<ModeNight sx={{ color: '#bae8e8',transform: 'translateY(-6.5px) translateX(3px)', fontSize: 35 }}/>}
                        sx={{
                            ...sx,
                            height: '40px',
                            width: '70px',
                            '& .MuiSwitch-switchBase': {
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    boxShadow: 'none'
                                },
                                '&.Mui-checked:hover': {
                                    backgroundColor: 'transparent',
                                }
                                },
                                '& .MuiSwitch-track': {
                                    transition: 'none' 
                                }
                            }}
                        />
                    }
                    labelPlacement="start"
                />
        </>
    )
};