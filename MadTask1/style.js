import { StyleSheet } from 'react-native';

const Colors = {
  coffee: '#6F4E37',
  cream: '#FFF8E7',
  textDark: '#3E2723',
  textLight: '#8D6E63',
  white: '#fff',
};

export default {
  Colors,
  styles: StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.cream,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    heading: {
      fontSize: 24,
      fontWeight: '700',
      color: Colors.coffee,
      marginBottom: 10,
      textAlign: 'center',
    },
    subText: {
      fontSize: 16,
      color: Colors.textLight,
      textAlign: 'center',
      marginBottom: 20,
      paddingHorizontal: 10,
    },
    button: {
      backgroundColor: Colors.coffee,
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 25,
      marginTop: 15,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 4,
    },
    buttonText: {
      color: Colors.white,
      fontWeight: '600',
      fontSize: 16,
    },
    image: {
      width: 200,
      height: 200,
      borderRadius: 100,
      marginBottom: 15,
    },
    profileImg: {
      width: 180,
      height: 180,
      borderRadius: 90,
      marginBottom: 15,
      borderWidth: 4,
      borderColor: Colors.coffee,
    },
  }),
};
