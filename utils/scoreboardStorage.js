import { db } from './firebase';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';

const SCOREBOARD_DOC = 'scoreboard/stats';

export const getScoreboard = async () => {
  try {
    const docRef = doc(db, SCOREBOARD_DOC);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : { attempts: 0, wins: 0, losses: 0 };
  } catch (error) {
    console.error('Error fetching scoreboard:', error);
    return { attempts: 0, wins: 0, losses: 0 };
  }
};

export const updateScoreboard = async (isWin) => {
  try {
    const data = await getScoreboard();
    const newData = {
      attempts: (data.attempts || 0) + 1,
      wins: (data.wins || 0) + (isWin ? 1 : 0),
      losses: (data.losses || 0) + (!isWin ? 1 : 0)
    };
    await setDoc(doc(db, SCOREBOARD_DOC), newData);
  } catch (error) {
    console.error('Error updating scoreboard:', error);
  }
};

export const resetScoreboard = async () => {
  try {
    await setDoc(doc(db, SCOREBOARD_DOC), {
      attempts: 0,
      wins: 0,
      losses: 0
    });
  } catch (error) {
    console.error('Error resetting scoreboard:', error);
  }
};

export const recordTestResult = async ({ score, total, correctQuestions, wrongQuestions }) => {
  try {
    await addDoc(collection(db, 'tests'), {
      timestamp: serverTimestamp(),
      score,
      total,
      correctCount: correctQuestions.length,
      wrongCount: wrongQuestions.length,
      correctQuestions,
      wrongQuestions
    });
  } catch (error) {
    console.error('🔥 Error recording test:', error);
  }
};

export const getTestHistory = async () => {
  try {
    const q = query(collection(db, 'tests'), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error loading test history:', error);
    return [];
  }
};

export const clearTestHistory = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'tests'));
    const batchDeletions = snapshot.docs.map(d => deleteDoc(doc(db, 'tests', d.id)));
    await Promise.all(batchDeletions);
  } catch (error) {
    console.error('Error clearing test history:', error);
  }
};

// Save failed questions
export const saveFailedQuestions = async (questions) => {
  try {
    await setDoc(doc(db, 'failed', 'latest'), { questions });
  } catch (error) {
    console.error('Error saving failed questions:', error);
  }
};

// Get failed questions
export const getFailedQuestions = async () => {
  try {
    const docRef = doc(db, 'failed', 'latest');
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? snapshot.data().questions || [] : [];
  } catch (error) {
    console.error('Error loading failed questions:', error);
    return [];
  }
};
