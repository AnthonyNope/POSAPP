// app/cajero.tsx
import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

interface Order {
  id: string;
  items: any[];
  status: string;
}

export default function CajeroScreen() {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'orders'));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];

      const readyOrders = data.filter((order) => order.status === 'Ready for Pickup');
      setOrders(readyOrders);
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
    }
  };

  const markAsPaid = async (orderId: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'Paid',
      });
      fetchOrders(); // recargar
    } catch (error) {
      console.error('Error al marcar como pagado:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderItem = ({ item }: { item: Order }) => (
    <View style={styles.card}>
      <Text style={styles.orderTitle}>🧾 Pedido {item.id.slice(0, 5)}...</Text>
      {item.items.map((product, index) => (
        <Text key={index} style={styles.itemText}>• {product.name}</Text>
      ))}

      <TouchableOpacity
        style={styles.button}
        onPress={() => markAsPaid(item.id)}
      >
        <Text style={styles.buttonText}>Marcar como "Pagado"</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💰 Pedidos para cobrar</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  orderTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemText: {
    color: '#333',
  },
  button: {
    backgroundColor: '#32CD32',
    marginTop: 10,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
