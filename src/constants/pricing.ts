// Pricing structure for Malawi (in MWK - Malawi Kwacha)
export const PRICING = {
  // Base fare
  baseFare: 500, // MWK 500 base fare

  // Per kilometer rate (distance-based)
  perKmRate: 200, // MWK 200 per km

  // Minimum delivery fee
  minimumFee: 800, // MWK 800 minimum

  // Maximum delivery fee cap
  maximumFee: 10000, // MWK 10,000 maximum

  // Float packages (in MWK)
  floatPackages: [
    {
      id: '1',
      amount: 5000,
      deliveries: 25,
      price: 5000,
    },
    {
      id: '2',
      amount: 10000,
      deliveries: 50,
      price: 10000,
      popular: true,
    },
    {
      id: '3',
      amount: 20000,
      deliveries: 100,
      price: 20000,
    },
    {
      id: '4',
      amount: 50000,
      deliveries: 250,
      price: 50000,
    },
  ],
};

/**
 * Calculate delivery fee based on distance
 * Formula: Base fare + (distance * per km rate)
 * Result is capped between minimum and maximum fee
 */
export const calculateDeliveryFee = (distanceInKm: number): number => {
  const calculatedFee = PRICING.baseFare + (distanceInKm * PRICING.perKmRate);

  // Apply minimum and maximum constraints
  if (calculatedFee < PRICING.minimumFee) {
    return PRICING.minimumFee;
  }

  if (calculatedFee > PRICING.maximumFee) {
    return PRICING.maximumFee;
  }

  return Math.round(calculatedFee);
};

/**
 * Format currency in Malawi Kwacha
 */
export const formatCurrency = (amount: number): string => {
  return `MK ${amount.toLocaleString('en-MW')}`;
};
