import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Order } from '../types';
import { useApp } from '../context/AppContext';
import { COLORS, SIZES, SPACING, BORDER_RADIUS } from '../constants/theme';
import { formatCurrency } from '../constants/pricing';
import { formatDistance } from '../utils/distance';

type RouteParams = {
  OrderDetails: {
    order: Order;
  };
};

export default function OrderDetailsScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute<RouteProp<RouteParams, 'OrderDetails'>>();
  const { order } = route.params;
  const { courier } = useApp();
  const [accepting, setAccepting] = useState(false);

  const handleAcceptOrder = async () => {
    // Check if courier has sufficient float
    if (!courier || courier.floatBalance < 200) {
      Alert.alert(
        'Insufficient Float',
        'You need to purchase float to accept orders. Would you like to buy float now?',
        [
          { text: 'Later', style: 'cancel' },
          {
            text: 'Buy Float',
            onPress: () => navigation.navigate('Wallet'),
          },
        ]
      );
      return;
    }

    setAccepting(true);

    // Simulate API call
    setTimeout(() => {
      setAccepting(false);
      Alert.alert(
        'Order Accepted!',
        'You have successfully accepted this order. Navigate to the pickup location.',
        [
          {
            text: 'View Map',
            onPress: () => navigation.navigate('DeliveryMap', { order }),
          },
        ]
      );
    }, 1000);
  };

  const handleCallCustomer = () => {
    Alert.alert('Call Customer', `Calling ${order.customerPhone}...`);
  };

  const handleCallStore = () => {
    Alert.alert('Call Store', `Calling ${order.storeName}...`);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.deliveryFeeCard}>
          <Text style={styles.deliveryFeeLabel}>Delivery Fee</Text>
          <Text style={styles.deliveryFeeAmount}>{formatCurrency(order.deliveryFee)}</Text>
          <Text style={styles.distanceText}>{formatDistance(order.distance)}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="storefront" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Pickup Location</Text>
          </View>
          <View style={styles.locationCard}>
            <Text style={styles.locationName}>{order.storeName}</Text>
            <Text style={styles.locationAddress}>{order.storeAddress}</Text>
            <TouchableOpacity style={styles.callButton} onPress={handleCallStore}>
              <Ionicons name="call" size={16} color={COLORS.primary} />
              <Text style={styles.callButtonText}>Call Store</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={24} color={COLORS.error} />
            <Text style={styles.sectionTitle}>Delivery Location</Text>
          </View>
          <View style={styles.locationCard}>
            <Text style={styles.locationName}>{order.customerName}</Text>
            <Text style={styles.locationAddress}>{order.deliveryAddress}</Text>
            <Text style={styles.locationPhone}>{order.customerPhone}</Text>
            <TouchableOpacity style={styles.callButton} onPress={handleCallCustomer}>
              <Ionicons name="call" size={16} color={COLORS.primary} />
              <Text style={styles.callButtonText}>Call Customer</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cart" size={24} color={COLORS.secondary} />
            <Text style={styles.sectionTitle}>Order Items</Text>
          </View>
          <View style={styles.itemsContainer}>
            {order.items.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalAmount}>{formatCurrency(order.totalAmount)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={24} color={COLORS.textLight} />
            <Text style={styles.sectionTitle}>Order Information</Text>
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Order ID</Text>
              <Text style={styles.infoValue}>{order.id}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Order Time</Text>
              <Text style={styles.infoValue}>
                {new Date(order.createdAt).toLocaleString()}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {order.status === 'pending' && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.acceptOrderButton, accepting && styles.acceptOrderButtonDisabled]}
            onPress={handleAcceptOrder}
            disabled={accepting}
          >
            <Ionicons name="checkmark-circle" size={24} color={COLORS.textWhite} />
            <Text style={styles.acceptOrderButtonText}>
              {accepting ? 'Accepting...' : 'Accept Order'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundGray,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.base,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  deliveryFeeCard: {
    backgroundColor: COLORS.primary,
    padding: SPACING.xl,
    alignItems: 'center',
    margin: SPACING.base,
    borderRadius: BORDER_RADIUS.lg,
  },
  deliveryFeeLabel: {
    fontSize: SIZES.base,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  deliveryFeeAmount: {
    fontSize: SIZES.header,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  distanceText: {
    fontSize: SIZES.base,
    color: COLORS.text,
  },
  section: {
    marginBottom: SPACING.base,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  locationCard: {
    backgroundColor: COLORS.background,
    padding: SPACING.base,
    marginHorizontal: SPACING.base,
    borderRadius: BORDER_RADIUS.md,
  },
  locationName: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  locationAddress: {
    fontSize: SIZES.base,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  locationPhone: {
    fontSize: SIZES.base,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  callButtonText: {
    fontSize: SIZES.base,
    color: COLORS.primary,
    marginLeft: SPACING.xs,
    fontWeight: '600',
  },
  itemsContainer: {
    backgroundColor: COLORS.background,
    marginHorizontal: SPACING.base,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.base,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: SIZES.base,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  itemQuantity: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
  },
  itemPrice: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: SPACING.md,
    marginTop: SPACING.sm,
  },
  totalLabel: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalAmount: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  infoContainer: {
    backgroundColor: COLORS.background,
    marginHorizontal: SPACING.base,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.base,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  infoLabel: {
    fontSize: SIZES.base,
    color: COLORS.textLight,
  },
  infoValue: {
    fontSize: SIZES.base,
    color: COLORS.text,
    fontWeight: '500',
  },
  statusBadge: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  statusText: {
    fontSize: SIZES.sm,
    fontWeight: 'bold',
    color: COLORS.textWhite,
  },
  footer: {
    padding: SPACING.base,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  acceptOrderButton: {
    backgroundColor: COLORS.success,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.base,
    borderRadius: BORDER_RADIUS.md,
  },
  acceptOrderButtonDisabled: {
    opacity: 0.6,
  },
  acceptOrderButtonText: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textWhite,
    marginLeft: SPACING.sm,
  },
});
