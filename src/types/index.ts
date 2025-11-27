export interface Courier {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationalId: string;
  licenseNumber: string;
  vehicleType: 'motorcycle' | 'bicycle' | 'car';
  vehicleRegistration: string;
  profilePhoto?: string;
  licensePhoto?: string;
  status: 'pending' | 'approved' | 'rejected';
  floatBalance: number;
  createdAt: Date;
}

export interface Order {
  id: string;
  storeId: string;
  storeName: string;
  storeAddress: string;
  storeLocation: Location;
  customerId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryLocation: Location;
  items: OrderItem[];
  totalAmount: number;
  deliveryFee: number;
  distance: number; // in kilometers
  status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  createdAt: Date;
  acceptedAt?: Date;
  deliveredAt?: Date;
  courierId?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface FloatPackage {
  id: string;
  amount: number;
  deliveries: number;
  price: number;
  popular?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'airtel_money' | 'tnm_mpamba' | 'card';
  name: string;
  icon: string;
}

export interface KYCFormData {
  name: string;
  email: string;
  phone: string;
  nationalId: string;
  licenseNumber: string;
  vehicleType: 'motorcycle' | 'bicycle' | 'car';
  vehicleRegistration: string;
  profilePhoto?: string;
  licensePhoto?: string;
}
