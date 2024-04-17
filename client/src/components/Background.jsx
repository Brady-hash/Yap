import React, { useState, useEffect } from 'react';
import { useThemeContext } from '../context/ThemeContext';

const DynamicBackground = () => {
  const [angle, setAngle] = useState(0);
  const { isDarkMode, toggleTheme, theme } = useThemeContext();

  useEffect(() => {
    const interval = setInterval(() => {
      setAngle(prevAngle => (prevAngle + 1) % 360);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const gradientColors = theme.palette.mode === 'light' 
  ? ['#87CEEB', '#98FB98'] 
  : ['#004953', '#283593']; 

  const backgroundStyle = {
    background: `linear-gradient(${angle}deg, ${gradientColors[0]}, ${gradientColors[1]})`,
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0
  };

  return <div style={{...backgroundStyle, zIndex: 0}} />;
};

export default DynamicBackground;
