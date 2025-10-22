import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

const SaleScreen = () => {
  // Import sale product images
  const productImages = {
    product1: require('../../assets/image/sale1.jpg'),
    product2: require('../../assets/image/sale2.jpg'),
    product3: require('../../assets/image/sale3.jpg'),
    product4: require('../../assets/image/sale4.jpg'),
    product5: require('../../assets/image/sale5.jpg'),
    product6: require('../../assets/image/sale6.jpg'),
  };

  const products = [
    {
      id: 1,
      name: "Winter Jacket",
      originalPrice: "$129.90",
      salePrice: "$89.90",
      image: productImages.product1
    },
    {
      id: 2,
      name: "Summer Dress",
      originalPrice: "$59.90",
      salePrice: "$39.90",
      image: productImages.product2
    },
    {
      id: 3,
      name: "Men's Perfume",
      originalPrice: "$79.90",
      salePrice: "$59.90",
      image: productImages.product3
    },
    {
      id: 4,
      name: "Cotton Fabric",
      originalPrice: "$35.00/meter",
      salePrice: "$25.00/meter",
      image: productImages.product4
    },
    {
      id: 5,
      name: "Wool Sweater",
      originalPrice: "$69.90",
      salePrice: "$49.90",
      image: productImages.product5
    },
    {
      id: 6,
      name: "Linen Shirt",
      originalPrice: "$45.90",
      salePrice: "$32.90",
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
        <Text style={styles.pageTitle}>Sale Items</Text>
        <Text style={styles.pageSubtitle}>Limited time offers - Don't miss out!</Text>
      </View>

      {/* Products Grid */}
      <View style={styles.productsGrid}>
        {products.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <View style={styles.saleBadge}>
              <Text style={styles.saleBadgeText}>SALE</Text>
            </View>
            <Image 
              source={product.image} 
              style={styles.productImage}
              resizeMode="cover"
            />
            <Text style={styles.productTitle}>{product.name}</Text>
            <Text style={styles.originalPrice}>{product.originalPrice}</Text>
            <Text style={styles.salePrice}>{product.salePrice}</Text>
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
    position: 'relative',
  },
  saleBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  saleBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
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
  originalPrice: {
    fontSize: 11,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  salePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF4444',
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

export default SaleScreen;