# Courier Malawi - Delivery App

A modern, user-friendly courier delivery app specifically built for Malawi. This app enables delivery couriers to accept orders, navigate to customers, and manage their earnings through a comprehensive float system.

## Features

### 🚴 Core Functionality
- **Order Management**: View and accept delivery orders from stores
- **Real-time Navigation**: Interactive maps showing pickup and delivery locations
- **Distance-based Pricing**: Smart pricing system calculated based on delivery distance
- **Float System**: Buy float packages to accept and fulfill orders

### 📱 User Experience
- **KYC Registration**: Secure courier onboarding with document verification
- **Approval System**: Application review process before courier activation
- **Yango-inspired Design**: Clean, professional UI with easy navigation
- **Mobile Money Integration**: Support for Airtel Money and TNM Mpamba

### 💰 Payment & Earnings
- **Multiple Payment Methods**:
  - Airtel Money
  - TNM Mpamba
  - Debit/Credit Card
- **Float Packages**: Purchase float to unlock delivery opportunities
- **Earnings Tracking**: Monitor completed deliveries and earnings

## Technology Stack

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **Maps**: React Native Maps with Expo Location
- **State Management**: React Context API
- **Storage**: AsyncStorage for local data persistence

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Studio (for Android development)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd courier_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Google Maps API Key (for Android)**
   - Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Update the API key in `app.json`:
     ```json
     "android": {
       "config": {
         "googleMaps": {
           "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
         }
       }
     }
     ```

4. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

5. **Run on a device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your physical device

## Project Structure

```
courier_app/
├── src/
│   ├── components/         # Reusable UI components
│   ├── constants/          # App constants (theme, pricing)
│   ├── context/           # React Context for state management
│   ├── navigation/        # Navigation configuration
│   ├── screens/           # App screens
│   ├── services/          # API services
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── assets/                # Images, fonts, and other assets
├── App.tsx               # Main app entry point
├── app.json              # Expo configuration
└── package.json          # Dependencies
```

## Key Screens

### 1. KYC Registration
Courier registration with required information:
- Full Name
- Email & Phone
- National ID
- Driver's License Number
- Vehicle Type (Motorcycle, Bicycle, Car)
- Vehicle Registration

### 2. Pending Approval
Status screen displayed while application is under review (24-48 hours)

### 3. Orders List
Browse available delivery orders with:
- Store information
- Delivery address
- Distance and delivery fee
- Order items and total amount

### 4. Order Details
Comprehensive view of order information:
- Pickup and delivery locations
- Customer contact information
- Order items breakdown
- Accept order functionality

### 5. Delivery Map
Interactive navigation screen featuring:
- Real-time location tracking
- Route visualization
- Pickup and delivery markers
- Confirm pickup/delivery buttons

### 6. Wallet
Float management system:
- Current float balance display
- Multiple float package options
- Airtel Money & TNM Mpamba integration
- Card payment support

### 7. Active Deliveries
Track ongoing deliveries with:
- Current order status
- Quick navigation to map
- Delivery progress tracking

### 8. Profile
User account management:
- Personal information
- Vehicle details
- Earnings history
- Help & support

## Pricing Structure (Malawi Kwacha)

- **Base Fare**: MK 500
- **Per Kilometer**: MK 200/km
- **Minimum Fee**: MK 800
- **Maximum Fee**: MK 10,000

### Float Packages
- **Starter**: MK 5,000 (25 deliveries)
- **Popular**: MK 10,000 (50 deliveries) ⭐
- **Professional**: MK 20,000 (100 deliveries)
- **Business**: MK 50,000 (250 deliveries)

## Development

### Running Tests
```bash
npm test
```

### Building for Production

**Android**
```bash
expo build:android
```

**iOS**
```bash
expo build:ios
```

### Using EAS Build (Recommended)
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## Configuration

### Environment Variables
Create a `.env` file for environment-specific configuration:
```
GOOGLE_MAPS_API_KEY=your_api_key_here
API_BASE_URL=https://api.yourserver.com
```

## Security & Privacy

- KYC information is stored locally and encrypted
- Location data only used during active deliveries
- Secure payment processing through mobile money providers
- User data never shared without explicit consent

## Support

For issues or questions:
- Email: support@courier.mw
- Phone: +265 888 123 456

## License

Copyright © 2025 Courier Malawi. All rights reserved.

## Contributing

This is a proprietary application. For feature requests or bug reports, please contact the development team.

## Roadmap

- [ ] Real-time order notifications
- [ ] In-app chat with customers
- [ ] Delivery history and analytics
- [ ] Multi-language support (English, Chichewa)
- [ ] Offline mode capabilities
- [ ] Enhanced earnings dashboard
- [ ] Rating and review system
- [ ] Integration with major Malawian stores

## Acknowledgments

- Design inspiration: Yango
- Maps: Google Maps & OpenStreetMap
- Icons: Expo Vector Icons
- Target Market: Malawi 🇲🇼
