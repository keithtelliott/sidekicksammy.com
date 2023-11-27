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
