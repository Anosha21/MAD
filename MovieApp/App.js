// App.js
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import MovieScreen from './MovieScreen';

export default function App() {
  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#0f172a"
      />
      <SafeAreaView style={{ flex: 1 }}>
        <MovieScreen />
      </SafeAreaView>
    </>
  );
}