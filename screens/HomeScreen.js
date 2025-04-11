import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://drivingexam.ca/wp-content/uploads/2023/12/DrivingExam-Logo.png' }}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>G1 Driving Test</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Test')}
        >
          <Text style={styles.buttonText}>Start Test</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('RetryFailed')}
        >
          <Text style={styles.buttonText}>Retake Failed Questions</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Scoreboard')}
        >
          <Text style={styles.secondaryButtonText}>Scoreboard</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('TestHistory')}
        >
          <Text style={styles.secondaryButtonText}>View Test History</Text>
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
    backgroundColor: '#f0f2f5',
    padding: 20
  },
  logo: {
    width: 600,
    height: 175,
    marginBottom: 25,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 40,
    textAlign: 'center'
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
    width: '80%',
    marginTop: 10
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
