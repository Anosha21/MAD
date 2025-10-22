import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

const WinterScreen = ({ navigation }) => {
  // Import category images
  const categoryImages = {
    pret: require('../../assets/image/winter-pret.jpg'),
    unstitched: require('../../assets/image/winter-unstitched.jpg'),
  };

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
        <Text style={styles.pageTitle}>Winter Collection</Text>
        <Text style={styles.pageSubtitle}>Stay warm and stylish this season</Text>
      </View>

      {/* Categories */}
      <View style={styles.categories}>
        <TouchableOpacity 
          style={styles.categoryCard}
          onPress={() => navigation.navigate('WinterPret')}
        >
          <Image 
            source={categoryImages.pret} 
            style={styles.categoryImage}
            resizeMode="cover"
          />
          <Text style={styles.categoryName}>Pret</Text>
          <Text style={styles.categoryDescription}>Ready-to-wear collection</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.categoryCard}
          onPress={() => navigation.navigate('WinterUnstitched')}
        >
          <Image 
            source={categoryImages.unstitched} 
            style={styles.categoryImage}
            resizeMode="cover"
          />
          <Text style={styles.categoryName}>Unstitched</Text>
          <Text style={styles.categoryDescription}>Custom tailoring fabrics</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Keep all your existing styles exactly as they are
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
    padding: 30,
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6B21A8',
    marginBottom: 8,
    textAlign: 'center',
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#1F2937',
    textAlign: 'center',
    opacity: 0.7,
  },
  categories: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  categoryCard: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#6B21A8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  categoryImage: {
    width: 120,
    height: 120,
    backgroundColor: '#E9D5FF',
    borderRadius: 12,
    marginBottom: 15,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B21A8',
    marginBottom: 5,
    textAlign: 'center',
  },
  categoryDescription: {
    fontSize: 12,
    color: '#1F2937',
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default WinterScreen;