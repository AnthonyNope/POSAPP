// app/estado.tsx
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
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

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', uid),
      orderBy('createdAt', 'desc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setOrder({ id: doc.id, ...doc.data() } as Order);
      } else {
        setOrder(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
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
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/10437/10437301.png',
          }}
          style={styles.emptyImage}
        />
        <Text style={styles.emptyText}>No tienes pedidos activos</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📦 Estado del Pedido</Text>

      <View style={styles.card}>
        <Text style={styles.statusText}>🟠 Estado: <Text style={styles.statusValue}>{order.status}</Text></Text>

        <Text style={styles.itemsTitle}>📝 Detalles del Pedido:</Text>
        <FlatList
          data={order.items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.itemText}>• {item.name}</Text>
          )}
          contentContainerStyle={{ paddingTop: 8 }}
        />
      </View>
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
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
    color: '#555',
  },
  statusValue: {
    fontWeight: 'bold',
    color: '#ff7f50',
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  itemText: {
    fontSize: 15,
    color: '#555',
    marginBottom: 4,
    paddingLeft: 6,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff5e1',
    paddingHorizontal: 20,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
});
