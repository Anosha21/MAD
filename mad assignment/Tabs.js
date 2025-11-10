// src/components/Tabs.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/styles';

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'store', icon: 'save-outline', label: 'Store' },
    { id: 'fetch', icon: 'download-outline', label: 'Fetch' },
    { id: 'remove', icon: 'trash-outline', label: 'Remove' }
  ];

  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.activeTab]}
          onPress={() => setActiveTab(tab.id)}
        >
          <Ionicons
            name={tab.icon}
            size={20}
            color={activeTab === tab.id ? '#007AFF' : '#666'}
          />
          <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Tabs;