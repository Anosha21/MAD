import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Global from '../globalstyle/style';

export default function HomeScreen({ navigation }) {
  return (
    <View style={Global.styles.container}>
      <Text style={Global.styles.heading}>Welcome to MyCoffeeApp ☕</Text>

      <Image
        source={{ uri: 'https://i.pinimg.com/564x/56/5c/5f/565c5fd5b7a48b5b45f09c702f947423.jpg' }}
        style={Global.styles.image}
      />

      <Text style={Global.styles.subText}>
        Enjoy your daily cup of coffee with love & aroma.
      </Text>

      <TouchableOpacity
        style={Global.styles.button}
        onPress={() => navigation.navigate('Profile', { name: 'Anosha' })}
      >
        <Text style={Global.styles.buttonText}>Go to Profile</Text>
      </TouchableOpacity>
    </View>
  );
}
