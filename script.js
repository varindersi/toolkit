// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Initialize theme from localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);

// Navigation
const navItems = document.querySelectorAll('.nav-item');
const toolSections = document.querySelectorAll('.tool-section');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const tool = item.getAttribute('data-tool');
        
        // Update active states
        navItems.forEach(nav => nav.classList.remove('active'));
        toolSections.forEach(section => section.classList.remove('active'));
        
        item.classList.add('active');
        document.getElementById(tool).classList.add('active');
    });
});

// Color Palette Generator
const paletteGrid = document.getElementById('paletteGrid');
const generatePaletteBtn = document.getElementById('generatePalette');
const exportPNGBtn = document.getElementById('exportPNG');
const exportJSONBtn = document.getElementById('exportJSON');

function generateRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

function rgbToHex(rgb) {
    const [r, g, b] = rgb.match(/\d+/g);
    return '#' + [r, g, b].map(x => {
        const hex = parseInt(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

function createColorCard(color) {
    const card = document.createElement('div');
    card.className = 'color-card';
    card.style.backgroundColor = color;
    
    const hex = rgbToHex(color);
    const info = document.createElement('div');
    info.className = 'color-info';
    info.textContent = hex;
    
    card.appendChild(info);
    return card;
}

function generatePalette() {
    paletteGrid.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const color = generateRandomColor();
        const card = createColorCard(color);
        paletteGrid.appendChild(card);
    }
}

generatePaletteBtn.addEventListener('click', generatePalette);

// Export as PNG
exportPNGBtn.addEventListener('click', async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const cards = document.querySelectorAll('.color-card');
    
    canvas.width = 500;
    canvas.height = 100;
    
    cards.forEach((card, index) => {
        const color = card.style.backgroundColor;
        ctx.fillStyle = color;
        ctx.fillRect(index * 100, 0, 100, 100);
        
        // Add hex code
        ctx.fillStyle = 'white';
        ctx.font = '12px Inter';
        ctx.fillText(card.querySelector('.color-info').textContent, index * 100 + 5, 90);
    });
    
    const link = document.createElement('a');
    link.download = 'color-palette.png';
    link.href = canvas.toDataURL();
    link.click();
});

// Export as JSON
exportJSONBtn.addEventListener('click', () => {
    const cards = document.querySelectorAll('.color-card');
    const palette = Array.from(cards).map(card => ({
        hex: card.querySelector('.color-info').textContent,
        rgb: card.style.backgroundColor
    }));
    
    const json = JSON.stringify(palette, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = 'color-palette.json';
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
});

// Initialize first palette
generatePalette();

// Clipboard functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show success message
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = 'Copied!';
        document.body.appendChild(tooltip);
        
        setTimeout(() => {
            tooltip.remove();
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Add click handlers to color cards
document.addEventListener('click', (e) => {
    if (e.target.closest('.color-card')) {
        const hex = e.target.closest('.color-card').querySelector('.color-info').textContent;
        copyToClipboard(hex);
    }
});

// Accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Hex to RGB Converter
const hexInput = document.getElementById('hexInput');
const rgbInput = document.getElementById('rgbInput');
const converterPreview = document.getElementById('converterPreview');
const copyConverterBtn = document.getElementById('copyConverter');

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function updateConverter() {
    const hex = hexInput.value;
    if (hex.length === 7 && /^#[0-9A-Fa-f]{6}$/.test(hex)) {
        const rgb = hexToRgb(hex);
        if (rgb) {
            rgbInput.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            converterPreview.style.backgroundColor = hex;
        }
    }
}

hexInput.addEventListener('input', updateConverter);
copyConverterBtn.addEventListener('click', () => copyToClipboard(rgbInput.value));

// Color Mixer
const color1 = document.getElementById('color1');
const color2 = document.getElementById('color2');
const color1Hex = document.getElementById('color1Hex');
const color2Hex = document.getElementById('color2Hex');
const mixedPreview = document.getElementById('mixedPreview');
const mixedInfo = document.getElementById('mixedInfo');
const copyMixedBtn = document.getElementById('copyMixed');

function mixColors(color1, color2) {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    return {
        r: Math.round((rgb1.r + rgb2.r) / 2),
        g: Math.round((rgb1.g + rgb2.g) / 2),
        b: Math.round((rgb1.b + rgb2.b) / 2)
    };
}

function updateMixer() {
    const mixed = mixColors(color1.value, color2.value);
    const hex = `#${mixed.r.toString(16).padStart(2, '0')}${mixed.g.toString(16).padStart(2, '0')}${mixed.b.toString(16).padStart(2, '0')}`;
    
    mixedPreview.style.backgroundColor = hex;
    mixedInfo.textContent = `Hex: ${hex} | RGB: rgb(${mixed.r}, ${mixed.g}, ${mixed.b})`;
}

color1.addEventListener('input', () => {
    color1Hex.value = color1.value;
    updateMixer();
});

color2.addEventListener('input', () => {
    color2Hex.value = color2.value;
    updateMixer();
});

color1Hex.addEventListener('input', () => {
    if (/^#[0-9A-Fa-f]{6}$/.test(color1Hex.value)) {
        color1.value = color1Hex.value;
        updateMixer();
    }
});

color2Hex.addEventListener('input', () => {
    if (/^#[0-9A-Fa-f]{6}$/.test(color2Hex.value)) {
        color2.value = color2Hex.value;
        updateMixer();
    }
});

copyMixedBtn.addEventListener('click', () => copyToClipboard(mixedInfo.textContent));

// Contrast Checker
const foreground = document.getElementById('foreground');
const background = document.getElementById('background');
const foregroundHex = document.getElementById('foregroundHex');
const backgroundHex = document.getElementById('backgroundHex');
const contrastPreview = document.getElementById('contrastPreview');
const contrastRatio = document.getElementById('contrastRatio');
const wcagCompliance = document.getElementById('wcagCompliance');

function getLuminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function calculateContrast(hex1, hex2) {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    
    const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
}

function updateContrast() {
    contrastPreview.style.color = foreground.value;
    contrastPreview.style.backgroundColor = background.value;
    
    const ratio = calculateContrast(foreground.value, background.value);
    const ratioText = ratio.toFixed(2);
    
    contrastRatio.textContent = `Contrast Ratio: ${ratioText}:1`;
    
    let compliance = [];
    if (ratio >= 7) {
        compliance.push('AAA (Large Text)');
        compliance.push('AAA (Normal Text)');
    } else if (ratio >= 4.5) {
        compliance.push('AA (Large Text)');
        compliance.push('AA (Normal Text)');
    } else if (ratio >= 3) {
        compliance.push('AA (Large Text)');
    }
    
    wcagCompliance.textContent = compliance.length ? 
        `WCAG Compliance: ${compliance.join(', ')}` : 
        'Does not meet WCAG standards';
}

foreground.addEventListener('input', () => {
    foregroundHex.value = foreground.value;
    updateContrast();
});

background.addEventListener('input', () => {
    backgroundHex.value = background.value;
    updateContrast();
});

// Shade Generator
const baseColor = document.getElementById('baseColor');
const baseColorHex = document.getElementById('baseColorHex');
const shadesGrid = document.getElementById('shadesGrid');
const generateShadesBtn = document.getElementById('generateShades');

function generateShades() {
    const base = hexToRgb(baseColor.value);
    shadesGrid.innerHTML = '';
    
    for (let i = -4; i <= 4; i++) {
        const factor = 1 + (i * 0.1);
        const shade = {
            r: Math.min(255, Math.max(0, Math.round(base.r * factor))),
            g: Math.min(255, Math.max(0, Math.round(base.g * factor))),
            b: Math.min(255, Math.max(0, Math.round(base.b * factor)))
        };
        
        const hex = `#${shade.r.toString(16).padStart(2, '0')}${shade.g.toString(16).padStart(2, '0')}${shade.b.toString(16).padStart(2, '0')}`;
        
        const card = document.createElement('div');
        card.className = 'shade-card';
        card.style.backgroundColor = hex;
        
        const info = document.createElement('div');
        info.className = 'color-info';
        info.textContent = hex;
        
        card.appendChild(info);
        shadesGrid.appendChild(card);
    }
}

baseColor.addEventListener('input', () => {
    baseColorHex.value = baseColor.value;
    generateShades();
});

generateShadesBtn.addEventListener('click', generateShades);

// Random Color Picker
const randomPreview = document.getElementById('randomPreview');
const randomInfo = document.getElementById('randomInfo');
const generateRandomBtn = document.getElementById('generateRandom');
const copyRandomBtn = document.getElementById('copyRandom');

function generateRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    
    randomPreview.style.backgroundColor = hex;
    randomInfo.textContent = `Hex: ${hex} | RGB: rgb(${r}, ${g}, ${b})`;
}

generateRandomBtn.addEventListener('click', generateRandomColor);
copyRandomBtn.addEventListener('click', () => copyToClipboard(randomInfo.textContent));

// Initialize tools
updateConverter();
updateMixer();
updateContrast();
generateShades();
generateRandomColor(); 