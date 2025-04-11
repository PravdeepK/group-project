import { db } from './firebase';
import { collection, doc, addDoc, getDoc, getDocs, query, orderBy, setDoc, serverTimestamp } from 'firebase/firestore';

const SCOREBOARD_DOC = 'scoreboard/stats';

// ✅ Store/update global scoreboard (wins/attempts)
export const getScoreboard = async () => {
  try {
    const docRef = doc(db, SCOREBOARD_DOC);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
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
    await setDoc(doc(db, SCOREBOARD_DOC), newData);
  } catch (error) {
    console.error('Error updating scoreboard:', error);
  }
};

export const resetScoreboard = async () => {
  try {
    await setDoc(doc(db, SCOREBOARD_DOC), { attempts: 0, wins: 0 });
  } catch (error) {
    console.error('Error resetting scoreboard:', error);
  }
};

// ✅ Record detailed test result to Firestore
export const recordTestResult = async ({ score, total, correctQuestions, wrongQuestions }) => {
  try {
    const docRef = await addDoc(collection(db, 'tests'), {
      timestamp: serverTimestamp(),
      score,
      total,
      correctCount: correctQuestions.length,
      wrongCount: wrongQuestions.length,
      correctQuestions,
      wrongQuestions
    });
    console.log('✅ Test recorded with ID:', docRef.id);
  } catch (error) {
    console.error('🔥 Error recording test:', error);
  }
};

// ✅ Fetch full test history
export const getTestHistory = async () => {
  try {
    const q = query(collection(db, 'tests'), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error loading test history:', error);
    return [];
  }
};
