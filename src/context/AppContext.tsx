import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Courier, Order } from '../types';

interface AppContextType {
  courier: Courier | null;
  orders: Order[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (courier: Courier) => Promise<void>;
  logout: () => Promise<void>;
  updateCourier: (courier: Courier) => Promise<void>;
  setOrders: (orders: Order[]) => void;
  updateFloatBalance: (amount: number) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courier, setCourier] = useState<Courier | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCourierData();
  }, []);

  const loadCourierData = async () => {
    try {
      const courierData = await AsyncStorage.getItem('courier');
      if (courierData) {
        setCourier(JSON.parse(courierData));
      }
    } catch (error) {
      console.error('Error loading courier data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (courierData: Courier) => {
    try {
      await AsyncStorage.setItem('courier', JSON.stringify(courierData));
      setCourier(courierData);
    } catch (error) {
      console.error('Error saving courier data:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('courier');
      setCourier(null);
      setOrders([]);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  const updateCourier = async (updatedCourier: Courier) => {
    try {
      await AsyncStorage.setItem('courier', JSON.stringify(updatedCourier));
      setCourier(updatedCourier);
    } catch (error) {
      console.error('Error updating courier:', error);
      throw error;
    }
  };

  const updateFloatBalance = async (amount: number) => {
    if (courier) {
      const updatedCourier = {
        ...courier,
        floatBalance: courier.floatBalance + amount,
      };
      await updateCourier(updatedCourier);
    }
  };

  return (
    <AppContext.Provider
      value={{
        courier,
        orders,
        isAuthenticated: !!courier,
        isLoading,
        login,
        logout,
        updateCourier,
        setOrders,
        updateFloatBalance,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
