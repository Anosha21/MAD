// src/services/StorageService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageService = {
  // Save data
  async saveData(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
      return { success: true, message: 'Data saved successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to save data' };
    }
  },

  // Get data
  async getData(key) {
    try {
      const data = await AsyncStorage.getItem(key);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: 'Failed to fetch data' };
    }
  },

  // Remove data
  async removeData(key) {
    try {
      await AsyncStorage.removeItem(key);
      return { success: true, message: 'Data removed successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to remove data' };
    }
  },

  // Get all items
  async getAllItems() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);
      return { success: true, data: items.filter(([_, value]) => value !== null) };
    } catch (error) {
      return { success: false, message: 'Failed to load items' };
    }
  },

  // Clear all data
  async clearAllData() {
    try {
      await AsyncStorage.clear();
      return { success: true, message: 'All data cleared' };
    } catch (error) {
      return { success: false, message: 'Failed to clear data' };
    }
  }
};