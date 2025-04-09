// app/cliente.tsx
import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';



interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

export default function ClienteScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCol = collection(db, 'products');
        const snapshot = await getDocs(productsCol);
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

        setProducts(items);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };

    fetchProducts();
  }, []);

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
        <Text style={styles.addButtonText}>Agregar al carrito</Text>
      </TouchableOpacity>
    </View>
  );
  
  const addToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Menú</Text>
  
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }} // extra espacio para la barra del carrito
      />
  
  {cart.length > 0 && (
  <View style={styles.cartBar}>
    <View>
      <Text style={styles.cartText}>
        🛒 {cart.length} producto(s) en el carrito
      </Text>
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: '/carrito',
            params: {
              cart: JSON.stringify(cart),
            },
          });
        }}
      >
        <Text style={styles.viewCartButton}>Ver pedido</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/estado')}
        style={{ marginTop: 4 }}
      >
        <Text style={[styles.viewCartButton, { color: '#32CD32' }]}>
          Ver estado del pedido
        </Text>
      </TouchableOpacity>
    </View>
  </View>
)}


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
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    color: '#555',
    marginVertical: 4,
  },
  price: {
    color: '#ff7f50',
    fontWeight: '600',
    marginTop: 6,
  },

  addButton: {
    marginTop: 10,
    backgroundColor: '#ff7f50',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  cartBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartText: {
    fontWeight: '600',
  },
  viewCartButton: {
    color: '#ff7f50',
    fontWeight: '700',
  },
  
  
});
