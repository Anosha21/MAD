import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Global from '../globalstyle/style';

export default function ProfileScreen({ navigation, route }) {
  const { name } = route.params || { name: 'Guest' };

  return (
    <View style={Global.styles.container}>
      <Image
        source={{ uri: 'https://i.pinimg.com/564x/ed/13/0b/ed130b0b303268b9dc14c8283c1c7cf2.jpg' }}
        style={Global.styles.profileImg}
      />
      <Text style={Global.styles.heading}>Hello, {name}!</Text>
      <Text style={Global.styles.subText}>
        Here’s your cozy corner ☕ — your profile space in the Coffee App.
      </Text>

      <TouchableOpacity style={Global.styles.button} onPress={() => navigation.goBack()}>
        <Text style={Global.styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}
