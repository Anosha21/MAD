// src/screens/StorageScreen.js
import React from 'react';
import { 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import { useStorage } from '../hooks/useStorage';
import Header from '../components/Header';
import Tabs from '../components/Tabs';
import InputSection from '../components/InputSection';
import ActionButtons from '../components/ActionButtons';
import Results from '../components/Results';
import StoredItems from '../components/StoredItems';
import { styles } from '../styles/styles';

export default function StorageScreen() {
  const storage = useStorage();

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Header />
      <Tabs activeTab={storage.activeTab} setActiveTab={storage.setActiveTab} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <InputSection 
          activeTab={storage.activeTab}
          keyValue={storage.key}
          setKey={storage.setKey}
          value={storage.value}
          setValue={storage.setValue}
        />
        
        <ActionButtons 
          activeTab={storage.activeTab}
          loading={storage.loading}
          onAction={storage.handleAction}
        />
        
        <Results 
          activeTab={storage.activeTab}
          fetchedValue={storage.fetchedValue}
        />
        
        <StoredItems 
          storedItems={storage.storedItems}
          clearAllData={storage.clearAllData}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}