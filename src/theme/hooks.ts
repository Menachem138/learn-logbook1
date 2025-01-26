import { useWindowDimensions } from 'react-native';
import { theme } from './index';

export const useResponsiveFontSize = (size: number) => {
  const { width } = useWindowDimensions();
  const baseWidth = 375; // Base width (iPhone SE)
  const scaleFactor = width / baseWidth;
  return Math.round(size * scaleFactor);
};

export const useTheme = () => {
  return theme;
};
