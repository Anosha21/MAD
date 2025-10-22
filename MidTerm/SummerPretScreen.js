import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

const SummerPretScreen = () => {
  // Import summer pret product images
  const productImages = {
    product1: require('../../assets/image/summer-pret1.jpg'),
    product2: require('../../assets/image/summer-pret2.jpg'),
    product3: require('../../assets/image/summer-pret3.jpg'),
    product4: require('../../assets/image/summer-pret4.jpg'),
    product5: require('../../assets/image/summer-pret5.jpg'),
    product6: require('../../assets/image/summer-pret6.jpg'),
  };

  const products = [
    {
      id: 1,
      name: "Linen Shirt",
      price: "$49.90",
      image: productImages.product1
    },
    {
      id: 2,
      name: "Cotton Dress",
      price: "$59.90",
      image: productImages.product2
    },
    {
      id: 3,
      name: "Shorts Set",
      price: "$39.90",
      image: productImages.product3
    },
    {
      id: 4,
      name: "Beach Cover-up",
      price: "$29.90",
      image: productImages.product4
    },
    {
      id: 5,
      name: "Summer Tops",
      price: "$34.90",
      image: productImages.product5
    },
    {
      id: 6,
      name: "Breezy Pants",
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
          <TouchableOpacity style={styles.cartIcon}>
            <Text style={styles.iconText}>🛒</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Page Title */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Summer Pret</Text>
        <Text style={styles.pageSubtitle}>Ready-to-wear summer essentials</Text>
      </View>

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
  pageHeader: {
    padding: 25,
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#6B21A8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#6B21A8',
    marginBottom: 5,
    textAlign: 'center',
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#1F2937',
    textAlign: 'center',
    opacity: 0.7,
  },
  productsGrid: {
    padding: 15,
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
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#6B21A8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 12,
  },
  productTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
    textAlign: 'center',
    lineHeight: 16,
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
    paddingHorizontal: 12,
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

export default SummerPretScreen;