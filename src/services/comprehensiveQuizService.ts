import { Deck } from '@/types';
import { generateComprehensiveQuizSet, ComprehensiveQuizSet, getQuizStatistics } from '@/utils/comprehensiveQuizGenerator';

/**
 * Comprehensive Quiz Service
 * Manages generation, storage, and retrieval of comprehensive quiz sets for all decks
 */

export interface ComprehensiveQuizData {
  deckId: string;
  deckName: string;
  quizSet: ComprehensiveQuizSet;
  generatedAt: Date;
  lastAccessed?: Date;
  accessCount: number;
  statistics: ReturnType<typeof getQuizStatistics>;
}

class ComprehensiveQuizService {
  private quizData: Map<string, ComprehensiveQuizData> = new Map();
  private isGenerating: boolean = false;
  private generationProgress: { current: number; total: number; deckName: string } | null = null;

  /**
   * Generate comprehensive quiz sets for all decks
   */
  async generateAllQuizSets(decks: Deck[], questionsPerCard: number = 3): Promise<ComprehensiveQuizData[]> {
    if (this.isGenerating) {
      throw new Error('Quiz generation already in progress');
    }

    this.isGenerating = true;
    this.generationProgress = { current: 0, total: decks.length, deckName: '' };

    try {
      const results: ComprehensiveQuizData[] = [];

      for (let i = 0; i < decks.length; i++) {
        const deck = decks[i];
        this.generationProgress = { current: i + 1, total: decks.length, deckName: deck.name };

        console.log(`Generating comprehensive quiz set for deck: ${deck.name} (${i + 1}/${decks.length})`);

        // Generate quiz set for this deck
        const quizSet = generateComprehensiveQuizSet(deck, questionsPerCard);
        const statistics = getQuizStatistics(quizSet);

        const quizData: ComprehensiveQuizData = {
          deckId: deck.id,
          deckName: deck.name,
          quizSet,
          generatedAt: new Date(),
          accessCount: 0,
          statistics
        };

        // Store in memory
        this.quizData.set(deck.id, quizData);
        results.push(quizData);

        // Add small delay to prevent blocking
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      console.log(`Successfully generated comprehensive quiz sets for ${decks.length} decks`);
      return results;

    } finally {
      this.isGenerating = false;
      this.generationProgress = null;
    }
  }

  /**
   * Generate quiz set for a specific deck
   */
  async generateQuizSetForDeck(deck: Deck, questionsPerCard: number = 3): Promise<ComprehensiveQuizData> {
    console.log(`Generating comprehensive quiz set for deck: ${deck.name}`);

    const quizSet = generateComprehensiveQuizSet(deck, questionsPerCard);
    const statistics = getQuizStatistics(quizSet);

    const quizData: ComprehensiveQuizData = {
      deckId: deck.id,
      deckName: deck.name,
      quizSet,
      generatedAt: new Date(),
      accessCount: 0,
      statistics
    };

    // Store in memory
    this.quizData.set(deck.id, quizData);

    console.log(`Generated ${quizSet.totalQuestions} questions for deck: ${deck.name}`);
    return quizData;
  }

  /**
   * Get quiz set for a specific deck
   */
  getQuizSetForDeck(deckId: string): ComprehensiveQuizData | null {
    const quizData = this.quizData.get(deckId);
    
    if (quizData) {
      // Update access statistics
      quizData.lastAccessed = new Date();
      quizData.accessCount++;
    }

    return quizData || null;
  }

  /**
   * Get all available quiz sets
   */
  getAllQuizSets(): ComprehensiveQuizData[] {
    return Array.from(this.quizData.values());
  }

  /**
   * Get quiz questions for a specific deck
   */
  getQuizQuestionsForDeck(deckId: string): ComprehensiveQuizSet['questions'] | null {
    const quizData = this.quizData.get(deckId);
    return quizData?.quizSet.questions || null;
  }

  /**
   * Get quiz statistics for a specific deck
   */
  getQuizStatisticsForDeck(deckId: string): ComprehensiveQuizData['statistics'] | null {
    const quizData = this.quizData.get(deckId);
    return quizData?.statistics || null;
  }

  /**
   * Check if quiz set exists for a deck
   */
  hasQuizSetForDeck(deckId: string): boolean {
    return this.quizData.has(deckId);
  }

  /**
   * Get generation progress
   */
  getGenerationProgress(): { current: number; total: number; deckName: string } | null {
    return this.generationProgress;
  }

  /**
   * Check if generation is in progress
   */
  isGenerationInProgress(): boolean {
    return this.isGenerating;
  }

  /**
   * Remove quiz set for a specific deck
   */
  removeQuizSetForDeck(deckId: string): boolean {
    return this.quizData.delete(deckId);
  }

  /**
   * Clear all quiz sets
   */
  clearAllQuizSets(): void {
    this.quizData.clear();
  }

  /**
   * Get summary of all quiz sets
   */
  getQuizSetsSummary(): {
    totalDecks: number;
    totalQuestions: number;
    averageQuestionsPerDeck: number;
    questionTypes: string[];
    difficultyDistribution: { A1: number; A2: number; B1: number; B2: number };
  } {
    const quizSets = Array.from(this.quizData.values());
    
    if (quizSets.length === 0) {
      return {
        totalDecks: 0,
        totalQuestions: 0,
        averageQuestionsPerDeck: 0,
        questionTypes: [],
        difficultyDistribution: { A1: 0, A2: 0, B1: 0, B2: 0 }
      };
    }

    const totalQuestions = quizSets.reduce((sum, quizData) => sum + quizData.quizSet.totalQuestions, 0);
    const averageQuestionsPerDeck = totalQuestions / quizSets.length;

    // Collect all question types
    const allQuestionTypes = new Set<string>();
    quizSets.forEach(quizData => {
      quizData.quizSet.questionTypes.forEach(type => allQuestionTypes.add(type));
    });

    // Aggregate difficulty distribution
    const difficultyDistribution = { A1: 0, A2: 0, B1: 0, B2: 0 };
    quizSets.forEach(quizData => {
      Object.entries(quizData.quizSet.difficultyDistribution).forEach(([level, count]) => {
        difficultyDistribution[level as keyof typeof difficultyDistribution] += count;
      });
    });

    return {
      totalDecks: quizSets.length,
      totalQuestions,
      averageQuestionsPerDeck: Math.round(averageQuestionsPerDeck * 100) / 100,
      questionTypes: Array.from(allQuestionTypes),
      difficultyDistribution
    };
  }

  /**
   * Get recently accessed quiz sets
   */
  getRecentlyAccessedQuizSets(limit: number = 5): ComprehensiveQuizData[] {
    return Array.from(this.quizData.values())
      .filter(quizData => quizData.lastAccessed)
      .sort((a, b) => (b.lastAccessed!.getTime() - a.lastAccessed!.getTime()))
      .slice(0, limit);
  }

  /**
   * Get most accessed quiz sets
   */
  getMostAccessedQuizSets(limit: number = 5): ComprehensiveQuizData[] {
    return Array.from(this.quizData.values())
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, limit);
  }

  /**
   * Get quiz sets by difficulty level
   */
  getQuizSetsByDifficulty(difficulty: 'A1' | 'A2' | 'B1' | 'B2'): ComprehensiveQuizData[] {
    return Array.from(this.quizData.values()).filter(quizData => {
      const distribution = quizData.quizSet.difficultyDistribution;
      return distribution[difficulty] > 0;
    });
  }

  /**
   * Get quiz sets by question type
   */
  getQuizSetsByQuestionType(questionType: string): ComprehensiveQuizData[] {
    return Array.from(this.quizData.values()).filter(quizData => {
      return quizData.quizSet.questionTypes.includes(questionType as any);
    });
  }

  /**
   * Export quiz data for backup
   */
  exportQuizData(): string {
    const data = Array.from(this.quizData.entries());
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import quiz data from backup
   */
  importQuizData(data: string): void {
    try {
      const parsedData = JSON.parse(data);
      this.quizData.clear();
      
      parsedData.forEach(([deckId, quizData]: [string, ComprehensiveQuizData]) => {
        this.quizData.set(deckId, quizData);
      });
      
      console.log(`Imported ${this.quizData.size} quiz sets`);
    } catch (error) {
      console.error('Failed to import quiz data:', error);
      throw new Error('Invalid quiz data format');
    }
  }
}

// Export singleton instance
export const comprehensiveQuizService = new ComprehensiveQuizService(); 