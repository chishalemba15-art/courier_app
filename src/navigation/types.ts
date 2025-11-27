import { Order } from '../types';

export type RootStackParamList = {
  OnboardingFlow: undefined;
  MainApp: undefined;
  KYCRegistration: undefined;
  PendingApproval: undefined;
};

export type MainTabParamList = {
  Orders: undefined;
  Active: undefined;
  Wallet: undefined;
  Profile: undefined;
};

export type OrdersStackParamList = {
  OrdersList: undefined;
  OrderDetails: { order: Order };
  DeliveryMap: { order: Order };
};
