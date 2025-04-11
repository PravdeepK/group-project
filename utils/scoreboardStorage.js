import { db } from './firebase';
import questions from '../data/questions.json';
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

// scoreboard stats

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

// update scoreboard stats
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

//reset scoreboard stats
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

//test history

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

//test history updater
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

//clear test history
export const clearTestHistory = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'tests'));
    const batchDeletions = snapshot.docs.map(d => deleteDoc(doc(db, 'tests', d.id)));
    await Promise.all(batchDeletions);
  } catch (error) {
    console.error('Error clearing test history:', error);
  }
};

//failed questions

export const saveFailedQuestions = async (newFails) => {
  try {
    const docRef = doc(db, 'failed', 'latest');
    const snapshot = await getDoc(docRef);
    let currentFails = snapshot.exists() ? snapshot.data().questions || [] : [];

    const merged = [...currentFails];
    newFails.forEach(q => {
      if (!merged.some(existing => existing.id === q.id)) {
        merged.push(q);
      }
    });

    await setDoc(docRef, { questions: merged });
  } catch (error) {
    console.error('Error saving failed questions:', error);
  }
};

// get failed questions
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

// update failed questions after retry
export const updateFailedQuestionsAfterRetry = async (remainingFailed) => {
  try {
    await setDoc(doc(db, 'failed', 'latest'), { questions: remainingFailed });
  } catch (error) {
    console.error('Error updating failed questions after retry:', error);
  }
};

//completed questions

export const saveCompletedQuestions = async (questions) => {
  try {
    await setDoc(doc(db, 'completed', 'latest'), { questions });
  } catch (error) {
    console.error('Error saving completed questions:', error);
  }
};

//Clears all completed questions (used when Reset is pressed)
export const clearCompletedQuestions = async () => {
  try {
    await setDoc(doc(db, 'completed', 'latest'), { questions: [] });
    console.log('🧹 Cleared completed questions');
  } catch (error) {
    console.error('Error clearing completed questions:', error);
  }
};

// not completed questions

export const saveNotCompletedQuestions = async (questions) => {
  try {
    await setDoc(doc(db, 'notCompleted', 'latest'), { questions });
  } catch (error) {
    console.error('Error saving not completed questions:', error);
  }
};

// get not completed questions
export const getNotCompletedQuestions = async () => {
  try {
    const docRef = doc(db, 'notCompleted', 'latest');
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? snapshot.data().questions || [] : [];
  } catch (error) {
    console.error('Error loading not completed questions:', error);
    return [];
  }
};

// update not completed questions after attempt
export const updateNotCompletedAfterAttempt = async (attemptedQuestions) => {
  try {
    const all = await getNotCompletedQuestions();
    const updated = all.filter(q => !attemptedQuestions.some(a => a.id === q.id));
    await setDoc(doc(db, 'notCompleted', 'latest'), { questions: updated });
  } catch (error) {
    console.error('Error updating not completed questions:', error);
  }
};

// reset not completed questions
export const resetNotCompletedQuestions = async () => {
  try {
    await setDoc(doc(db, 'notCompleted', 'latest'), { questions });
    console.log('🔄 Reset all questions to not completed');
  } catch (error) {
    console.error('Error resetting notCompleted questions:', error);
  }
};
