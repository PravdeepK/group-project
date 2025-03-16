import AsyncStorage from '@react-native-async-storage/async-storage';

const SCOREBOARD_KEY = 'scoreboard';

export const getScoreboard = async () => {
    try {
        const scoreboard = await AsyncStorage.getItem(SCOREBOARD_KEY);
        return scoreboard ? JSON.parse(scoreboard) : { attempts: 0, wins: 0 };
    } catch (error) {
        console.error('Error loading scoreboard:', error);
        return { attempts: 0, wins: 0 };
    }
};

export const updateScoreboard = async (isWin) => {
    try {
        const scoreboard = await getScoreboard();
        scoreboard.attempts += 1;
        if (isWin) {
            scoreboard.wins += 1;
        }
        await AsyncStorage.setItem(SCOREBOARD_KEY, JSON.stringify(scoreboard));
    } catch (error) {
        console.error('Error updating scoreboard:', error);
    }
};

export const resetScoreboard = async () => {
    try {
        await AsyncStorage.removeItem(SCOREBOARD_KEY);
    } catch (error) {
        console.error('Error resetting scoreboard:', error);
    }
};
