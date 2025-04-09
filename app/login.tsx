// app/login.tsx
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { registerUser, loginUser } from '../firebase/authService';
import { router } from 'expo-router';
import { getUserRole } from '../firebase/authService'; 
import { auth } from '../firebase/firebaseConfig'; 
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleAuth = async () => {
    try {
      if (isRegister) {
        const userCredential = await registerUser(email, password);
        const uid = userCredential.user.uid;

        const userRef = doc(db, 'users', uid);
        await setDoc(userRef, {
          email,
          role: 'cliente',
        });

        Alert.alert('✅ Registro exitoso como cliente');
      } else {
        await loginUser(email, password);
        const uid = auth.currentUser?.uid;

        if (!uid) {
          Alert.alert('Error', 'No se pudo obtener el UID del usuario');
          return;
        }

        const role = await getUserRole(uid);

        if (!role) {
          Alert.alert('❌ Error', 'No se encontró el rol del usuario');
          return;
        }

        Alert.alert('✅ Login exitoso', `Rol: ${role}`);

        if (role === 'cliente') {
          router.replace('/cliente');
        } else if (role === 'chef') {
          router.replace('/chef');
        } else if (role === 'cajero') {
          router.replace('/cajero');
        } else {
          Alert.alert('❌ Rol desconocido', `Rol recibido: ${role}`);
        }
      }
    } catch (error: any) {
      Alert.alert('❌ Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png',
          }}
          style={styles.logo}
        />
        <Text style={styles.title}>{isRegister ? 'Crea tu cuenta' : 'Bienvenido de nuevo'}</Text>
        <Text style={styles.subtitle}>
          {isRegister ? 'Regístrate para comenzar' : 'Inicia sesión para continuar'}
        </Text>

        <TextInput
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#aaa"
        />

        <TouchableOpacity style={styles.button} onPress={handleAuth}>
          <Text style={styles.buttonText}>
            {isRegister ? 'Registrarse' : 'Iniciar Sesión'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
          <Text style={styles.toggleText}>
            {isRegister
              ? '¿Ya tienes cuenta? Inicia sesión'
              : '¿No tienes cuenta? Regístrate'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff4ec',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 10,
    alignItems: 'center',
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#777',
    marginBottom: 25,
  },
  input: {
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  button: {
    width: '100%',
    backgroundColor: '#ff7f50',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#ff7f50',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  toggleText: {
    marginTop: 20,
    color: '#ff7f50',
    fontWeight: '500',
    fontSize: 14,
  },
});
