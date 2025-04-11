import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { db } from '../utils/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { resetScoreboard, clearTestHistory } from '../utils/scoreboardStorage';

const ScoreboardScreen = () => {
  const [scoreboard, setScoreboard] = useState({ attempts: 0, wins: 0, losses: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'scoreboard', 'stats');

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setScoreboard(docSnap.data());
      } else {
        setScoreboard({ attempts: 0, wins: 0, losses: 0 });
      }
      setLoading(false);
    }, (error) => {
      console.error('Error loading scoreboard:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleResetConfirmed = async () => {
    try {
      await resetScoreboard();
      await clearTestHistory();
      setScoreboard({ attempts: 0, wins: 0, losses: 0 });
    } catch (error) {
      console.error('Failed to reset stats and history:', error);
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Stats?',
      'This will erase all test attempts and scoreboard stats permanently.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: handleResetConfirmed }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2c3e50" />
      </View>
    );
  }

  const winRate = scoreboard.attempts > 0
    ? ((scoreboard.wins / scoreboard.attempts) * 100).toFixed(1) + '%'
    : '0%';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Statistics</Text>

      <View style={styles.statsBox}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Attempts:</Text>
          <Text style={styles.statValue}>{scoreboard.attempts}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Wins:</Text>
          <Text style={styles.statValue}>{scoreboard.wins}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Losses:</Text>
          <Text style={styles.statValue}>{scoreboard.losses}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Win Rate:</Text>
          <Text style={styles.statValue}>{winRate}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetButtonText}>Reset Stats</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f2f5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 30,
    textAlign: 'center',
  },
  statsBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  statLabel: {
    fontSize: 18,
    color: '#7f8c8d',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  resetButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  resetButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ScoreboardScreen;