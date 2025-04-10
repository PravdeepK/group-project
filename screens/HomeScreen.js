import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>G2 Driving Test</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Test')}
        >
          <Text style={styles.buttonText}>Start Test</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Scoreboard')}
        >
          <Text style={styles.secondaryButtonText}>Scoreboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5', // Light gray background
    padding: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 40
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center'
  },
  primaryButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    marginBottom: 15
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    padding: 15,
    borderWidth: 2,
    borderColor: '#3498db',
    borderRadius: 8,
    width: '80%'
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16
  },
  secondaryButtonText: {
    color: '#3498db',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default HomeScreen;