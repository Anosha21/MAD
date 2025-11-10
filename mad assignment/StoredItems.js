// src/components/StoredItems.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/styles';

const StoredItems = ({ storedItems, clearAllData }) => {
  if (storedItems.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="folder-open-outline" size={64} color="#ccc" />
        <Text style={styles.emptyStateText}>No data stored yet</Text>
        <Text style={styles.emptyStateSubtext}>
          Use the store tab to save some data
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.storedItemsSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Stored Items ({storedItems.length})</Text>
        <TouchableOpacity onPress={clearAllData}>
          <Text style={styles.clearAllText}>Clear All</Text>
        </TouchableOpacity>
      </View>
      {storedItems.map(([itemKey, itemValue], index) => (
        <View key={index} style={styles.storedItem}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemKey}>{itemKey}</Text>
            <Text style={styles.itemValue}>{itemValue}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default StoredItems;