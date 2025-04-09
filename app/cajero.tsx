// app/cajero.tsx
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
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
      fetchOrders();
    } catch (error) {
      console.error('Error al marcar como pagado:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderItem = ({ item }: { item: Order }) => (
    <View style={styles.card}>
      <Text style={styles.orderTitle}>🧾 Pedido #{item.id.slice(0, 6)}</Text>
      <View style={styles.itemsList}>
        {item.items.map((product, index) => (
          <Text key={index} style={styles.itemText}>• {product.name}</Text>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={() => markAsPaid(item.id)}>
        <Text style={styles.buttonText}>💸 Marcar como Pagado</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💰 Pedidos listos para cobrar</Text>

      {orders.length === 0 ? (
        <View style={styles.centered}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/4151/4151082.png',
            }}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyText}>No hay pedidos listos por el momento</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5e1',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#444',
  },
  itemsList: {
    marginBottom: 12,
  },
  itemText: {
    fontSize: 15,
    color: '#555',
    marginBottom: 4,
    paddingLeft: 6,
  },
  button: {
    backgroundColor: '#32CD32',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
  },
});
