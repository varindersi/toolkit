// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
const navItems = document.querySelectorAll('.nav-item');
const toolSections = document.querySelectorAll('.tool-section');
const tooltip = document.getElementById('tooltip');

// Color Palette Generator
const paletteGrid = document.getElementById('paletteGrid');
const generatePaletteBtn = document.getElementById('generatePalette');
const exportPNGBtn = document.getElementById('exportPNG');
const exportJSONBtn = document.getElementById('exportJSON');

// Hex to RGB Converter
const hexInput = document.getElementById('hexInput');
const rgbInput = document.getElementById('rgbInput');
const hslInput = document.getElementById('hslInput');
const converterPreview = document.getElementById('converterPreview');
const copyConverterBtn = document.getElementById('copyConverter');

// Color Mixer
const color1Input = document.getElementById('color1');
const color2Input = document.getElementById('color2');
const color1Hex = document.getElementById('color1Hex');
const color2Hex = document.getElementById('color2Hex');
const mixedPreview = document.getElementById('mixedPreview');
const mixedInfo = document.getElementById('mixedInfo');
const copyMixedBtn = document.getElementById('copyMixed');

// Contrast Checker
const foreground = document.getElementById('foreground');
const background = document.getElementById('background');
const foregroundHex = document.getElementById('foregroundHex');
const backgroundHex = document.getElementById('backgroundHex');
const contrastPreview = document.getElementById('contrastPreview');
const contrastRatio = document.getElementById('contrastRatio');
const wcagCompliance = document.getElementById('wcagCompliance');

// Shade Generator
const baseColor = document.getElementById('baseColor');
const baseColorHex = document.getElementById('baseColorHex');
const shadesGrid = document.getElementById('shadesGrid');
const generateShadesBtn = document.getElementById('generateShades');

// Random Color Picker
const randomPreview = document.getElementById('randomPreview');
const randomInfo = document.getElementById('randomInfo');
const generateRandomBtn = document.getElementById('generateRandom');
const copyRandomBtn = document.getElementById('copyRandom');

// Color History
const colorHistory = [];
const MAX_HISTORY = 20;

// Color Blindness Simulator
const baseColorPreview = document.getElementById('baseColorPreview');
const simulationTypes = document.querySelectorAll('.simulation-type');
const mockupButton = document.querySelector('.mockup-button');
const mockupCard = document.querySelector('.mockup-card');
const textContrast = document.getElementById('textContrast');
const buttonContrast = document.getElementById('buttonContrast');

function updateThemeIcon(isDark) {
    themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme === 'dark');
});

// Initialize theme from localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme === 'dark');

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && 
        !sidebar.contains(e.target) && 
        !menuToggle.contains(e.target)) {
        sidebar.classList.remove('active');
    }
});

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const tool = item.getAttribute('data-tool');
        
        // Update active states
        navItems.forEach(nav => nav.classList.remove('active'));
        toolSections.forEach(section => section.classList.remove('active'));
        
        item.classList.add('active');
        document.getElementById(tool).classList.add('active');
        
        // Close sidebar on mobile after selection
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
        }
    });
});

