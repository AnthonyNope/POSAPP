// app/chef.tsx
import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

interface Order {
  id: string;
  items: any[];
  status: string;
  createdAt: Timestamp;
}

export default function ChefScreen() {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'orders'));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];

      const pendingOrders = data.filter(
        (order) =>
          order.status === 'Ordered' ||
          order.status === 'Cooking' ||
          order.status === 'Ready for Pickup'
      );
      setOrders(pendingOrders);
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      fetchOrders(); // refrescar
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  const getMinutesAgo = (createdAt: Timestamp) => {
    const now = new Date();
    const created = createdAt.toDate();
    const diffMs = now.getTime() - created.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    return diffMin <= 0 ? 'recién' : `hace ${diffMin} min`;
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderItem = ({ item }: { item: Order }) => (
    <View style={styles.card}>
      <Text style={styles.orderTitle}>🧾 Pedido {item.id.slice(0, 5)}...</Text>

      {/* Tiempo desde que llegó */}
      {item.createdAt && (
        <Text style={styles.timeText}>🕒 {getMinutesAgo(item.createdAt)}</Text>
      )}

      {item.items.map((product, index) => (
        <Text key={index} style={styles.itemText}>• {product.name}</Text>
      ))}

      <View style={{ marginTop: 10 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => updateOrderStatus(item.id, 'Cooking')}
        >
          <Text style={styles.buttonText}>Marcar como "Cooking"</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#32CD32' }]}
          onPress={() => updateOrderStatus(item.id, 'Ready for Pickup')}
        >
          <Text style={styles.buttonText}>Marcar como "Listo para recoger"</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👨‍🍳 Pedidos entrantes</Text>
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
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 6,
  },
  itemText: {
    color: '#333',
  },
  button: {
    backgroundColor: '#ff7f50',
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
