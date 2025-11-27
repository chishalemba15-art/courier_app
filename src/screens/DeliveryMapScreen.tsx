import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Order } from '../types';
import { COLORS, SIZES, SPACING, BORDER_RADIUS } from '../constants/theme';
import { formatCurrency } from '../constants/pricing';
import { formatDistance } from '../utils/distance';

type RouteParams = {
  DeliveryMap: {
    order: Order;
  };
};

const { width, height } = Dimensions.get('window');

export default function DeliveryMapScreen() {
  const route = useRoute<RouteProp<RouteParams, 'DeliveryMap'>>();
  const navigation = useNavigation();
  const { order } = route.params;
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: order.storeLocation.latitude,
    longitude: order.storeLocation.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required for navigation');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const handleCompletePickup = () => {
    Alert.alert(
      'Confirm Pickup',
      'Have you collected all items from the store?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            Alert.alert('Success', 'Pickup confirmed! Now navigate to the customer.');
          },
        },
      ]
    );
  };

  const handleCompleteDelivery = () => {
    Alert.alert(
      'Complete Delivery',
      'Confirm that you have delivered the order to the customer?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: () => {
            Alert.alert(
              'Delivery Complete!',
              `You have earned ${formatCurrency(order.deliveryFee)}`,
              [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('Orders'),
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={mapRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            }}
            title="Your Location"
            pinColor={COLORS.primary}
          />
        )}

        <Marker
          coordinate={{
            latitude: order.storeLocation.latitude,
            longitude: order.storeLocation.longitude,
          }}
          title={order.storeName}
          description="Pickup Location"
          pinColor={COLORS.success}
        />

        <Marker
          coordinate={{
            latitude: order.deliveryLocation.latitude,
            longitude: order.deliveryLocation.longitude,
          }}
          title={order.customerName}
          description="Delivery Location"
          pinColor={COLORS.error}
        />

        {currentLocation && (
          <Polyline
            coordinates={[
              {
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
              },
              {
                latitude: order.storeLocation.latitude,
                longitude: order.storeLocation.longitude,
              },
              {
                latitude: order.deliveryLocation.latitude,
                longitude: order.deliveryLocation.longitude,
              },
            ]}
            strokeColor={COLORS.primary}
            strokeWidth={3}
          />
        )}
      </MapView>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Navigation</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <View style={styles.locationInfo}>
            <View style={styles.locationDot} style={{ backgroundColor: COLORS.success }} />
            <View>
              <Text style={styles.locationLabel}>Pickup</Text>
              <Text style={styles.locationName}>{order.storeName}</Text>
              <Text style={styles.locationAddress}>{order.storeAddress}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.locationInfo}>
            <View style={styles.locationDot} style={{ backgroundColor: COLORS.error }} />
            <View>
              <Text style={styles.locationLabel}>Delivery</Text>
              <Text style={styles.locationName}>{order.customerName}</Text>
              <Text style={styles.locationAddress}>{order.deliveryAddress}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="navigate" size={20} color={COLORS.textLight} />
            <Text style={styles.statValue}>{formatDistance(order.distance)}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="cash" size={20} color={COLORS.textLight} />
            <Text style={styles.statValue}>{formatCurrency(order.deliveryFee)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCompletePickup}>
          <Ionicons name="checkmark-done" size={24} color={COLORS.textWhite} />
          <Text style={styles.actionButtonText}>Confirm Pickup</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deliveryButton]}
          onPress={handleCompleteDelivery}
        >
          <Ionicons name="checkmark-circle" size={24} color={COLORS.textWhite} />
          <Text style={styles.actionButtonText}>Complete Delivery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.base,
    backgroundColor: COLORS.background,
    paddingTop: SPACING.xxl,
  },
  backButton: {
    padding: SPACING.xs,
    marginRight: SPACING.sm,
  },
  headerTitle: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  infoCard: {
    position: 'absolute',
    top: 100,
    left: SPACING.base,
    right: SPACING.base,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  infoRow: {
    marginVertical: SPACING.xs,
  },
  locationInfo: {
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
  locationLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  locationName: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: SPACING.xs,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.base,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionButton: {
    backgroundColor: COLORS.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.base,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  deliveryButton: {
    backgroundColor: COLORS.success,
  },
  actionButtonText: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textWhite,
    marginLeft: SPACING.sm,
  },
});
