import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button } from 'react-native';
import questionsData from '../data/questions.json';

const TestScreen = ({ navigation }) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            const shuffledQuestions = [...questionsData].sort(() => Math.random() - 0.5);
            setQuestions(shuffledQuestions);
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>G1 Test Questions</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={questions}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.questionContainer}>
                            <Text style={styles.questionText}>{item.question}</Text>
                            {item.options.map((option, index) => (
                                <Text key={index} style={styles.optionText}>• {option}</Text>
                            ))}
                        </View>
                    )}
                />
            )}
            <Button title="Back to Home" onPress={() => navigation.goBack()} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f8f8f8' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    questionContainer: { padding: 15, backgroundColor: '#fff', marginVertical: 5, borderRadius: 5 },
    questionText: { fontSize: 18 },
    optionText: { fontSize: 16, marginLeft: 10, marginTop: 5 }
});

export default TestScreen;
