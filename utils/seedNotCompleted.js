//imports everything from the questions.json file

import questions from '../data/questions.json';
import { getNotCompletedQuestions, saveNotCompletedQuestions } from './scoreboardStorage';

//only runs on first load
// to seed the notCompleted questions
// with all questions from the questions.json file

export const seedNotCompleted = async () => {
  try {
    const existing = await getNotCompletedQuestions();

    // Check if there are already questions in 'notCompleted'
    // If there are, we skip seeding
    // to avoid overwriting them
    if (existing.length > 0) {
      console.log('🟡 notCompleted already seeded, skipping...');
      return;
    }

    //If no questions are found in 'notCompleted', we save the full list
    await saveNotCompletedQuestions(questions);
    console.log('✅ Seeded notCompleted with all questions');
  } catch (error) {
    console.error('❌ Failed to seed notCompleted questions:', error);
  }
};
