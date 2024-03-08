// This object will be used to override Chakra-UI theme defaults.
// See https://chakra-ui.com/docs/styled-system/theming/theme for theming options
import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    black: '#000000',
    gold: '#d79823',
    cream: '#ddcdab',
    darkBlue: '#38388e',
    lightCream: '#fff8e6',
  },
  fonts: {
    // KTE, 3/7/2024:  I'm not a fan of the fancy fonts, so I propose that we stick with the defaults.
    //  plus, Storybook was breaking when the fancy fonts were added to index.css
    // heading: '"Noka", normal',
    // body: '"Libre Caslon Condensed", serif',
  },
})

export default theme
