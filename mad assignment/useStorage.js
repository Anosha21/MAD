// src/hooks/useStorage.js
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { StorageService } from '../services/StorageService';

export const useStorage = () => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [fetchedValue, setFetchedValue] = useState('');
  const [storedItems, setStoredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('store');

  // Load all items on app start
  useEffect(() => {
    loadAllItems();
  }, []);

  const loadAllItems = async () => {
    const result = await StorageService.getAllItems();
    if (result.success) {
      setStoredItems(result.data);
    }
  };

  // Save data
  const storeData = async () => {
    if (!key.trim()) {
      Alert.alert('Missing Key', 'Please enter a key');
      return;
    }
    if (!value.trim()) {
      Alert.alert('Missing Value', 'Please enter a value');
      return;
    }

    setLoading(true);
    const result = await StorageService.saveData(key, value);
    Alert.alert(result.success ? 'Success' : 'Error', result.message);
    
    if (result.success) {
      setKey('');
      setValue('');
      loadAllItems();
    }
    setLoading(false);
  };

  // Fetch data
  const getData = async () => {
    if (!key.trim()) {
      Alert.alert('Missing Key', 'Please enter a key to fetch');
      return;
    }

    setLoading(true);
    const result = await StorageService.getData(key);
    
    if (result.success) {
      if (result.data !== null) {
        setFetchedValue(result.data);
      } else {
        Alert.alert('Not Found', `No data found for key: ${key}`);
        setFetchedValue('');
      }
    } else {
      Alert.alert('Error', result.message);
    }
    setLoading(false);
  };

  // Remove data
  const removeData = async () => {
    if (!key.trim()) {
      Alert.alert('Missing Key', 'Please enter a key to remove');
      return;
    }

    setLoading(true);
    const result = await StorageService.removeData(key);
    Alert.alert(result.success ? 'Success' : 'Error', result.message);
    
    if (result.success) {
      setFetchedValue('');
      setKey('');
      loadAllItems();
    }
    setLoading(false);
  };

  // Clear all data
  const clearAllData = async () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all stored data?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: async () => {
            const result = await StorageService.clearAllData();
            Alert.alert(result.success ? 'Success' : 'Error', result.message);
            if (result.success) {
              setStoredItems([]);
              setFetchedValue('');
              setKey('');
            }
          }
        }
      ]
    );
  };

  // Handle action based on active tab
  const handleAction = () => {
    if (activeTab === 'store') return storeData();
    if (activeTab === 'fetch') return getData();
    if (activeTab === 'remove') return removeData();
  };

  return {
    // States
    key, setKey,
    value, setValue,
    fetchedValue,
    storedItems,
    loading,
    activeTab, setActiveTab,
    
    // Functions
    handleAction,
    clearAllData
  };
};