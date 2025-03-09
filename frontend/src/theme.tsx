import { extendTheme, defineStyle, defineStyleConfig } from "@chakra-ui/react";

// Custom color mode styles
const customColors = {
  lightBackground: "#f0f4f8",
  darkBackground: "#1a202c",
};

// Define a custom style for the body
const bodyStyle = defineStyle({
  bg: customColors.lightBackground,
  color: "gray.800",
  _dark: {
    bg: customColors.darkBackground,
    color: "whiteAlpha.900",
  },
});

// Apply the custom body style to your theme
const customTheme = extendTheme({
  styles: {
    global: {
      body: bodyStyle,
    },
  },
});

export default customTheme;
