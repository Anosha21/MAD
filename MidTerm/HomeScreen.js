import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

// Import your product images
const productImages = {
  product1: require('../../assets/image/product1.jpg'),
  product2: require('../../assets/image/product2.jpg'),
  product3: require('../../assets/image/product3.jpg'),
  product4: require('../../assets/image/product4.jpg'),
  product5: require('../../assets/image/product5.jpg'),
  product6: require('../../assets/image/product6.jpg'),
};

const HomeScreen = ({ navigation }) => {
  // Product data array
  const products = [
    {
      id: 1,
      name: "Sunfuc Sorer",
      price: "$39.90",
      image: productImages.product1
    },
    {
      id: 2,
      name: "Produc Suries",
      price: "$29.90",
      image: productImages.product2
    },
    {
      id: 3,
      name: "Summer Breeze",
      price: "$49.90",
      image: productImages.product3
    },
    {
      id: 4,
      name: "Winter Glow",
      price: "$59.90",
      image: productImages.product4
    },
    {
      id: 5,
      name: "Ocean Wave",
      price: "$34.90",
      image: productImages.product5
    },
    {
      id: 6,
      name: "Mountain Peak",
      price: "$44.90",
      image: productImages.product6
    }
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconText}>☰</Text>
        </TouchableOpacity>

        <Text style={styles.logo}>SHOP.CO</Text>

        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconText}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cartIcon} 
            onPress={() => navigation.navigate('Cart')}
          >
            <Text style={styles.iconText}>🛒</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories Bar */}
      <View style={styles.categoriesBar}>
        <TouchableOpacity style={styles.categoryTab} onPress={() => navigation.navigate('Winter')}>
          <Text style={styles.categoryTabText}>WINTER</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryTab} onPress={() => navigation.navigate('Summer')}>
          <Text style={styles.categoryTabText}>SUMMER</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryTab} onPress={() => navigation.navigate('Perfumes')}>
          <Text style={styles.categoryTabText}>PERFUMES</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryTab} onPress={() => navigation.navigate('Sale')}>
          <Text style={styles.categoryTabText}>SALE</Text>
        </TouchableOpacity>
      </View>

      {/* Top Picks Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TOP PICKS</Text>
        
        {/* Products Grid */}
        <View style={styles.productsGrid}>
          {products.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <Image 
                source={product.image} 
                style={styles.productImage}
                resizeMode="cover"
              />
              <Text style={styles.productTitle}>{product.name}</Text>
              <Text style={styles.productPrice}>{product.price}</Text>
              <TouchableOpacity style={styles.addToCartButton}>
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#6B21A8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B21A8',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  cartIcon: {
    padding: 8,
    backgroundColor: '#E9D5FF',
    borderRadius: 20,
    marginLeft: 8,
  },
  iconText: {
    fontSize: 18,
    color: '#6B21A8',
  },
  categoriesBar: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
    borderRadius: 12,
    marginTop: 15,
    justifyContent: 'space-around',
    elevation: 2,
    shadowColor: '#6B21A8',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  categoryTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
  },
  categoryTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B21A8',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6B21A8',
    marginBottom: 20,
    textAlign: 'center',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#6B21A8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 12,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 5,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B21A8',
    marginBottom: 12,
  },
  addToCartButton: {
    backgroundColor: '#6B21A8',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default HomeScreen;