// app/chef.tsx
import { View, Text, StyleSheet } from 'react-native';

export default function ChefScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>👨‍🍳 Vista Chef</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff5e1',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