function showTooltip(text, element) {
    const rect = element.getBoundingClientRect();
    tooltip.textContent = text;
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - 40}px`;
    tooltip.style.opacity = '1';
    
    setTimeout(() => {
        tooltip.style.opacity = '0';
    }, 2000);
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showTooltip('Copied!', event.target);
    } catch (err) {
        console.error('Failed to copy text: ', err);
        showTooltip('Failed to copy', event.target);
    }
}

// Color Palette Generator
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
    
    const lockBtn = document.createElement('button');
    lockBtn.className = 'lock-btn';
    lockBtn.innerHTML = '<i class="fas fa-lock"></i>';
    lockBtn.setAttribute('aria-label', 'Lock color');
    
    card.appendChild(info);
    card.appendChild(lockBtn);
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
    showTooltip('PNG exported!', exportPNGBtn);
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
    showTooltip('JSON exported!', exportJSONBtn);
});

// Initialize first palette
generatePalette();

// Add click handlers to color cards
document.addEventListener('click', (e) => {
    if (e.target.closest('.color-card')) {
        const card = e.target.closest('.color-card');
        const hex = card.querySelector('.color-info').textContent;
        copyToClipboard(hex);
    }
    
    if (e.target.closest('.lock-btn')) {
        const card = e.target.closest('.color-card');
        card.classList.toggle('locked');
        const icon = card.querySelector('.lock-btn i');
        icon.className = card.classList.contains('locked') ? 'fas fa-lock' : 'fas fa-lock-open';
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
function hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Handle 3-digit hex
    if (hex.length === 3) {
        hex = hex.split('').map(h => h + h).join('');
    }
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
}

function rgbToHsl(r, g, b) {
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

function updateConverter() {
    const hex = hexInput.value;
    const isValidHex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    
    if (isValidHex) {
        const rgb = hexToRgb(hex);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        rgbInput.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        hslInput.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        converterPreview.style.backgroundColor = hex;
        
        hexInput.classList.remove('error');
    } else {
        hexInput.classList.add('error');
    }
}

hexInput.addEventListener('input', (e) => {
    let value = e.target.value;
    if (value.startsWith('#')) {
        value = value.substring(1);
    }
    if (value.length <= 6) {
        hexInput.value = '#' + value.toUpperCase();
        updateConverter();
    }
});

// Initialize converter
updateConverter();

// Color Mixer
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
    const mixed = mixColors(color1Input.value, color2Input.value);
    const hex = `#${mixed.r.toString(16).padStart(2, '0')}${mixed.g.toString(16).padStart(2, '0')}${mixed.b.toString(16).padStart(2, '0')}`;
    
    mixedPreview.style.backgroundColor = hex;
    mixedInfo.textContent = `Hex: ${hex} | RGB: rgb(${mixed.r}, ${mixed.g}, ${mixed.b})`;
}

color1Input.addEventListener('input', () => {
    color1Hex.value = color1Input.value;
    updateMixer();
});

color2Input.addEventListener('input', () => {
    color2Hex.value = color2Input.value;
    updateMixer();
});

color1Hex.addEventListener('input', () => {
    if (/^#[0-9A-Fa-f]{6}$/.test(color1Hex.value)) {
        color1Input.value = color1Hex.value;
        updateMixer();
    }
});

color2Hex.addEventListener('input', () => {
    if (/^#[0-9A-Fa-f]{6}$/.test(color2Hex.value)) {
        color2Input.value = color2Hex.value;
        updateMixer();
    }
});

copyMixedBtn.addEventListener('click', () => copyToClipboard(mixedInfo.textContent));

// Contrast Checker
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

// Color Sharing System
function addToHistory(color, sourceTool) {
    colorHistory.unshift({
        color,
        sourceTool,
        timestamp: new Date().toISOString()
    });
    
    if (colorHistory.length > MAX_HISTORY) {
        colorHistory.pop();
    }
    
    // Update history UI if it exists
    updateHistoryUI();
}

function updateHistoryUI() {
    const historyContainer = document.getElementById('colorHistory');
    if (!historyContainer) return;
    
    historyContainer.innerHTML = colorHistory.map((item, index) => `
        <div class="history-item" data-index="${index}">
            <div class="color-preview" style="background-color: ${item.color}"></div>
            <div class="history-info">
                <div class="color-value">${item.color}</div>
                <div class="source-tool">From ${item.sourceTool}</div>
            </div>
            <button class="use-color-btn" onclick="useColorFromHistory(${index})">
                <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    `).join('');
}

function useColorFromHistory(index) {
    const color = colorHistory[index].color;
    const currentTool = document.querySelector('.tool-section.active').id;
    
    switch (currentTool) {
        case 'mixer':
            document.getElementById('color1').value = color;
            document.getElementById('color1Hex').value = color;
            updateMixer();
            break;
        case 'contrast':
            document.getElementById('foreground').value = color;
            document.getElementById('foregroundHex').value = color;
            updateContrast();
            break;
        case 'shades':
            document.getElementById('baseColor').value = color;
            document.getElementById('baseColorHex').value = color;
            generateShades();
            break;
        case 'palette':
            // Add color to palette
            const card = createColorCard(color);
            document.getElementById('paletteGrid').appendChild(card);
            break;
    }
}

// Dropdown functionality
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = toggle.closest('.dropdown');
        dropdown.classList.toggle('active');
    });
});

// Close dropdowns when clicking outside
document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown.active').forEach(dropdown => {
        dropdown.classList.remove('active');
    });
});

