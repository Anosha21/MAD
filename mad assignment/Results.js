// src/components/Results.js
import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/styles';

const Results = ({ activeTab, fetchedValue }) => {
  if (activeTab !== 'fetch' || !fetchedValue) return null;
  
  return (
    <View style={styles.resultCard}>
      <Text style={styles.resultTitle}>Fetched Value</Text>
      <View style={styles.resultValueContainer}>
        <Text style={styles.resultValue}>{fetchedValue}</Text>
      </View>
    </View>
  );
};

export default Results;