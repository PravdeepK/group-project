import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>G1 Test</Text>
            <Button title="Scoreboard" onPress={() => navigation.navigate('Scoreboard')} />
            <Button title="Start Test" onPress={() => navigation.navigate('Test')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f8f8' },
    title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
});

export default HomeScreen;
