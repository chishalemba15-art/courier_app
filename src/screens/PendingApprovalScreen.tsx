import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SIZES, SPACING } from '../constants/theme';

export default function PendingApprovalScreen() {
  const { courier, logout } = useApp();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="time-outline" size={80} color={COLORS.warning} />
        </View>

        <Text style={styles.title}>Application Under Review</Text>

        <Text style={styles.message}>
          Thank you for registering, {courier?.name}!
        </Text>

        <Text style={styles.description}>
          Your application is currently being reviewed by our team. This process typically takes
          24-48 hours.
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>What happens next?</Text>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
            <Text style={styles.infoText}>Our team reviews your documents</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
            <Text style={styles.infoText}>Background verification</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
            <Text style={styles.infoText}>You'll receive an email notification</Text>
          </View>
        </View>

        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>Application ID:</Text>
          <Text style={styles.statusValue}>{courier?.id}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: SIZES.title,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.base,
  },
  message: {
    fontSize: SIZES.lg,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.base,
  },
  description: {
    fontSize: SIZES.base,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  infoBox: {
    width: '100%',
    backgroundColor: COLORS.backgroundGray,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  infoTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  infoText: {
    fontSize: SIZES.base,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  statusBox: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.base,
    backgroundColor: COLORS.backgroundGray,
    borderRadius: 8,
    marginBottom: SPACING.xl,
  },
  statusLabel: {
    fontSize: SIZES.base,
    color: COLORS.textLight,
  },
  statusValue: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.text,
  },
  logoutButton: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  logoutButtonText: {
    fontSize: SIZES.base,
    color: COLORS.text,
  },
});
