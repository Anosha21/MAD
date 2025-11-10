// src/components/InputSection.js
import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { styles } from '../styles/styles';

const InputSection = ({ activeTab, keyValue, setKey, value, setValue }) => {
  return (
    <View style={styles.inputSection}>
      <Text style={styles.sectionTitle}>Key</Text>
      <TextInput
        placeholder="Enter key (e.g., userToken, theme, language)"
        style={styles.input}
        value={keyValue}
        onChangeText={setKey}
        placeholderTextColor="#999"
      />

      {activeTab === 'store' && (
        <>
          <Text style={styles.sectionTitle}>Value</Text>
          <TextInput
            placeholder="Enter value to store"
            style={[styles.input, styles.textArea]}
            value={value}
            onChangeText={setValue}
            multiline
            numberOfLines={3}
            placeholderTextColor="#999"
          />
        </>
      )}
    </View>
  );
};

export default InputSection;