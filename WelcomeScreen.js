import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: '#F8F8F8',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20 
    }}>
      <Text style={{ 
        fontSize: 28, 
        fontWeight: 'bold', 
        color: '#4A2B0F',
        marginBottom: 20,
        textAlign: 'center'
      }}>
        Welcome to Coffee Delight
      </Text>
      
      <TouchableOpacity 
        style={{
          backgroundColor: '#8B4513',
          padding: 15,
          borderRadius: 25,
          marginVertical: 10,
          width: '80%',
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={{
          color: 'white',
          fontSize: 18,
          fontWeight: 'bold',
        }}>
          Get Started
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;