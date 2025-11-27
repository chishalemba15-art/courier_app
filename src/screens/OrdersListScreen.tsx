import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Order } from '../types';
import { useApp } from '../context/AppContext';
import { COLORS, SIZES, SPACING, BORDER_RADIUS } from '../constants/theme';
import { formatCurrency } from '../constants/pricing';
import { formatDistance } from '../utils/distance';

type NavigationProp = StackNavigationProp<any>;

export default function OrdersListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { courier, orders, setOrders } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'available' | 'all'>('available');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    // In a real app, this would fetch from an API
    // For demo, we'll create mock orders
    const mockOrders: Order[] = [
      {
        id: '1',
        storeId: 'store1',
        storeName: 'Shoprite Limbe',
        storeAddress: 'Shoprite Mall, Limbe',
        storeLocation: { latitude: -15.8019, longitude: 35.0370 },
        customerId: 'cust1',
        customerName: 'John Banda',
        customerPhone: '0888123456',
        deliveryAddress: 'Area 18, Lilongwe',
        deliveryLocation: { latitude: -13.9833, longitude: 33.7833 },
        items: [
          { id: '1', name: 'Cooking Oil 2L', quantity: 2, price: 8500 },
          { id: '2', name: 'Rice 5kg', quantity: 1, price: 12000 },
        ],
        totalAmount: 29000,
        deliveryFee: 2500,
        distance: 8.5,
        status: 'pending',
        createdAt: new Date(),
      },
      {
        id: '2',
        storeId: 'store2',
        storeName: 'Game Stores',
        storeAddress: 'Chichiri Shopping Centre',
        storeLocation: { latitude: -15.8089, longitude: 35.0308 },
        customerId: 'cust2',
        customerName: 'Mary Phiri',
        customerPhone: '0991234567',
        deliveryAddress: 'Namiwawa, Blantyre',
        deliveryLocation: { latitude: -15.7869, longitude: 35.0308 },
        items: [
          { id: '1', name: 'Laptop Bag', quantity: 1, price: 15000 },
        ],
        totalAmount: 15000,
        deliveryFee: 1200,
        distance: 3.2,
        status: 'pending',
        createdAt: new Date(),
      },
      {
        id: '3',
        storeId: 'store3',
        storeName: 'Metro Pharmacy',
        storeAddress: 'Victoria Avenue, Blantyre',
        storeLocation: { latitude: -15.7861, longitude: 35.0058 },
        customerId: 'cust3',
        customerName: 'Peter Mwale',
        customerPhone: '0884567890',
        deliveryAddress: 'Ndirande, Blantyre',
        deliveryLocation: { latitude: -15.8167, longitude: 35.0167 },
        items: [
          { id: '1', name: 'Paracetamol', quantity: 2, price: 2500 },
          { id: '2', name: 'Vitamin C', quantity: 1, price: 4000 },
        ],
        totalAmount: 9000,
        deliveryFee: 1500,
        distance: 4.8,
        status: 'pending',
        createdAt: new Date(),
      },
    ];
    setOrders(mockOrders);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const filteredOrders = filter === 'available'
    ? orders.filter(order => order.status === 'pending')
    : orders;

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetails', { order: item })}
    >
      <View style={styles.orderHeader}>
        <View style={styles.storeInfo}>
          <Ionicons name="storefront" size={20} color={COLORS.primary} />
          <Text style={styles.storeName}>{item.storeName}</Text>
        </View>
        <View style={styles.deliveryFeeContainer}>
          <Text style={styles.deliveryFee}>{formatCurrency(item.deliveryFee)}</Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="location" size={16} color={COLORS.textLight} />
          <Text style={styles.detailText} numberOfLines={1}>
            {item.deliveryAddress}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="person" size={16} color={COLORS.textLight} />
          <Text style={styles.detailText}>{item.customerName}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="navigate" size={16} color={COLORS.textLight} />
          <Text style={styles.detailText}>{formatDistance(item.distance)}</Text>
        </View>
      </View>

      <View style={styles.itemsPreview}>
        <Text style={styles.itemsCount}>
          {item.items.length} item{item.items.length !== 1 ? 's' : ''} • {formatCurrency(item.totalAmount)}
        </Text>
      </View>

      <View style={styles.orderFooter}>
        <View style={styles.timeContainer}>
          <Ionicons name="time" size={14} color={COLORS.textLight} />
          <Text style={styles.timeText}>
            {new Date(item.createdAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
        <TouchableOpacity style={styles.acceptButton}>
          <Text style={styles.acceptButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Orders</Text>
        <View style={styles.floatBalance}>
          <Ionicons name="wallet" size={20} color={COLORS.textWhite} />
          <Text style={styles.floatBalanceText}>
            {formatCurrency(courier?.floatBalance || 0)}
          </Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'available' && styles.filterButtonActive]}
          onPress={() => setFilter('available')}
        >
          <Text
            style={[styles.filterButtonText, filter === 'available' && styles.filterButtonTextActive]}
          >
            Available
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterButtonText, filter === 'all' && styles.filterButtonTextActive]}>
            All Orders
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="file-tray-outline" size={64} color={COLORS.textLight} />
            <Text style={styles.emptyText}>No orders available</Text>
            <Text style={styles.emptySubtext}>Pull down to refresh</Text>
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
  floatBalance: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
  },
  floatBalanceText: {
    color: COLORS.textWhite,
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: SPACING.base,
    backgroundColor: COLORS.background,
    gap: SPACING.sm,
  },
  filterButton: {
    flex: 1,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  filterButtonText: {
    fontSize: SIZES.base,
    color: COLORS.textLight,
  },
  filterButtonTextActive: {
    color: COLORS.textWhite,
    fontWeight: '600',
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  storeName: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  deliveryFeeContainer: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  deliveryFee: {
    fontSize: SIZES.base,
    fontWeight: 'bold',
    color: COLORS.textWhite,
  },
  orderDetails: {
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  detailText: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  itemsPreview: {
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  itemsCount: {
    fontSize: SIZES.md,
    color: COLORS.text,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
  },
  acceptButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  acceptButtonText: {
    color: COLORS.textWhite,
    fontWeight: '600',
    fontSize: SIZES.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SPACING.xxl * 2,
  },
  emptyText: {
    fontSize: SIZES.lg,
    color: COLORS.textLight,
    marginTop: SPACING.base,
  },
  emptySubtext: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
});
