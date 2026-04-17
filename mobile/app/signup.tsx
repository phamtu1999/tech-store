import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';
import { registerApi } from '../api';
import { useAuth } from '../context/AuthContext';

export default function SignupScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !email || !password || !phone) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);
    try {
      const response = await registerApi({ fullName, email, password, phone });
      // response is AuthResponse { token, id, email, fullName, role }
      const user = {
        id: response.id,
        email: response.email,
        fullName: response.fullName,
        username: response.email,
      };
      await login(response.token, user);
      Alert.alert('Thành công', 'Đăng ký tài khoản thành công!');
      router.replace('/(tabs)/profile');
    } catch (error: any) {
      console.error('Signup error:', error);
      const msg = error.response?.data?.message || 'Đăng ký thất bại. Email có thể đã tồn tại.';
      Alert.alert('Lỗi', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Tạo tài khoản mới</Text>
            <Text style={styles.subText}>Tham gia cộng đồng TECHZONE để nhận nhiều ưu đãi hấp dẫn.</Text>
          </View>

          <View style={styles.form}>
            <InputBox label="Họ và tên" icon="person-outline" value={fullName} onChangeText={setFullName} placeholder="Nguyễn Văn A" />
            <InputBox label="Email" icon="mail-outline" value={email} onChangeText={setEmail} placeholder="name@example.com" keyboardType="email-address" />
            <InputBox label="Số điện thoại" icon="call-outline" value={phone} onChangeText={setPhone} placeholder="09xx xxx xxx" keyboardType="phone-pad" />
            <InputBox label="Mật khẩu" icon="lock-closed-outline" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />

            <TouchableOpacity 
              style={[styles.signupBtn, loading && { opacity: 0.7 }]} 
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.signupBtnText}>Đăng Ký</Text>}
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.alreadyText}>Đã có tài khoản? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginText}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const InputBox = ({ label, icon, ...props }: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputBox}>
      <Ionicons name={icon} size={20} color={COLORS.textLight} />
      <TextInput style={styles.input} placeholderTextColor={COLORS.textLight} {...props} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollContent: { padding: 24 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.bgGray, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  header: { marginBottom: 30 },
  title: { fontSize: 28, fontWeight: '900', color: COLORS.textDark },
  subText: { fontSize: 15, color: COLORS.textLight, marginTop: 8, lineHeight: 22 },
  form: { flex: 1 },
  inputGroup: { gap: 8, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '700', color: COLORS.textDark, marginLeft: 4 },
  inputBox: { flexDirection: 'row', alignItems: 'center', height: 56, backgroundColor: COLORS.bgGray, borderRadius: 16, paddingHorizontal: 16, borderWidth: 1, borderColor: '#F3F4FB' },
  input: { flex: 1, marginLeft: 12, fontSize: 15, color: COLORS.textDark },
  signupBtn: { height: 56, backgroundColor: COLORS.primary, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 20, ...SHADOWS.medium },
  signupBtnText: { color: 'white', fontSize: 16, fontWeight: '800' },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  alreadyText: { color: COLORS.textLight, fontSize: 14 },
  loginText: { color: COLORS.primary, fontWeight: '800', fontSize: 14 },
});
