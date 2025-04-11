import questions from '../data/questions.json';
import { getNotCompletedQuestions, saveNotCompletedQuestions } from './scoreboardStorage';

export const seedNotCompleted = async () => {
  try {
    const existing = await getNotCompletedQuestions();
    if (existing.length > 0) {
      console.log('🟡 notCompleted already seeded, skipping...');
      return;
    }

    await saveNotCompletedQuestions(questions);
    console.log('✅ Seeded notCompleted with all questions');
  } catch (error) {
    console.error('❌ Failed to seed notCompleted questions:', error);
  }
};
