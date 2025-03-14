import LocaleUtils from './LocaleUtils.js'

/**
 * 颜色处理工具类
 */
export default class ColorUtils {
    /**
     * HEX转RGB
     */
    static hexToRgb(hex) {
        // 移除可能存在的#前缀
        hex = hex.replace('#', '');
        
        // 处理缩写形式 (例如 #FFF)
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }
        
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return { r, g, b };
    }

    /**
     * RGB转HEX
     */
    static rgbToHex(r, g, b) {
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }

    /**
     * RGB转CMYK
     */
    static rgbToCmyk(r, g, b) {
        let c = 1 - (r / 255);
        let m = 1 - (g / 255);
        let y = 1 - (b / 255);
        let k = Math.min(c, m, y);

        if (k === 1) {
            return { c: 0, m: 0, y: 0, k: 100 };
        }

        c = Math.round(((c - k) / (1 - k)) * 100);
        m = Math.round(((m - k) / (1 - k)) * 100);
        y = Math.round(((y - k) / (1 - k)) * 100);
        k = Math.round(k * 100);

        return { c, m, y, k };
    }

    /**
     * RGB转HSL
     */
    static rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    /**
    * RGB转HLV (色相、亮度、明度)
    */
    static rgbToHlv(r, g, b) {
        // 计算色相 (与HSL相同)
        const normalizedR = r / 255;
        const normalizedG = g / 255;
        const normalizedB = b / 255;

        const max = Math.max(normalizedR, normalizedG, normalizedB);
        const min = Math.min(normalizedR, normalizedG, normalizedB);
        let h = 0;

        if (max !== min) {
            const d = max - min;

            switch (max) {
                case normalizedR: h = (normalizedG - normalizedB) / d + (normalizedG < normalizedB ? 6 : 0); break;
                case normalizedG: h = (normalizedB - normalizedR) / d + 2; break;
                case normalizedB: h = (normalizedR - normalizedG) / d + 4; break;
            }

            h /= 6;
        }

        // 计算亮度 (Luminance) - 使用感知亮度公式
        const luminance = Math.round((0.299 * r + 0.587 * g + 0.114 * b) / 255 * 100);

        // 计算明度 (Value) - 取RGB中的最大值
        const value = Math.round(max * 100);

        return {
            h: Math.round(h * 360),
            l: luminance,
            v: value
        };
    }

    /**
     * 计算色温（简化版）
     */
    static calculateColorTemperature(r, g, b) {
        const ratio = r / (b || 1); // 避免除以0

        if (ratio > 1.5) {
            return Math.floor(2000 + ratio * 500); // 偏暖色
        } else if (ratio < 0.8) {
            return Math.floor(6500 + (1 - ratio) * 3000); // 偏冷色
        } else {
            return 6500; // 中性色温
        }
    }

    /**
     * 计算主波长（简化版）
     */
    static calculateDominantWavelength(r, g, b) {
        const max = Math.max(r, g, b);

        if (r === max) {
            return Math.floor(620 - (g / 255) * 40); // 红色区域: 580-620nm
        } else if (g === max) {
            return Math.floor(565 - (b / 255) * 65); // 绿色区域: 500-565nm
        } else {
            return Math.floor(450 + (r / 255) * 30); // 蓝色区域: 450-480nm
        }
    }

    /**
     * 获取颜色名称
     */
    static getColorName(r, g, b) {
        const hsl = this.rgbToHsl(r, g, b);
        const h = hsl.h; // 色相
        const s = hsl.s; // 饱和度
        const l = hsl.l; // 亮度

        // 灰度系列
        if (s < 10) {
            if (l < 15) return LocaleUtils.getText('colors.colorNames.black');
            if (l < 30) return LocaleUtils.getText('colors.colorNames.darkGray');
            if (l < 50) return LocaleUtils.getText('colors.colorNames.gray');
            if (l < 70) return LocaleUtils.getText('colors.colorNames.lightGray');
            if (l < 85) return LocaleUtils.getText('colors.colorNames.silver');
            return LocaleUtils.getText('colors.colorNames.white');
        }

        // 根据色相判断基本颜色
        if (h >= 0 && h < 15 || h >= 345 && h <= 360) {
            if (l < 20) return LocaleUtils.getText('colors.colorNames.darkRed');
            if (l < 40) return LocaleUtils.getText('colors.colorNames.red');
            if (l < 60) return LocaleUtils.getText('colors.colorNames.brightRed');
            return LocaleUtils.getText('colors.colorNames.lightRed');
        }

        if (h >= 15 && h < 40) {
            if (l < 30) return LocaleUtils.getText('colors.colorNames.brown');
            if (l < 50) return LocaleUtils.getText('colors.colorNames.orange');
            if (s > 80) return LocaleUtils.getText('colors.colorNames.gold');
            return LocaleUtils.getText('colors.colorNames.orangeYellow');
        }

        if (h >= 40 && h < 70) {
            if (l < 30) return LocaleUtils.getText('colors.colorNames.olive');
            if (l < 50) return LocaleUtils.getText('colors.colorNames.yellow');
            if (l < 70) return LocaleUtils.getText('colors.colorNames.brightYellow');
            return LocaleUtils.getText('colors.colorNames.lightYellow');
        }

        if (h >= 70 && h < 150) {
            if (l < 20) return LocaleUtils.getText('colors.colorNames.darkGreen');
            if (l < 40) return LocaleUtils.getText('colors.colorNames.green');
            if (h < 100) return LocaleUtils.getText('colors.colorNames.yellowGreen');
            if (h > 120) return LocaleUtils.getText('colors.colorNames.teal');
            return LocaleUtils.getText('colors.colorNames.brightGreen');
        }

        if (h >= 150 && h < 200) {
            if (l < 20) return LocaleUtils.getText('colors.colorNames.darkCyan');
            if (l < 40) return LocaleUtils.getText('colors.colorNames.cyan');
            if (l < 60) return LocaleUtils.getText('colors.colorNames.turquoise');
            return LocaleUtils.getText('colors.colorNames.lightCyan');
        }

        if (h >= 200 && h < 260) {
            if (l < 20) return LocaleUtils.getText('colors.colorNames.darkBlue');
            if (l < 40) return LocaleUtils.getText('colors.colorNames.blue');
            if (l < 60) return LocaleUtils.getText('colors.colorNames.skyBlue');
            return LocaleUtils.getText('colors.colorNames.lightBlue');
        }

        if (h >= 260 && h < 285) {
            if (l < 20) return LocaleUtils.getText('colors.colorNames.darkPurple');
            if (l < 40) return LocaleUtils.getText('colors.colorNames.purple');
            if (l < 60) return LocaleUtils.getText('colors.colorNames.brightPurple');
            return LocaleUtils.getText('colors.colorNames.lightPurple');
        }

        if (h >= 285 && h < 345) {
            if (l < 20) return LocaleUtils.getText('colors.colorNames.darkPink');
            if (l < 40) return LocaleUtils.getText('colors.colorNames.magenta');
            if (l < 60) return LocaleUtils.getText('colors.colorNames.pink');
            return LocaleUtils.getText('colors.colorNames.lightPink');
        }

        // 特殊颜色判断
        if (r > 150 && g > 100 && b > 50 && r > g && g > b) {
            if (l < 40) return LocaleUtils.getText('colors.colorNames.copper');
            return LocaleUtils.getText('colors.colorNames.bronze');
        }

        if (Math.abs(r - g) < 10 && Math.abs(g - b) < 10 && Math.abs(r - b) < 10) {
            return LocaleUtils.getText('colors.colorNames.neutralGray');
        }

        return LocaleUtils.getText('colors.colorNames.unknown');
    }

    /**
     * 计算色温指示器位置
     */
    static calculateTemperaturePosition(temperature) {
        if (!temperature) return 0;

        const minTemp = 2000;
        const maxTemp = 10000;

        let position = ((temperature - minTemp) / (maxTemp - minTemp)) * 100;
        position = Math.max(0, Math.min(100, position));

        return position;
    }

    /**
     * 计算波长指示器位置
     */
    static calculateWavelengthPosition(wavelength) {
        if (!wavelength) return 0;

        const minWavelength = 380;
        const maxWavelength = 780;

        let position = ((wavelength - minWavelength) / (maxWavelength - minWavelength)) * 100;
        position = Math.max(0, Math.min(100, position));

        return position;
    }

    /**
     * 获取色温渐变样式
     */
    static getTemperatureGradientStyle(r, g, b) {
        const warmColor = `rgb(${Math.min(r + 50, 255)}, ${Math.min(g + 30, 255)}, ${Math.max(b - 50, 0)})`;
        const coolColor = `rgb(${Math.max(r - 50, 0)}, ${Math.max(g - 20, 0)}, ${Math.min(b + 50, 255)})`;

        return {
            background: `linear-gradient(to right, ${warmColor}, #ffff00, #ffffff, ${coolColor})`
        };
    }

    /**
     * 获取波长渐变样式
     */
    static getWavelengthGradientStyle(hex, wavelength) {
        const position = this.calculateWavelengthPosition(wavelength);
        let gradientColors;

        if (position < 33) {
            // 偏紫蓝色区域
            gradientColors = `#9900ff, #0000ff, ${hex}, #00ff00, #ffff00, #ff0000`;
        } else if (position < 66) {
            // 偏绿黄色区域
            gradientColors = `#9900ff, #0000ff, #00ff00, ${hex}, #ffff00, #ff0000`;
        } else {
            // 偏红色区域
            gradientColors = `#9900ff, #0000ff, #00ff00, #ffff00, ${hex}, #ff0000`;
        }

        return {
            background: `linear-gradient(to right, ${gradientColors})`
        };
    }

    /**
     * 获取与背景色对比的文字颜色
     */
    static getContrastColor(r, g, b) {
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? '#000000' : '#ffffff';
    }

    /**
     * 获取与背景色对比的半透明背景色
     */
    static getContrastBackgroundColor(r, g, b) {
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)';
    }

    // 获取光阴效果的颜色
    static getGlowColor(r, g, b) {
        // 根据当前颜色生成一个对比色或互补色
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        if (luminance > 0.5) {
            // 对于亮色，使用稍微暗一点的同色系
            return `rgba(${Math.max(0, r - 50)}, ${Math.max(0, g - 50)}, ${Math.max(0, b - 50)}, 0.6)`;
        } else {
            // 对于暗色，使用稍微亮一点的同色系
            return `rgba(${Math.min(255, r + 50)}, ${Math.min(255, g + 50)}, ${Math.min(255, b + 50)}, 0.6)`;
        }
    }

    /**
     * HSL转RGB
     */
    static hslToRgb(h, s, l) {
        s /= 100;
        l /= 100;

        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c/2;
        let r = 0, g = 0, b = 0;

        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }

        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        return [r, g, b];
    }
}