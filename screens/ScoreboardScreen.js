import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ScoreboardScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Scoreboard</Text>
            <Text>Coming soon...</Text>
            <Button title="Back to Home" onPress={() => navigation.goBack()} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f8f8' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
});

export default ScoreboardScreen;
