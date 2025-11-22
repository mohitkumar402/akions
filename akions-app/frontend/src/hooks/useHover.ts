import { useState } from 'react';
import { Platform } from 'react-native';

export const useHover = () => {
  const [isHovered, setIsHovered] = useState(false);

  const hoverProps = Platform.OS === 'web' ? {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  } : {};

  return { isHovered, hoverProps };
};






