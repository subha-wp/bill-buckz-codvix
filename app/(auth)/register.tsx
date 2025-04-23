import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, User, Mail, Phone, ShieldCheck } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendOtp = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    setLoading(true);
    
    // Simulate API call for sending OTP
    setTimeout(() => {
      setShowOtpInput(true);
      setLoading(false);
    }, 1500);
  };

  const handleVerifyOtp = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    setLoading(true);
    
    // Simulate API call for registration and OTP verification
    setTimeout(() => {
      setLoading(false);
      router.replace('/(auth)/login');
    }, 1500);
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
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color="#0A0A0A" />
            </TouchableOpacity>
            <LinearGradient
              colors={['#0A84FF', '#30D158']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoContainer}
            >
              <Text style={styles.logoText}>B</Text>
            </LinearGradient>
            <Text style={styles.headerTitle}>Create Account</Text>
            <Text style={styles.headerSubtitle}>
              Join BillBuckz and start saving on every bill
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {!showOtpInput ? (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    mode="outlined"
                    value={name}
                    onChangeText={setName}
                    left={<TextInput.Icon icon={() => <User size={20} color="#0A84FF" />} />}
                    style={styles.input}
                    placeholder="Enter your name"
                    outlineStyle={styles.inputOutline}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <TextInput
                    mode="outlined"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    left={<TextInput.Icon icon={() => <Mail size={20} color="#0A84FF" />} />}
                    style={styles.input}
                    placeholder="Enter your email"
                    outlineStyle={styles.inputOutline}
                  />
                </View>

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
                  disabled={name.length < 2 || !email.includes('@') || phoneNumber.length < 10 || loading}
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
                  <TouchableOpacity onPress={() => setShowOtpInput(false)}>
                    <Text style={styles.changeNumberText}>Change information</Text>
                  </TouchableOpacity>
                </View>

                <Button 
                  mode="contained" 
                  onPress={handleVerifyOtp}
                  style={styles.button}
                  loading={loading}
                  disabled={otp.length < 6 || loading}
                >
                  Create Account
                </Button>
              </>
            )}
          </View>

          {/* Login Link */}
          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity 
              onPress={() => router.push('/(auth)/login')}
              style={styles.loginLink}
            >
              <Text style={styles.loginLinkText}>Log In</Text>
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
    paddingTop: 24,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#FFFFFF',
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
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
  inputContainer: {
    marginBottom: 16,
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
    marginTop: 8,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  loginText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B6B6B',
    marginRight: 4,
  },
  loginLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginLinkText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#0A84FF',
  },
});