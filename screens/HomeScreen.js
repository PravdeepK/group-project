import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

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
          <Ionicons name="ios-school" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Start Test</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('RetryFailed')}
        >
          <MaterialIcons name="replay" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Retake Failed Questions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('TryNewQuestions')}
        >
          <Ionicons name="sparkles" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Try New Questions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Scoreboard')}
        >
          <FontAwesome name="bar-chart" size={16} color="#3498db" style={styles.icon} />
          <Text style={styles.secondaryButtonText}>Scoreboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('TestHistory')}
        >
          <FontAwesome name="history" size={16} color="#3498db" style={styles.icon} />
          <Text style={styles.secondaryButtonText}>View Test History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f2f5', padding: 20 },
  logo: { width: 600, height: 175, marginBottom: 25 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50', marginBottom: 40, textAlign: 'center' },
  buttonContainer: { width: '100%', alignItems: 'center' },
  primaryButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    padding: 15,
    borderWidth: 2,
    borderColor: '#3498db',
    borderRadius: 8,
    width: '80%',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 10 },
  secondaryButtonText: { color: '#3498db', fontWeight: 'bold', fontSize: 16, marginLeft: 10 },
  icon: { marginRight: 8 },
});

export default HomeScreen;
