// Solo Leveling "System" Theme
// Exact color palette and style presets from the anime/manhwa

export const colors = {
    // Core colors
    voidBlack: '#02020A',
    deepBlue: '#0A0A1A',
    electricCyan: '#00EAFF',
    paleCyan: '#E0F7FA',

    // Accent colors  
    alertRed: '#FF3333',
    gold: '#FFD700',

    // UI colors
    dimmed: '#4A5568',
    darkPanel: 'rgba(0, 234, 255, 0.05)',
    glowOverlay: 'rgba(0, 234, 255, 0.1)',
};

export const fontSizes = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 18,
    xl: 22,
    xxl: 28,
    xxxl: 36,
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
};

// Glow shadow presets for the Solo Leveling style
export const glowShadow = {
    cyan: {
        shadowColor: colors.electricCyan,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 15,
        elevation: 10,
    },
    cyanIntense: {
        shadowColor: colors.electricCyan,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 25,
        elevation: 15,
    },
    red: {
        shadowColor: colors.alertRed,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 15,
        elevation: 10,
    },
    gold: {
        shadowColor: colors.gold,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        elevation: 8,
    },
};

// Touch target sizes for accessibility
export const touchTarget = {
    minHeight: 44,
    minWidth: 44,
};

export default {
    colors,
    fontSizes,
    spacing,
    glowShadow,
    touchTarget,
};
