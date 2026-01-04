// Global styles for Solo Leveling System App
import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing, touchTarget } from './theme';

export const globalStyles = StyleSheet.create({
    // Containers
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    centeredContainer: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Text styles
    headerText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xl,
        color: colors.text,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    subHeaderText: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.lg,
        color: colors.text,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    bodyText: {
        fontFamily: 'Rajdhani-Regular',
        fontSize: fontSizes.md,
        color: colors.text,
    },
    systemText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.md,
        color: colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    // System window styles
    systemWindow: {
        backgroundColor: colors.modalBackground,
        borderWidth: 1,
        borderColor: colors.primary,
        padding: spacing.lg,
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
        borderColor: colors.primary,
    },
    buttonText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.lg,
        color: colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: colors.modalBackground,
        borderWidth: 1,
        borderColor: colors.primary,
        padding: spacing.lg,
        width: '90%',
        maxHeight: '80%',
    },

    // List items
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.muted,
        minHeight: touchTarget.minHeight,
    },

    // Progress bars
    progressBarContainer: {
        height: 16,
        backgroundColor: colors.muted,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
    },

    // Divider
    divider: {
        height: 1,
        backgroundColor: colors.muted,
        marginVertical: spacing.md,
    },
});

export default globalStyles;
