// Utility to generate random hex color
export const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  
  // Utility to calculate the luminance of a color
  export const getLuminance = (hex) => {
    const rgb = hex
      .replace('#', '')
      .match(/.{2}/g)
      .map((x) => parseInt(x, 16) / 255);
  
    const [r, g, b] = rgb.map((v) =>
      v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    );
  
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  // Utility to ensure contrasting colors
  export const getContrastingColor = (bgColor) => {
    let textColor;
    do {
      textColor = getRandomColor();
    } while (Math.abs(getLuminance(bgColor) - getLuminance(textColor)) < 0.5);
    return textColor;
  };
  