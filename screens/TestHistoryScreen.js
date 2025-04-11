import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { getTestHistory } from '../utils/scoreboardStorage';

const TestHistoryScreen = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTests = async () => {
      const history = await getTestHistory();
      setTests(history);
      setLoading(false);
    };
    loadTests();
  }, []);

  // timestamp as a readable date
  const getFormattedDate = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return '';
    const date = timestamp.toDate();
    return date.toLocaleString();
  };

  // show each test result
  const renderTest = ({ item }) => (
    <View style={styles.testCard}>
      <Text style={styles.date}>{getFormattedDate(item.timestamp)}</Text>
      <Text style={styles.score}>
        Score: {item.score}/{item.total}
      </Text>
      <Text style={styles.details}>
        Correct: {item.correctCount} | Incorrect: {item.wrongCount}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2c3e50" />
      </View>
    );
  }

  // If no tests are found, show a message
  if (tests.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.noHistoryText}>No test history available.</Text>
      </View>
    );
  }

  // Render the test history
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test History</Text>
      <FlatList
        data={tests}
        keyExtractor={(item) => item.id}
        renderItem={renderTest}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f2f5'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50'
  },
  testCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2
  },
  date: {
    color: '#7f8c8d',
    fontSize: 14,
    marginBottom: 5
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  details: {
    fontSize: 16,
    color: '#34495e'
  },
  noHistoryText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center'
  }
});

export default TestHistoryScreen;