// Handle color sharing
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetTool = item.getAttribute('data-tool');
        const currentTool = document.querySelector('.tool-section.active').id;
        const currentColor = getCurrentColor(currentTool);
        
        if (currentColor) {
            // Switch to target tool
            document.querySelector(`.nav-item[data-tool="${targetTool}"]`).click();
            
            // Set color in target tool
            setTimeout(() => {
                setColorInTool(targetTool, currentColor);
                addToHistory(currentColor, currentTool);
            }, 100);
        }
    });
});

function getCurrentColor(toolId) {
    switch (toolId) {
        case 'converter':
            return document.getElementById('hexInput').value;
        case 'mixer':
            return document.getElementById('mixedPreview').style.backgroundColor;
        case 'contrast':
            return document.getElementById('foreground').value;
        case 'shades':
            return document.getElementById('baseColor').value;
        case 'random':
            return document.getElementById('randomPreview').style.backgroundColor;
        default:
            return null;
    }
}

function setColorInTool(toolId, color) {
    switch (toolId) {
        case 'mixer':
            document.getElementById('color1').value = color;
            document.getElementById('color1Hex').value = color;
            updateMixer();
            break;
        case 'contrast':
            document.getElementById('foreground').value = color;
            document.getElementById('foregroundHex').value = color;
            updateContrast();
            break;
        case 'shades':
            document.getElementById('baseColor').value = color;
            document.getElementById('baseColorHex').value = color;
            generateShades();
            break;
        case 'palette':
            const card = createColorCard(color);
            document.getElementById('paletteGrid').appendChild(card);
            break;
    }
}

// Color Blindness Simulator
function updateColorBlindnessSimulator() {
    const color = baseColor.value;
    baseColorHex.value = color;
    baseColorPreview.style.backgroundColor = color;
    
    // Update mockup colors
    mockupButton.style.backgroundColor = color;
    mockupCard.style.backgroundColor = color;
    
    // Calculate contrast ratios
    const textContrastRatio = calculateContrast(color, '#FFFFFF');
    const buttonContrastRatio = calculateContrast(color, '#000000');
    
    // Update contrast results
    textContrast.textContent = `${textContrastRatio.toFixed(1)}:1`;
    buttonContrast.textContent = `${buttonContrastRatio.toFixed(1)}:1`;
    
    // Update status indicators
    updateContrastStatus(textContrast, textContrastRatio, 'text');
    updateContrastStatus(buttonContrast, buttonContrastRatio, 'button');
    
    // Update WCAG compliance
    updateWCAGCompliance(textContrastRatio, buttonContrastRatio);
}

function updateContrastStatus(element, ratio, type) {
    const parent = element.closest('.result-item');
    const status = parent.querySelector('.result-status');
    
    let statusClass = 'error';
    let statusText = 'Fail';
    
    if (type === 'text') {
        if (ratio >= 7) {
            statusClass = 'success';
            statusText = 'AAA';
        } else if (ratio >= 4.5) {
            statusClass = 'success';
            statusText = 'AA';
        } else if (ratio >= 3) {
            statusClass = 'warning';
            statusText = 'Large Text Only';
        }
    } else if (type === 'button') {
        if (ratio >= 3) {
            statusClass = 'success';
            statusText = 'Pass';
        }
    }
    
    status.className = `result-status ${statusClass}`;
    status.textContent = statusText;
}

function updateWCAGCompliance(textRatio, buttonRatio) {
    const status = wcagCompliance.closest('.result-status');
    
    if (textRatio >= 7 && buttonRatio >= 3) {
        status.className = 'result-status success';
        status.textContent = 'AAA';
    } else if (textRatio >= 4.5 && buttonRatio >= 3) {
        status.className = 'result-status success';
        status.textContent = 'AA';
    } else {
        status.className = 'result-status warning';
        status.textContent = 'Partial';
    }
}

// Event Listeners
baseColor.addEventListener('input', updateColorBlindnessSimulator);
baseColorHex.addEventListener('input', () => {
    if (/^#[0-9A-Fa-f]{6}$/i.test(baseColorHex.value)) {
        baseColor.value = baseColorHex.value;
        updateColorBlindnessSimulator();
    }
});

simulationTypes.forEach(type => {
    type.addEventListener('click', () => {
        simulationTypes.forEach(t => t.classList.remove('active'));
        type.classList.add('active');
        
        const mockupPreview = document.querySelector('.mockup-preview');
        mockupPreview.setAttribute('data-type', type.getAttribute('data-type'));
    });
});

// Initialize simulator
updateColorBlindnessSimulator(); 
