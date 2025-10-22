import { StyleSheet } from 'react-native';

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,                    // number (correct)
    backgroundColor: '#F8F8F8', // string (correct)
    alignItems: 'center',       // string (correct)
    justifyContent: 'center',   // string (correct)
    padding: 20,                // number (correct)
  },
  
  titleText: {
    fontSize: 28,               // number (correct)
    fontWeight: 'bold',         // string (correct)
    color: '#4A2B0F',          // string (correct)
    marginBottom: 20,           // number (correct)
    textAlign: 'center',        // string (correct)
  },
  
  subtitleText: {
    fontSize: 16,               // number (correct)
    color: '#666',              // string (correct)
    marginBottom: 30,           // number (correct)
    textAlign: 'center',        // string (correct)
    lineHeight: 22,             // number (correct)
  },
  
  button: {
    backgroundColor: '#8B4513', // string (correct)
    padding: 15,                // number (correct)
    borderRadius: 25,           // number (correct)
    marginVertical: 10,         // number (correct)
    width: '80%',               // string (correct)
    alignItems: 'center',       // string (correct)
  },
  
  buttonText: {
    color: 'white',             // string (correct)
    fontSize: 18,               // number (correct)
    fontWeight: 'bold',         // string (correct)
  },
  
  coffeeImage: {
    width: 150,                 // number (correct)
    height: 150,                // number (correct)
    marginBottom: 30,           // number (correct)
  },
  
  coffeeItem: {
    backgroundColor: 'white',   // string (correct)
    padding: 15,                // number (correct)
    borderRadius: 10,           // number (correct)
    marginVertical: 8,          // number (correct)
    width: '100%',              // string (correct)
    shadowColor: '#000',        // string (correct)
    shadowOffset: { width: 0, height: 2 }, // object (correct)
    shadowOpacity: 0.1,         // number (correct)
    shadowRadius: 4,            // number (correct)
    elevation: 3,               // number (correct)
  },
  
  coffeeName: {
    fontSize: 18,               // number (correct)
    fontWeight: 'bold',         // string (correct)
    color: '#4A2B0F',          // string (correct)
  },
  
  coffeeDescription: {
    fontSize: 14,               // number (correct)
    color: '#666',              // string (correct)
    marginTop: 5,               // number (correct)
  },
  
  coffeePrice: {
    fontSize: 16,               // number (correct)
    fontWeight: 'bold',         // string (correct)
    color: '#8B4513',          // string (correct)
    marginTop: 5,               // number (correct)
  }
});