// Global styles for Solo Leveling System App
import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing, touchTarget, glowShadow } from './theme';

export const globalStyles = StyleSheet.create({
    // Containers
    container: {
        flex: 1,
        backgroundColor: colors.voidBlack,
    },
    centeredContainer: {
        flex: 1,
        backgroundColor: colors.voidBlack,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Text styles
    headerText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xl,
        color: colors.paleCyan,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    subHeaderText: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.lg,
        color: colors.paleCyan,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    bodyText: {
        fontFamily: 'Rajdhani-Regular',
        fontSize: fontSizes.md,
        color: colors.paleCyan,
    },
    systemText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.md,
        color: colors.electricCyan,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    // System window styles
    systemWindow: {
        backgroundColor: colors.voidBlack,
        borderWidth: 1,
        borderColor: colors.electricCyan,
        padding: spacing.lg,
        ...glowShadow.cyan,
    },

    // Button base
    buttonBase: {
        minHeight: touchTarget.minHeight,
        minWidth: touchTarget.minWidth,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderWidth: 1,
        borderColor: colors.electricCyan,
    },
    buttonText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.lg,
        color: colors.electricCyan,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(2, 2, 10, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: colors.voidBlack,
        borderWidth: 1,
        borderColor: colors.electricCyan,
        padding: spacing.lg,
        width: '90%',
        maxHeight: '80%',
        ...glowShadow.cyan,
    },

    // List items
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.dimmed,
        minHeight: touchTarget.minHeight,
    },

    // Progress bars
    progressBarContainer: {
        height: 16,
        backgroundColor: colors.dimmed,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
    },

    // Divider
    divider: {
        height: 1,
        backgroundColor: colors.dimmed,
        marginVertical: spacing.md,
    },
});

export default globalStyles;
