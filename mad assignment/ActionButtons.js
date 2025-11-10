// src/components/ActionButtons.js
import React from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/styles';

const ActionButtons = ({ activeTab, loading, onAction }) => {
  const getButtonConfig = () => {
    switch (activeTab) {
      case 'store':
        return { icon: 'save', text: 'Store Data', color: '#007AFF' };
      case 'fetch':
        return { icon: 'download', text: 'Fetch Data', color: '#007AFF' };
      case 'remove':
        return { icon: 'trash', text: 'Remove Data', color: '#ff3b30' };
      default:
        return { icon: 'save', text: 'Store Data', color: '#007AFF' };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <View style={styles.actionButtonContainer}>
      <TouchableOpacity 
        style={[
          styles.actionButton,
          activeTab === 'remove' && styles.deleteButton,
          loading && styles.disabledButton
        ]} 
        onPress={onAction}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons 
              name={buttonConfig.icon} 
              size={20} 
              color="#fff" 
            />
            <Text style={styles.actionButtonText}>
              {buttonConfig.text}
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Suggested Keys */}
      <View style={styles.suggestedKeysContainer}>
        <Text style={styles.sectionTitle}>Suggested Keys</Text>
        <View style={styles.suggestedKeysRow}>
          <TouchableOpacity 
            style={styles.suggestedKey} 
            onPress={() => setKey('userToken')}
          >
            <Text style={styles.suggestedKeyText}>userToken</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.suggestedKey} 
            onPress={() => setKey('theme')}
          >
            <Text style={styles.suggestedKeyText}>theme</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.suggestedKey} 
            onPress={() => setKey('language')}
          >
            <Text style={styles.suggestedKeyText}>language</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ActionButtons;