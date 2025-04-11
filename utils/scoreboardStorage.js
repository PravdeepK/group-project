import { db } from './firebase';
import { ref, get, set, update } from 'firebase/database';

const SCOREBOARD_PATH = 'scoreboard';

export const getScoreboard = async () => {
  try {
    const snapshot = await get(ref(db, SCOREBOARD_PATH));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return { attempts: 0, wins: 0 };
    }
  } catch (error) {
    console.error('Error fetching scoreboard:', error);
    return { attempts: 0, wins: 0 };
  }
};

export const updateScoreboard = async (isWin) => {
  try {
    const data = await getScoreboard();
    const newData = {
      attempts: (data.attempts || 0) + 1,
      wins: (data.wins || 0) + (isWin ? 1 : 0)
    };

    await set(ref(db, SCOREBOARD_PATH), newData);
  } catch (error) {
    console.error('Error updating scoreboard:', error);
  }
};

export const resetScoreboard = async () => {
  try {
    await set(ref(db, SCOREBOARD_PATH), { attempts: 0, wins: 0 });
  } catch (error) {
    console.error('Error resetting scoreboard:', error);
  }
};
