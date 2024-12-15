// theme.ts
import { extendTheme, ThemeConfig, withDefaultColorScheme, ChakraTheme } from "@chakra-ui/react"
import { ComponentStyleConfig } from '@chakra-ui/theme'

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
}

const Button: ComponentStyleConfig = {
  variants: {
    solid: (props) => ({
      bg: props.colorMode === 'dark' ? 'blue.400' : 'blue.500',
      color: 'white',
      _hover: {
        bg: props.colorMode === 'dark' ? 'blue.500' : 'blue.600',
      },
    }),
  },
}

const theme = extendTheme(
  {
    config,
    colors: {
      brand: {
        50: '#e6f2ff',
        100: '#b3d9ff',
        200: '#80bfff',
        300: '#4da6ff',
        400: '#1a8cff',
        500: '#0073e6',
        600: '#005cb3',
        700: '#004480',
        800: '#002d4d',
        900: '#00171a',
      },
    },
    components: {
      Button,
    },
  },
  withDefaultColorScheme({ colorScheme: 'brand' })
) as ChakraTheme

export default theme