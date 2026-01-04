// Theme configuration for Solo Leveling System App

export const colors = {
    // Primary colors
    voidBlack: '#050505',
    electricCyan: '#00EAFF',
    paleCyan: '#E0F7FA',
    alertRed: '#FF3333',
    gold: '#FFD700',
    dimmed: '#333333',

    // Semantic colors
    background: '#050505',
    primary: '#00EAFF',
    text: '#E0F7FA',
    danger: '#FF3333',
    success: '#00FF88',
    warning: '#FFD700',
    muted: '#333333',

    // Bars
    hpBar: '#FF3333',
    mpBar: '#00EAFF',
    xpBar: '#00FF88',

    // Translucent
    modalBackground: 'rgba(0, 0, 0, 0.9)',
    overlay: 'rgba(0, 0, 0, 0.7)',
};

export const fonts = {
    primary: 'Rajdhani',
    fallback: 'System',
};

export const fontWeights = {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
};

export const fontSizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 48,
    display: 64,
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const borderRadius = {
    none: 0,
    sm: 2,
    md: 4,
    lg: 8,
};

export const shadows = {
    glow: {
        shadowColor: '#00EAFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10,
    },
    glowRed: {
        shadowColor: '#FF3333',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10,
    },
    glowGold: {
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10,
    },
};

export const glowStyles = {
    cyan: `0 0 10px ${colors.electricCyan}`,
    red: `0 0 10px ${colors.alertRed}`,
    gold: `0 0 10px ${colors.gold}`,
};

// Touch target minimum size (accessibility)
export const touchTarget = {
    minHeight: 44,
    minWidth: 44,
};

export const theme = {
    colors,
    fonts,
    fontWeights,
    fontSizes,
    spacing,
    borderRadius,
    shadows,
    glowStyles,
    touchTarget,
};

export default theme;
