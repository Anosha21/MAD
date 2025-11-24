import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const HomeScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState('');
  const [note, setNote] = useState('');
  const [savedNote, setSavedNote] = useState('');

  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      setUserEmail(user.email);
      loadSavedNote();
    }
  }, []);

  const loadSavedNote = async () => {
    const user = auth().currentUser;
    if (user) {
      try {
        const doc = await firestore()
          .collection('users')
          .doc(user.uid)
          .get();
        
        if (doc.exists) {
          setSavedNote(doc.data().note || '');
        }
      } catch (error) {
        console.log('Error loading note:', error);
      }
    }
  };

  const saveToFirebase = async () => {
    const user = auth().currentUser;
    if (user && note) {
      try {
        await firestore()
          .collection('users')
          .doc(user.uid)
          .set({
            note: note,
            email: user.email,
          });
        
        setSavedNote(note);
        setNote('');
        Alert.alert('Success', 'Note saved to Firebase!');
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      // Navigation handled by App.js
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Text style={styles.userEmail}>Welcome: {userEmail}</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter your note"
        value={note}
        onChangeText={setNote}
      />
      
      <Button title="Save to Firebase" onPress={saveToFirebase} />
      
      {savedNote ? (
        <View style={styles.savedNoteContainer}>
          <Text style={styles.savedTitle}>Saved Note:</Text>
          <Text style={styles.savedNote}>{savedNote}</Text>
        </View>
      ) : null}
      
      <View style={styles.logoutButton}>
        <Button title="Logout" onPress={handleLogout} color="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  userEmail: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  savedNoteContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  savedTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  savedNote: {
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 50,
  },
});

export default HomeScreen;