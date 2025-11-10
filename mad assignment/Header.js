// src/components/Header.js
import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/styles';

const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Storage Manager</Text>
      <Text style={styles.headerSubtitle}>AsyncStorage Demo</Text>
    </View>
  );
};

export default Header;