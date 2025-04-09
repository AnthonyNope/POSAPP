// app/carrito.tsx
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { auth } from '../firebase/firebaseConfig';



interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

export default function CarritoScreen() {
  const params = useLocalSearchParams();
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    // Recuperar el carrito desde los parámetros de navegación
    if (params.cart) {
      const parsedCart = JSON.parse(params.cart as string);
      setCart(parsedCart);
    }
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleEnviarPedido = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
  
      await addDoc(collection(db, 'orders'), {
        items: cart,
        status: 'Ordered',
        createdAt: serverTimestamp(),
        userId: uid, // 👈 esto es lo nuevo
      });
  
      Alert.alert('✅ Pedido enviado a la cocina');
      router.replace('/cliente');
    } catch (error) {
      console.error('Error al enviar pedido:', error);
      Alert.alert('❌ Error', 'No se pudo enviar el pedido');
    }
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>${item.price.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()}>
  <Text style={styles.backButton}>← Volver</Text>
</TouchableOpacity>

      <Text style={styles.title}>🧾 Tu pedido</Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id + Math.random()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>

      <TouchableOpacity style={styles.sendButton} onPress={handleEnviarPedido}>
        <Text style={styles.sendButtonText}>Enviar pedido</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5e1',
    padding: 20,
    paddingTop: 40,
  },

  backButton: {
    color: '#ff7f50',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
  },
  price: {
    fontSize: 14,
    color: '#555',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'right',
  },
  sendButton: {
    backgroundColor: '#ff7f50',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
