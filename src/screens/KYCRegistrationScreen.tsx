import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Courier, KYCFormData } from '../types';
import { useApp } from '../context/AppContext';
import { COLORS, SIZES, SPACING, BORDER_RADIUS } from '../constants/theme';

export default function KYCRegistrationScreen() {
  const navigation = useNavigation();
  const { login } = useApp();
  const [formData, setFormData] = useState<KYCFormData>({
    name: '',
    email: '',
    phone: '',
    nationalId: '',
    licenseNumber: '',
    vehicleType: 'motorcycle',
    vehicleRegistration: '',
  });

  const [errors, setErrors] = useState<Partial<KYCFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<KYCFormData> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^(088|099|085|084|087)\d{7}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid Malawi phone number';
    }
    if (!formData.nationalId.trim()) newErrors.nationalId = 'National ID is required';
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
    if (!formData.vehicleRegistration.trim()) {
      newErrors.vehicleRegistration = 'Vehicle registration is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly');
      return;
    }

    // Create courier object
    const newCourier: Courier = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      nationalId: formData.nationalId,
      licenseNumber: formData.licenseNumber,
      vehicleType: formData.vehicleType,
      vehicleRegistration: formData.vehicleRegistration,
      status: 'pending',
      floatBalance: 0,
      createdAt: new Date(),
    };

    try {
      await login(newCourier);
      Alert.alert(
        'Application Submitted',
        'Your application has been submitted for review. You will be notified once approved.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    }
  };

  const updateField = (field: keyof KYCFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Courier Registration</Text>
        <Text style={styles.subtitle}>
          Complete your KYC to start delivering orders across Malawi
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Enter your full name"
            value={formData.name}
            onChangeText={(text) => updateField('name', text)}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address *</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="your.email@example.com"
            value={formData.email}
            onChangeText={(text) => updateField('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            placeholder="0881234567"
            value={formData.phone}
            onChangeText={(text) => updateField('phone', text)}
            keyboardType="phone-pad"
            maxLength={10}
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>National ID Number *</Text>
          <TextInput
            style={[styles.input, errors.nationalId && styles.inputError]}
            placeholder="Enter your national ID"
            value={formData.nationalId}
            onChangeText={(text) => updateField('nationalId', text)}
          />
          {errors.nationalId && <Text style={styles.errorText}>{errors.nationalId}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Driver's License Number *</Text>
          <TextInput
            style={[styles.input, errors.licenseNumber && styles.inputError]}
            placeholder="Enter your license number"
            value={formData.licenseNumber}
            onChangeText={(text) => updateField('licenseNumber', text)}
          />
          {errors.licenseNumber && <Text style={styles.errorText}>{errors.licenseNumber}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Vehicle Type *</Text>
          <View style={styles.vehicleTypeContainer}>
            {(['motorcycle', 'bicycle', 'car'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.vehicleTypeButton,
                  formData.vehicleType === type && styles.vehicleTypeButtonActive,
                ]}
                onPress={() => updateField('vehicleType', type)}
              >
                <Text
                  style={[
                    styles.vehicleTypeText,
                    formData.vehicleType === type && styles.vehicleTypeTextActive,
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Vehicle Registration *</Text>
          <TextInput
            style={[styles.input, errors.vehicleRegistration && styles.inputError]}
            placeholder="e.g., BL 1234"
            value={formData.vehicleRegistration}
            onChangeText={(text) => updateField('vehicleRegistration', text)}
            autoCapitalize="characters"
          />
          {errors.vehicleRegistration && (
            <Text style={styles.errorText}>{errors.vehicleRegistration}</Text>
          )}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Application</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          By submitting this form, you agree to our terms and conditions. Your application will be
          reviewed within 24-48 hours.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.xl,
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: SIZES.header,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: SIZES.md,
    color: COLORS.text,
    lineHeight: 20,
  },
  form: {
    padding: SPACING.base,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: SIZES.base,
    backgroundColor: COLORS.background,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: SIZES.sm,
    marginTop: SPACING.xs,
  },
  vehicleTypeContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  vehicleTypeButton: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  vehicleTypeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  vehicleTypeText: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
  },
  vehicleTypeTextActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: COLORS.secondary,
    padding: SPACING.base,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  submitButtonText: {
    color: COLORS.textWhite,
    fontSize: SIZES.lg,
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SPACING.lg,
    lineHeight: 18,
  },
});
