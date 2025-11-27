import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SIZES, SPACING, BORDER_RADIUS } from '../constants/theme';
import { formatCurrency, PRICING } from '../constants/pricing';
import { FloatPackage, PaymentMethod } from '../types';

export default function WalletScreen() {
  const { courier, updateFloatBalance } = useApp();
  const [selectedPackage, setSelectedPackage] = useState<FloatPackage | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'airtel',
      type: 'airtel_money',
      name: 'Airtel Money',
      icon: 'phone-portrait',
    },
    {
      id: 'tnm',
      type: 'tnm_mpamba',
      name: 'TNM Mpamba',
      icon: 'phone-portrait',
    },
    {
      id: 'card',
      type: 'card',
      name: 'Debit/Credit Card',
      icon: 'card',
    },
  ];

  const handleSelectPackage = (pkg: FloatPackage) => {
    setSelectedPackage(pkg);
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    if (!selectedPackage || !selectedPaymentMethod) return;

    if (
      (selectedPaymentMethod.type === 'airtel_money' ||
        selectedPaymentMethod.type === 'tnm_mpamba') &&
      !phoneNumber
    ) {
      Alert.alert('Error', 'Please enter your mobile money number');
      return;
    }

    // Validate phone number for Malawi
    if (
      (selectedPaymentMethod.type === 'airtel_money' ||
        selectedPaymentMethod.type === 'tnm_mpamba') &&
      !/^(088|099|085|084|087)\d{7}$/.test(phoneNumber)
    ) {
      Alert.alert('Error', 'Please enter a valid Malawi phone number');
      return;
    }

    // Simulate payment processing
    Alert.alert(
      'Processing Payment',
      `Initiating ${selectedPaymentMethod.name} payment of ${formatCurrency(selectedPackage.price)}...`,
      [
        {
          text: 'OK',
          onPress: async () => {
            // Simulate successful payment
            setTimeout(async () => {
              await updateFloatBalance(selectedPackage.amount);
              setShowPaymentModal(false);
              setSelectedPackage(null);
              setSelectedPaymentMethod(null);
              setPhoneNumber('');
              Alert.alert(
                'Success!',
                `Your float has been topped up with ${formatCurrency(selectedPackage.amount)}`
              );
            }, 1500);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Wallet</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Current Float Balance</Text>
          <Text style={styles.balanceAmount}>
            {formatCurrency(courier?.floatBalance || 0)}
          </Text>
          <Text style={styles.balanceSubtext}>
            Available for accepting deliveries
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Buy Float Packages</Text>
          <Text style={styles.sectionSubtitle}>
            Purchase float to start accepting and fulfilling orders
          </Text>

          <View style={styles.packagesContainer}>
            {PRICING.floatPackages.map((pkg) => (
              <TouchableOpacity
                key={pkg.id}
                style={[
                  styles.packageCard,
                  pkg.popular && styles.packageCardPopular,
                ]}
                onPress={() => handleSelectPackage(pkg)}
              >
                {pkg.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>POPULAR</Text>
                  </View>
                )}
                <View style={styles.packageHeader}>
                  <Text style={styles.packageAmount}>
                    {formatCurrency(pkg.amount)}
                  </Text>
                </View>
                <View style={styles.packageDetails}>
                  <View style={styles.packageDetail}>
                    <Ionicons name="bicycle" size={20} color={COLORS.textLight} />
                    <Text style={styles.packageDetailText}>
                      Up to {pkg.deliveries} deliveries
                    </Text>
                  </View>
                  <View style={styles.packageDetail}>
                    <Ionicons name="cash-outline" size={20} color={COLORS.textLight} />
                    <Text style={styles.packageDetailText}>
                      {formatCurrency(pkg.price)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[
                    styles.buyButton,
                    pkg.popular && styles.buyButtonPopular,
                  ]}
                  onPress={() => handleSelectPackage(pkg)}
                >
                  <Text
                    style={[
                      styles.buyButtonText,
                      pkg.popular && styles.buyButtonTextPopular,
                    ]}
                  >
                    Buy Now
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How Float Works</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Ionicons name="information-circle" size={24} color={COLORS.primary} />
              <Text style={styles.infoText}>
                Float is required to accept and fulfill delivery orders
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="trending-up" size={24} color={COLORS.success} />
              <Text style={styles.infoText}>
                Earn delivery fees for each completed delivery
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="sync" size={24} color={COLORS.secondary} />
              <Text style={styles.infoText}>
                Top up anytime using mobile money or card
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Payment Method</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {selectedPackage && (
              <View style={styles.paymentSummary}>
                <Text style={styles.paymentSummaryLabel}>Amount to Pay</Text>
                <Text style={styles.paymentSummaryAmount}>
                  {formatCurrency(selectedPackage.price)}
                </Text>
              </View>
            )}

            <View style={styles.paymentMethods}>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentMethodCard,
                    selectedPaymentMethod?.id === method.id &&
                      styles.paymentMethodCardActive,
                  ]}
                  onPress={() => setSelectedPaymentMethod(method)}
                >
                  <Ionicons
                    name={method.icon as any}
                    size={24}
                    color={
                      selectedPaymentMethod?.id === method.id
                        ? COLORS.primary
                        : COLORS.textLight
                    }
                  />
                  <Text
                    style={[
                      styles.paymentMethodText,
                      selectedPaymentMethod?.id === method.id &&
                        styles.paymentMethodTextActive,
                    ]}
                  >
                    {method.name}
                  </Text>
                  {selectedPaymentMethod?.id === method.id && (
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {selectedPaymentMethod &&
              (selectedPaymentMethod.type === 'airtel_money' ||
                selectedPaymentMethod.type === 'tnm_mpamba') && (
                <View style={styles.phoneInputContainer}>
                  <Text style={styles.inputLabel}>Mobile Money Number</Text>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="0881234567"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                  <Text style={styles.inputHint}>
                    You will receive a prompt on your phone to confirm payment
                  </Text>
                </View>
              )}

            <TouchableOpacity
              style={[
                styles.confirmButton,
                !selectedPaymentMethod && styles.confirmButtonDisabled,
              ]}
              onPress={handlePayment}
              disabled={!selectedPaymentMethod}
            >
              <Text style={styles.confirmButtonText}>Confirm Payment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundGray,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.base,
    paddingTop: SPACING.xxl,
  },
  headerTitle: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  scrollView: {
    flex: 1,
  },
  balanceCard: {
    backgroundColor: COLORS.secondary,
    padding: SPACING.xl,
    margin: SPACING.base,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: SIZES.base,
    color: COLORS.textWhite,
    marginBottom: SPACING.xs,
  },
  balanceAmount: {
    fontSize: SIZES.header * 1.2,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  balanceSubtext: {
    fontSize: SIZES.sm,
    color: COLORS.textWhite,
  },
  section: {
    padding: SPACING.base,
  },
  sectionTitle: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
    marginBottom: SPACING.base,
  },
  packagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.base,
  },
  packageCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.base,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  packageCardPopular: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFFBF0',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: SPACING.base,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  popularBadgeText: {
    fontSize: SIZES.xs,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  packageHeader: {
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  packageAmount: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  packageDetails: {
    marginBottom: SPACING.md,
  },
  packageDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  packageDetailText: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
  },
  buyButton: {
    backgroundColor: COLORS.secondary,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  buyButtonPopular: {
    backgroundColor: COLORS.primary,
  },
  buyButtonText: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.textWhite,
  },
  buyButtonTextPopular: {
    color: COLORS.text,
  },
  infoCard: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.base,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  infoText: {
    flex: 1,
    fontSize: SIZES.base,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  paymentSummary: {
    backgroundColor: COLORS.backgroundGray,
    padding: SPACING.base,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  paymentSummaryLabel: {
    fontSize: SIZES.base,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  paymentSummaryAmount: {
    fontSize: SIZES.title,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  paymentMethods: {
    marginBottom: SPACING.lg,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.base,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  paymentMethodCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFFBF0',
  },
  paymentMethodText: {
    flex: 1,
    fontSize: SIZES.base,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  paymentMethodTextActive: {
    fontWeight: '600',
  },
  phoneInputContainer: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  phoneInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: SIZES.base,
    marginBottom: SPACING.xs,
  },
  inputHint: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
  },
  confirmButton: {
    backgroundColor: COLORS.success,
    padding: SPACING.base,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textWhite,
  },
});
