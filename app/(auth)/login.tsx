import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { useRef, useState } from 'react';
import Colors from '@/constants/Colors';
import FloatingLabelInput from '@/components/FloatingLabelInput';
import { router } from 'expo-router';

export default function Login() {
  const [switchMode, setSwitchMode] = useState<'login' | 'register'>('login');
  const transition = useRef(new Animated.Value(0)).current;

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [loginEmailError, setLoginEmailError] = useState('');
  const [loginPasswordError, setLoginPasswordError] = useState('');
  const [regEmailError, setRegEmailError] = useState('');
  const [regPasswordError, setRegPasswordError] = useState('');
  const [regConfirmPasswordError, setRegConfirmPasswordError] = useState('');

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email).toLowerCase());

  const register = () => {
    const email = regEmail.trim();
    const password = regPassword;
    const confirm = regConfirmPassword;
    let hasError = false;

    if (!email) {
      setRegEmailError('Enter email');
      hasError = true;
    } else if (!isValidEmail(email)) {
      setRegEmailError('Invalid email format');
      hasError = true;
    } else {
      setRegEmailError('');
    }

    if (!password) {
      setRegPasswordError('Enter password');
      hasError = true;
    } else if (password.length < 8) {
      setRegPasswordError('The password must contain at least 8 characters');
      hasError = true;
    } else {
      setRegPasswordError('');
    }

    if (!confirm) {
      setRegConfirmPasswordError('Confirm password');
      hasError = true;
    } else if (confirm !== password) {
      setRegConfirmPasswordError('Passwords do not match');
      hasError = true;
    } else {
      setRegConfirmPasswordError('');
    }

    if (hasError) return;

    console.log('register button');
    router.replace('/(tabs)');
  };

  const login = () => {
    const email = loginEmail.trim();
    const password = loginPassword;
    let hasError = false;

    if (!email) {
      setLoginEmailError('Enter email');
      hasError = true;
    } else if (!isValidEmail(email)) {
      setLoginEmailError('Invalid email format');
      hasError = true;
    } else {
      setLoginEmailError('');
    }

    if (!password) {
      setLoginPasswordError('Enter password');
      hasError = true;
    } else if (password.length < 8) {
      setLoginPasswordError('The password must contain at least 8 characters');
      hasError = true;
    } else {
      setLoginPasswordError('');
    }

    if (hasError) return;

    console.log('login button');
    router.replace('/(tabs)');
  };

  const resetForms = (mode: 'login' | 'register') => {
    if (mode === 'login') {
      setLoginEmail('');
      setLoginPassword('');
      setLoginEmailError('');
      setLoginPasswordError('');
    } else {
      setRegConfirmPassword('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPasswordError('');
      setRegEmailError('');
      setRegPasswordError('');
    }
  };

  const animateTo = (mode: 'login' | 'register') => {
    Animated.timing(transition, {
      toValue: mode === 'login' ? 0 : 1,
      duration: 320,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      useNativeDriver: true,
    }).start();
  };

  // Own swipe handler
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });

  const minSwipeDistance = 50;

  const onTouchStart = (e: any) => {
    setTouchEnd({ x: 0, y: 0 }); // Reset end position
    setTouchStart({ x: e.nativeEvent.pageX, y: e.nativeEvent.pageY });
  };

  const onTouchMove = (e: any) => {
    setTouchEnd({ x: e.nativeEvent.pageX, y: e.nativeEvent.pageY });
  };

  const onTouchEnd = () => {
    if (!touchStart.x || !touchEnd.x) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);
    if (isHorizontalSwipe && Math.abs(distanceX) > minSwipeDistance) {
      if (distanceX < 0 && switchMode === 'register') {
        setSwitchMode('login');
        resetForms('login');
        animateTo('login');
      } else if (distanceX > 0 && switchMode === 'login') {
        setSwitchMode('register');
        resetForms('register');
        animateTo('register');
      }
    }
  };

  return (
    <View
      style={styles.container}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <View style={styles.formStack}>
        <Animated.View
          style={[
            styles.formContainer,
            styles.absoluteFill,
            {
              opacity: transition.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
              zIndex: switchMode === 'login' ? 2 : 1,
              transform: [
                {
                  translateY: transition.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 16],
                  }),
                },
                {
                  scale: transition.interpolate({ inputRange: [0, 1], outputRange: [1, 0.98] }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.title}>Login here</Text>
          <Text style={styles.subtitle}>Welcome back you've {'\n'} been missed!</Text>
          <View style={styles.inputContainer}>
            <FloatingLabelInput
              label="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={loginEmail}
              onChangeText={setLoginEmail}
            />
            {!!loginEmailError && <Text style={styles.errorText}>{loginEmailError}</Text>}
            <FloatingLabelInput
              label="Password"
              secureTextEntry
              value={loginPassword}
              onChangeText={setLoginPassword}
            />
            {!!loginPasswordError && <Text style={styles.errorText}>{loginPasswordError}</Text>}
          </View>
          <TouchableOpacity style={styles.button} onPress={login}>
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={[
            styles.formContainer,
            styles.absoluteFill,
            {
              opacity: transition.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
              zIndex: switchMode === 'register' ? 2 : 1,
              transform: [
                {
                  translateY: transition.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-16, 0],
                  }),
                },
                {
                  scale: transition.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1] }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.title}>Registration</Text>
          <Text style={styles.subtitle}>Create an account so you can explore this app</Text>
          <FloatingLabelInput
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={regEmail}
            onChangeText={setRegEmail}
          />
          {!!regEmailError && <Text style={styles.errorText}>{regEmailError}</Text>}
          <FloatingLabelInput
            label="Password"
            secureTextEntry
            value={regPassword}
            onChangeText={setRegPassword}
          />
          {!!regPasswordError && <Text style={styles.errorText}>{regPasswordError}</Text>}
          <FloatingLabelInput
            label="Confirm Password"
            secureTextEntry
            value={regConfirmPassword}
            onChangeText={setRegConfirmPassword}
          />
          {!!regConfirmPasswordError && (
            <Text style={styles.errorText}>{regConfirmPasswordError}</Text>
          )}
          <TouchableOpacity style={styles.button} onPress={register}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View style={styles.switcher}>
        <TouchableOpacity
          style={[styles.switcherButtonFirst, switchMode === 'login' && styles.switcherActive]}
          onPress={() => {
            setSwitchMode('login');
            resetForms('login');
            animateTo('login');
          }}
        >
          <Text
            style={[styles.text, switchMode === 'login' ? styles.textActive : styles.textInactive]}
          >
            Log in
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.switcherButtonSecond, switchMode === 'register' && styles.switcherActive]}
          onPress={() => {
            setSwitchMode('register');
            resetForms('register');
            animateTo('register');
          }}
        >
          <Text
            style={[
              styles.text,
              switchMode === 'register' ? styles.textActive : styles.textInactive,
            ]}
          >
            Register
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  formStack: {
    width: '80%',
    minHeight: 500,
    position: 'relative',
  },
  formContainer: {
    width: '100%',
    height: 'auto',
    paddingVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    gap: 20,
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.light.tint,
    fontFamily: 'GoogleSansCode',
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'GoogleSansCode',
  },
  inputContainer: {
    width: '100%',
    height: 'auto',
    marginTop: 30,
    gap: 20,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 30,
    width: 'auto',
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: Colors.light.tint,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'GoogleSansCode',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    width: '100%',
    color: 'crimson',
    marginTop: -10,
    fontSize: 12,
    fontFamily: 'GoogleSansCode',
  },
  switcher: {
    display: 'flex',
    flexDirection: 'row',
    height: 40,
    width: '70%',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  switcherButtonFirst: {
    justifyContent: 'center',
    width: '50%',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderColor: 'gray',
    borderEndWidth: 0,
    borderWidth: 1,
  },
  switcherButtonSecond: {
    justifyContent: 'center',
    width: '50%',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderColor: 'gray',
    borderStartWidth: 0,
    borderWidth: 1,
  },
  switcherActive: {
    backgroundColor: Colors.light.tint,
  },
  text: {
    fontSize: 14,
    fontFamily: 'GoogleSansCode',
    textAlign: 'center',
  },
  textActive: {
    color: 'white',
  },
  textInactive: {
    color: 'black',
  },
});
