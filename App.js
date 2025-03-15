import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { fetchQuestions } from './services/api';

const App = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getQuestions = async () => {
            const data = await fetchQuestions();
            setQuestions(data);
            setLoading(false);
        };
        getQuestions();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>G1 Practice Test</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={questions}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.questionContainer}>
                            <Text style={styles.questionText}>{item.question}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f8f8f8' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    questionContainer: { padding: 15, backgroundColor: '#fff', marginVertical: 5, borderRadius: 5 },
    questionText: { fontSize: 18 }
});

export default App;
