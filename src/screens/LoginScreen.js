import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import api from '../services/api';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", {
        username,
        password
      });

      console.log(response.data); // token, message, etc.

      navigation.navigate("Home");

    } catch (error) {
      console.error("Erro no login");
    }
  }

  return (
    <LinearGradient
      colors={['#F9A826', '#FFF5E0', '#F9A826']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <StatusBar translucent backgroundColor="transparent" />

              <Text style={styles.title}>Login</Text>

              <View style={styles.inputContainer}>
                <Icon name="user" size={20} color="#F9A826" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="#999"
                  autoCorrect={false}
                  onChangeText={setUsername}
                  value={username}
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon name="lock" size={20} color="#F9A826" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  onChangeText={setPassword}
                  value={password}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Icon name={showPassword ? "eye-off" : "eye"} size={20} color="#888" />
                </TouchableOpacity>
              </View>

              <View style={styles.rememberForgotPassword}>
                <TouchableOpacity
                  style={styles.rememberMeContainer}
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                    {rememberMe && <Icon name="check" size={14} color="#fff" />}
                  </View>
                  <Text style={styles.rememberMeText}>Remember me</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>LOGIN</Text>
              </TouchableOpacity>

              <View style={styles.signUpContainer}>
                <Text style={styles.noAccountText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
                  <Text style={styles.signUpLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    // Removido o backgroundColor para permitir que o gradiente apareça
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000', // Alterado para preto para melhor contraste com o fundo
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%',
    height: 50, // Altura fixa para melhor consistência
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 10,
  },
  rememberForgotPassword: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#F9A826',
    borderColor: '#F9A826',
  },
  rememberMeText: {
    fontSize: 14,
    color: '#000', // Alterado para preto para melhor contraste
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#F9A826',
  },
  loginButton: {
    backgroundColor: '#F9A826',
    borderRadius: 25, // Arredondado para combinar com o design anterior
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#000', // Alterado para preto para combinar com o design anterior
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpContainer: {
    flexDirection: 'row',
    marginTop: 25,
  },
  noAccountText: {
    color: '#000', // Alterado para preto para melhor contraste
  },
  signUpLink: {
    color: '#F9A826',
    fontWeight: 'bold',
  },
});