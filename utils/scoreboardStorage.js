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

// Constants
const SCOREBOARD_DOC = 'scoreboard/stats';

//Fetch scoreboard stats from Firestore
//If missing, return default values
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

// Update scoreboard stats in Firestore
// Increment attempts, wins, and losses based on the game result
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

// Reset scoreboard stats in Firestore
// Set attempts, wins, and losses to 0
// only happens when user presses the reset button in the scoreboard screen
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

// Save test results to Firestore
// Add a new document to the 'tests' collection
// with the test result data
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

// Fetch test history from Firestore
// Get all documents from the 'tests' collection
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

// Clear test history from Firestore
// Delete all documents from the 'tests' collection
// only happens when button is pressed 
export const clearTestHistory = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'tests'));
    const batchDeletions = snapshot.docs.map(d => deleteDoc(doc(db, 'tests', d.id)));
    await Promise.all(batchDeletions);
  } catch (error) {
    console.error('Error clearing test history:', error);
  }
};

// Save failed questions to Firestore
// Add new failed questions to the 'failed' collection
// If the document doesn't exist, create it
// If it exists, merge the new questions with the existing ones
// also removes duplicates
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

// Fetch failed questions from Firestore
// Get the latest failed questions from the 'failed' collection
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

// Save completed questions to Firestore
// Add new completed questions to the 'completed' collection
// If the document doesn't exist, create it
export const saveCompletedQuestions = async (questions) => {
  try {
    await setDoc(doc(db, 'completed', 'latest'), { questions });
  } catch (error) {
    console.error('Error saving completed questions:', error);
  }
};

// Fetch completed questions from Firestore
// Get the latest completed questions from the 'completed' collection
export const updateFailedQuestionsAfterRetry = async (remainingFailed) => {
  try {
    await setDoc(doc(db, 'failed', 'latest'), { questions: remainingFailed });
  } catch (error) {
    console.error('Error updating failed questions after retry:', error);
  }
};

// Save not completed questions to Firestore
// Add new not completed questions to the 'notCompleted' collection
export const saveNotCompletedQuestions = async (questions) => {
  try {
    await setDoc(doc(db, 'notCompleted', 'latest'), { questions });
  } catch (error) {
    console.error('Error saving not completed questions:', error);
  }
};

// Fetch not completed questions from Firestore
// Get the latest not completed questions from the 'notCompleted' collection
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

// Update not completed questions after an attempt
// Remove attempted questions from the not completed list
export const updateNotCompletedAfterAttempt = async (attemptedQuestions) => {
  try {
    const all = await getNotCompletedQuestions();
    const updated = all.filter(q => !attemptedQuestions.some(a => a.id === q.id));
    await setDoc(doc(db, 'notCompleted', 'latest'), { questions: updated });
  } catch (error) {
    console.error('Error updating not completed questions:', error);
  }
};

// reset all questions to not completed
export const resetNotCompletedQuestions = async () => {
  try {
    await setDoc(doc(db, 'notCompleted', 'latest'), { questions });
    console.log('🔄 Reset all questions to not completed');
  } catch (error) {
    console.error('Error resetting notCompleted questions:', error);
  }
};
