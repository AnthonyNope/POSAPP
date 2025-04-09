// app/estado.tsx
import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';

interface Order {
  id: string;
  items: any[];
  status: string;
  createdAt: any;
}

export default function EstadoScreen() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLatestOrder = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const q = query(
        collection(db, 'orders'),
        where('userId', '==', uid), // <-- esto lo vamos a guardar en el próximo paso
        orderBy('createdAt', 'desc'),
        limit(1)
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setOrder({ id: doc.id, ...doc.data() } as Order);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error al obtener pedido:', error);
    }
  };

  useEffect(() => {
    fetchLatestOrder();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ff7f50" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.centered}>
        <Text>No tienes pedidos activos</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Estado del pedido</Text>
      <Text style={styles.status}>Estado: {order.status}</Text>

      <FlatList
        data={order.items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>• {item.name}</Text>
        )}
        contentContainerStyle={{ marginTop: 20 }}
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
    marginBottom: 10,
  },
  status: {
    fontSize: 18,
    fontWeight: '600',
  },
  item: {
    fontSize: 16,
    marginBottom: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff5e1',
  },
});
