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
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import api from '../services/api';

const { width, height } = Dimensions.get('window');

const CadastroScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    try {
        const response =  await api.post("/auth/register", {
            username,
            password
        });

        console.log(response.data); 

        const { token, message, userId } = response.data;

        navigation.navigate('Home', { token, userId });

    } catch (error) {
        console.error("Erro no cadastro", error);

    }
  };

  return (
    <LinearGradient
      colors={['#F9A826', '#FFF5E0', '#F9A826']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.inner}>
              <StatusBar translucent backgroundColor="transparent" />

              <View style={styles.formContainer}>
                <Text style={styles.title}>Create an account</Text>

                <View style={styles.inputContainer}>
                  <Icon name="user" size={20} color="#F9A826" />
                  <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#F9A826"
                    value={username}
                    onChangeText={setUsername}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Icon name="envelope" size={20} color="#F9A826" />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#F9A826"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Icon name="lock" size={20} color="#F9A826" />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#F9A826"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Icon name="lock" size={20} color="#F9A826" />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#F9A826"
                    secureTextEntry={!showPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Icon name={showPassword ? "eye" : "eye-slash"} size={20} color="#888" />
                  </TouchableOpacity>
                </View>

                <View style={styles.optionsContainer}>
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => setRememberMe(!rememberMe)}
                  >
                    <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                      {rememberMe && <Icon name="check" size={12} color="#FFF" />}
                    </View>
                    <Text style={styles.checkboxLabel}>Remember me</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.forgotPassword}>Forgot password?</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
                  <Text style={styles.signUpButtonText}>SIGN UP</Text>
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginLink}>Login Up</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    marginBottom: 25,
    width: '100%',
    paddingBottom: 8,
  },
  input: {
    flex: 1,
    paddingLeft: 15,
    color: '#000',
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#888',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#F9A826',
    borderColor: '#F9A826',
  },
  checkboxLabel: {
    color: '#000',
  },
  forgotPassword: {
    color: '#000',
  },
  signUpButton: {
    backgroundColor: '#F9A826',
    borderRadius: 25,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signUpButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#000',
  },
  loginLink: {
    color: '#F9A826',
    fontWeight: 'bold',
  },
});

export default CadastroScreen;