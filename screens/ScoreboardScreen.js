import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { getScoreboard, resetScoreboard } from '../utils/scoreboardStorage';

const ScoreboardScreen = ({ navigation }) => {
    const [scoreboard, setScoreboard] = useState({ attempts: 0, wins: 0 });

    useEffect(() => {
        const loadScoreboard = async () => {
            const data = await getScoreboard();
            setScoreboard(data);
        };
        loadScoreboard();
    }, []);

    const handleReset = async () => {
        await resetScoreboard();
        setScoreboard({ attempts: 0, wins: 0 });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Scoreboard</Text>
            <Text style={styles.text}>Total Attempts: {scoreboard.attempts}</Text>
            <Text style={styles.text}>Wins: {scoreboard.wins}</Text>
            <Text style={styles.text}>Win Rate: {scoreboard.attempts > 0 ? ((scoreboard.wins / scoreboard.attempts) * 100).toFixed(2) + '%' : '0%'}</Text>
            <Button title="Reset Scoreboard" onPress={handleReset} />
            <Button title="Back to Home" onPress={() => navigation.goBack()} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f8f8' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
    text: { fontSize: 20, marginVertical: 5 }
});

export default ScoreboardScreen;
