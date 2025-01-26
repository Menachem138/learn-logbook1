import { StyleSheet } from 'react-native';
import { theme } from './index';

export const commonStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.heading2,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.medium,
  },
  buttonText: {
    color: theme.colors.surface.primary,
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  input: {
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.primary,
  },
  card: {
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadow.small,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
});
