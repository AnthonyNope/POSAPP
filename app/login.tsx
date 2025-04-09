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
          role: 'cliente', // 👈 Por ahora asignamos siempre "cliente"
        });
      
        Alert.alert('✅ Registro exitoso como cliente');
      }
       else {
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
  
        // Redirección por rol
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
      <View style={styles.innerContainer}>
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
          placeholderTextColor="#999"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#999"
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
    backgroundColor: '#fff5e1',
    justifyContent: 'center',
  },
  innerContainer: {
    padding: 30,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#555',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#ff7f50',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
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
  },
});
