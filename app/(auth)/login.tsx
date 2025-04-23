import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Phone, ShieldCheck } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/AuthContext';
import * as Haptics from 'expo-haptics';

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signInWithPhone, confirmCode } = useAuth();
  const router = useRouter();

  const handleSendOtp = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Format phone number to E.164 format
      const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      await signInWithPhone(formattedNumber);
      setShowOtpInput(true);
    } catch (error) {
      setError('Failed to send verification code. Please try again.');
      console.error('Error sending OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await confirmCode(otp);
      router.replace('/(tabs)');
    } catch (error) {
      setError('Invalid verification code. Please try again.');
      console.error('Error verifying OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <LinearGradient
              colors={['#0A84FF', '#30D158']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoContainer}
            >
              <Text style={styles.logoText}>B</Text>
            </LinearGradient>
            <Text style={styles.headerTitle}>BillBuckz</Text>
            <Text style={styles.headerSubtitle}>
              Scan bills. Earn cashback. Save money.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            
            {!showOtpInput ? (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Phone Number</Text>
                  <TextInput
                    mode="outlined"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    left={<TextInput.Icon icon={() => <Phone size={20} color="#0A84FF" />} />}
                    style={styles.input}
                    placeholder="Enter your phone number"
                    outlineStyle={styles.inputOutline}
                  />
                  <Text style={styles.helperText}>
                    We'll send you a one-time password to verify your number
                  </Text>
                </View>

                <Button 
                  mode="contained" 
                  onPress={handleSendOtp}
                  style={styles.button}
                  loading={loading}
                  disabled={phoneNumber.length < 10 || loading}
                >
                  Send OTP
                </Button>
              </>
            ) : (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Enter OTP</Text>
                  <TextInput
                    mode="outlined"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                    left={<TextInput.Icon icon={() => <ShieldCheck size={20} color="#0A84FF" />} />}
                    style={styles.input}
                    placeholder="Enter 6-digit OTP"
                    outlineStyle={styles.inputOutline}
                  />
                  <Text style={styles.helperText}>
                    OTP sent to {phoneNumber}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => {
                      setShowOtpInput(false);
                      setError(null);
                    }}
                  >
                    <Text style={styles.changeNumberText}>Change number</Text>
                  </TouchableOpacity>
                </View>

                <Button 
                  mode="contained" 
                  onPress={handleVerifyOtp}
                  style={styles.button}
                  loading={loading}
                  disabled={otp.length < 6 || loading}
                >
                  Verify OTP
                </Button>
              </>
            )}
          </View>

          {/* Register Link */}
          <View style={styles.registerLinkContainer}>
            <Text style={styles.registerText}>Don't have an account?</Text>
            <TouchableOpacity 
              onPress={() => router.push('/(auth)/register')}
              style={styles.registerLink}
            >
              <Text style={styles.registerLinkText}>Register</Text>
              <ChevronRight size={16} color="#0A84FF" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontFamily: 'Inter-Bold',
    fontSize: 40,
    color: '#FFFFFF',
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#0A0A0A',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B6B6B',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 32,
  },
  errorContainer: {
    backgroundColor: '#FFECEC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FF3B30',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#0A0A0A',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  inputOutline: {
    borderRadius: 8,
    borderWidth: 1,
  },
  helperText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B6B6B',
    marginTop: 8,
  },
  changeNumberText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#0A84FF',
    marginTop: 8,
  },
  button: {
    height: 56,
    justifyContent: 'center',
    borderRadius: 28,
  },
  registerLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  registerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B6B6B',
    marginRight: 4,
  },
  registerLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  registerLinkText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#0A84FF',
  },
});