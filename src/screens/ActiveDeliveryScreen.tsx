import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useApp } from '../context/AppContext';
import { COLORS, SIZES, SPACING, BORDER_RADIUS } from '../constants/theme';
import { formatCurrency } from '../constants/pricing';
import { formatDistance } from '../utils/distance';
import { Order } from '../types';

type NavigationProp = StackNavigationProp<any>;

export default function ActiveDeliveryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { orders } = useApp();

  const activeOrders = orders.filter(
    (order) =>
      order.status === 'accepted' ||
      order.status === 'picked_up' ||
      order.status === 'in_transit'
  );

  const renderActiveOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('DeliveryMap', { order: item })}
    >
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>{item.status.replace('_', ' ').toUpperCase()}</Text>
      </View>

      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item.id}</Text>
        <Text style={styles.deliveryFee}>{formatCurrency(item.deliveryFee)}</Text>
      </View>

      <View style={styles.locationContainer}>
        <View style={styles.locationRow}>
          <View style={styles.locationDot} style={{ backgroundColor: COLORS.success }} />
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Pickup</Text>
            <Text style={styles.locationText}>{item.storeName}</Text>
          </View>
        </View>

        <View style={styles.locationConnector} />

        <View style={styles.locationRow}>
          <View style={styles.locationDot} style={{ backgroundColor: COLORS.error }} />
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Delivery</Text>
            <Text style={styles.locationText}>{item.customerName}</Text>
          </View>
        </View>
      </View>

      <View style={styles.orderFooter}>
        <View style={styles.distanceContainer}>
          <Ionicons name="navigate" size={16} color={COLORS.textLight} />
          <Text style={styles.distanceText}>{formatDistance(item.distance)}</Text>
        </View>
        <TouchableOpacity style={styles.navigateButton}>
          <Text style={styles.navigateButtonText}>Navigate</Text>
          <Ionicons name="arrow-forward" size={16} color={COLORS.textWhite} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Active Deliveries</Text>
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>{activeOrders.length}</Text>
        </View>
      </View>

      <FlatList
        data={activeOrders}
        renderItem={renderActiveOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="bicycle-outline" size={80} color={COLORS.textLight} />
            <Text style={styles.emptyText}>No Active Deliveries</Text>
            <Text style={styles.emptySubtext}>
              Accept orders from the Orders tab to start delivering
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => navigation.navigate('Orders')}
            >
              <Text style={styles.browseButtonText}>Browse Orders</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  counterBadge: {
    backgroundColor: COLORS.secondary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    color: COLORS.textWhite,
    fontWeight: 'bold',
    fontSize: SIZES.base,
  },
  listContainer: {
    padding: SPACING.base,
  },
  orderCard: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.warning,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  statusText: {
    fontSize: SIZES.xs,
    fontWeight: 'bold',
    color: COLORS.textWhite,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  orderId: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  deliveryFee: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  locationContainer: {
    marginBottom: SPACING.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.sm,
    marginTop: 4,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  locationText: {
    fontSize: SIZES.base,
    color: COLORS.text,
    fontWeight: '500',
  },
  locationConnector: {
    width: 2,
    height: 20,
    backgroundColor: COLORS.border,
    marginLeft: 5,
    marginVertical: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  navigateButtonText: {
    color: COLORS.textWhite,
    fontWeight: '600',
    marginRight: SPACING.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SPACING.xxl * 3,
    paddingHorizontal: SPACING.xl,
  },
  emptyText: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginTop: SPACING.lg,
  },
  emptySubtext: {
    fontSize: SIZES.base,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 22,
  },
  browseButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.xl,
  },
  browseButtonText: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.text,
  },
});
