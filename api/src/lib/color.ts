export let generateHexColor = () => {
  let randomColor = Math.floor(Math.random() * 16777215).toString(16);

  // sometimes this is returning a 4 digit hex, we need to make sure it's 6
  if (randomColor.length < 6) {
    randomColor = randomColor + '0'.repeat(6 - randomColor.length);
  }
  return `#${randomColor}`;
}
export let getLuminance = (r: string, g: string, b: string) => {
  // convert rgb's to numbers
  let rn = Number(r);
  let gn = Number(g);
  let bn = Number(b);

  let a = [rn, gn, bn].map(function (v) {
    v /= 255;
    return (v <= 0.03928)
      ? v / 12.92
      : Math.pow(((v + 0.055) / 1.055), 2.4);
  });
  return Number((a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722).toFixed(3));
}
export let getContrast = (rgb1: string, rgb2: string) => {
  let [r1, g1, b1] = rgb1.replace(/[^\d,]/g, '').split(',')
  let [r2, g2, b2] = rgb2.replace(/[^\d,]/g, '').split(',')
  let lum1 = getLuminance(r1, g1, b1);
  let lum2 = getLuminance(r2, g2, b2);
  let brightest = Math.max(lum1, lum2);
  let darkest = Math.min(lum1, lum2);
  return (brightest + 0.05)
    / (darkest + 0.05);
}
export let passesContrastCheck = (color1: string, color2: string) => {
  let contrast = getContrast(color1, color2);
  if (contrast > 4.5) {
    return true;
  }
  return false;
}
export let convertColorToRgb = (color: string) => {
  let returnColor = '';
  let isHex = color.match(/^#([0-9a-f]{3}){1,2}$/i);
  let isRgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  let isRgba = color.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)$/);
  let isHsl = color.match(/^hsl\((\d+),\s*(\d+),\s*(\d+)\)$/);
  let isHsla = color.match(/^hsla\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)$/);
  if (isHex) {
    // convert the hex to rgb
    let hex = color.substring(1);
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    returnColor = `rgb(${r}, ${g}, ${b})`;
  }
  if (isRgb) {
    returnColor = color;
  }
  if (isRgba) {
    // convert to rgb
    let r = isRgba[1];
    let g = isRgba[2];
    let b = isRgba[3];
    returnColor = `rgb(${r}, ${g}, ${b})`;
  }
  if (isHsl) {
    // convert to rgb
    let h = isHsl[1];
    let s = isHsl[2];
    let l = isHsl[3];
    returnColor = `rgb(${h}, ${s}, ${l})`;
  }
  if (isHsla) {
    // convert to rgb
    let h = isHsla[1];
    let s = isHsla[2];
    let l = isHsla[3];
    returnColor = `rgb(${h}, ${s}, ${l})`;
  }
  if (!isHex && !isRgb && !isRgba && !isHsl && !isHsla) {
    // return the color
    returnColor = color;
  }
  return returnColor;
}
export let inverseColor = (color: string) => {
  // color can be hex, rgb, rgba, hsl, hsla, or named color.level
  // in all cases we want to convert the color to rgb
  let returnColor = '';
  let isNamedColor = color.match(/^[a-z]+$/i);
  if (!isNamedColor) {
    returnColor = convertColorToRgb(color);
    // now invert the rgb
    let [r, g, b] = returnColor.replace(/[^\d,]/g, '').split(',')
    let rn = 255 - Number(r);
    let gn = 255 - Number(g);
    let bn = 255 - Number(b);
    returnColor = `rgb(${rn}, ${gn}, ${bn})`;

  }
  if (isNamedColor) {

    // named color is different, we're just going to flip the color
    // if the color is black, we'll return white
    // if the color is white, we'll return black
    // if the color is red, we'll return cyan
    // etc;
    // oclor is either 'red', or 'red.100', or 'red.200', etc
    let namedColor = color;
    if (namedColor.indexOf('.') > -1) {
      namedColor = namedColor.split('.')[0];
    }
    // if the color doesn't exist, we'll just return the current color
    let colorMap: any = {
      'black': 'white',
      'white': 'black',
      'red': 'cyan',
      'cyan': 'red',
      'blue': 'yellow',
      'yellow': 'blue',
      'magenta': 'green',
      'green': 'magenta',
    };
    let inverseNamedColor = colorMap[namedColor];
    if (inverseNamedColor) {
      returnColor = inverseNamedColor;
    } else {
      returnColor = color;
    }
  }
  return returnColor;
}
export let convertColorToHex = (color: string) => {
  // if thing is
  let isHex = color.match(/^#([0-9a-f]{3}){1,2}$/i);
  let isRgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  let isRgba = color.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)$/);
  let isHsl = color.match(/^hsl\((\d+),\s*(\d+),\s*(\d+)\)$/);
  let isHsla = color.match(/^hsla\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)$/);
  let isNamedColorLevel = color.match(/^[a-z]+\.\d+$/i);
  if(isHex) return color;
  if(isRgb) {
    let [r, g, b] = color.replace(/[^\d,]/g, '').split(',')
    let rn = parseInt(r).toString(16);
    let gn = parseInt(g).toString(16);
    let bn = parseInt(b).toString(16);
    return `#${rn}${gn}${bn}`;
  }
  if(isRgba) {
    let [r, g, b] = color.replace(/[^\d,]/g, '').split(',')
    let rn = parseInt(r).toString(16);
    let gn = parseInt(g).toString(16);
    let bn = parseInt(b).toString(16);
    return `#${rn}${gn}${bn}`;
  }
  if(isHsl) {
    let [h, s, l] = color.replace(/[^\d,]/g, '').split(',')
    let rn = parseInt(h).toString(16);
    let gn = parseInt(s).toString(16);
    let bn = parseInt(l).toString(16);
    return `#${rn}${gn}${bn}`;
  }
  if(isHsla) {
    let [h, s, l] = color.replace(/[^\d,]/g, '').split(',')
    let rn = parseInt(h).toString(16);
    let gn = parseInt(s).toString(16);
    let bn = parseInt(l).toString(16);
    return `#${rn}${gn}${bn}`;
  }
  if(isNamedColorLevel) {
    let [colorName, level] = color.split('.');
    let colorLevel = Number(level);
    let colorMap = {
      gray: {
        50: "#F7FAFC",
        100: "#EDF2F7",
        200: "#E2E8F0",
        300: "#CBD5E0",
        400: "#A0AEC0",
        500: "#718096",
        600: "#4A5568",
        700: "#2D3748",
        800: "#1A202C",
        900: "#171923",
      },

      red: {
        50: "#FFF5F5",
        100: "#FED7D7",
        200: "#FEB2B2",
        300: "#FC8181",
        400: "#F56565",
        500: "#E53E3E",
        600: "#C53030",
        700: "#9B2C2C",
        800: "#822727",
        900: "#63171B",
      },

      orange: {
        50: "#FFFAF0",
        100: "#FEEBC8",
        200: "#FBD38D",
        300: "#F6AD55",
        400: "#ED8936",
        500: "#DD6B20",
        600: "#C05621",
        700: "#9C4221",
        800: "#7B341E",
        900: "#652B19",
      },

      yellow: {
        50: "#FFFFF0",
        100: "#FEFCBF",
        200: "#FAF089",
        300: "#F6E05E",
        400: "#ECC94B",
        500: "#D69E2E",
        600: "#B7791F",
        700: "#975A16",
        800: "#744210",
        900: "#5F370E",
      },

      green: {
        50: "#F0FFF4",
        100: "#C6F6D5",
        200: "#9AE6B4",
        300: "#68D391",
        400: "#48BB78",
        500: "#38A169",
        600: "#2F855A",
        700: "#276749",
        800: "#22543D",
        900: "#1C4532",
      },

      teal: {
        50: "#E6FFFA",
        100: "#B2F5EA",
        200: "#81E6D9",
        300: "#4FD1C5",
        400: "#38B2AC",
        500: "#319795",
        600: "#2C7A7B",
        700: "#285E61",
        800: "#234E52",
        900: "#1D4044",
      },

      blue: {
        50: "#ebf8ff",
        100: "#bee3f8",
        200: "#90cdf4",
        300: "#63b3ed",
        400: "#4299e1",
        500: "#3182ce",
        600: "#2b6cb0",
        700: "#2c5282",
        800: "#2a4365",
        900: "#1A365D",
      },

      cyan: {
        50: "#EDFDFD",
        100: "#C4F1F9",
        200: "#9DECF9",
        300: "#76E4F7",
        400: "#0BC5EA",
        500: "#00B5D8",
        600: "#00A3C4",
        700: "#0987A0",
        800: "#086F83",
        900: "#065666",
      },

      purple: {
        50: "#FAF5FF",
        100: "#E9D8FD",
        200: "#D6BCFA",
        300: "#B794F4",
        400: "#9F7AEA",
        500: "#805AD5",
        600: "#6B46C1",
        700: "#553C9A",
        800: "#44337A",
        900: "#322659",
      },

      pink: {
        50: "#FFF5F7",
        100: "#FED7E2",
        200: "#FBB6CE",
        300: "#F687B3",
        400: "#ED64A6",
        500: "#D53F8C",
        600: "#B83280",
        700: "#97266D",
        800: "#702459",
        900: "#521B41",
      },
    }
    let hex = colorMap[colorName][colorLevel];
    if(!hex) return '#000000'
    return hex;
  }
  return color;
}
