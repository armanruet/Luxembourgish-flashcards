#!/usr/bin/env node

/**
 * Comprehensive Quiz Generator Script
 * Generates 2-3 high-quality quiz questions per flashcard for all decks
 */

const fs = require('fs');
const path = require('path');

// Import the comprehensive quiz generator
const { generateComprehensiveQuizSet } = require('./src/utils/comprehensiveQuizGenerator.ts');

// Import all deck data
const { initialDecks } = require('./src/data/vocabulary.ts');

async function generateAllComprehensiveQuizzes() {
  console.log('🚀 Starting comprehensive quiz generation for all decks...\n');

  const results = [];
  let totalQuestions = 0;

  for (const deck of initialDecks) {
    console.log(`📚 Generating quizzes for: ${deck.name} (${deck.cards.length} cards)`);
    
    try {
      const quizSet = generateComprehensiveQuizSet(deck);
      
      results.push({
        deckId: deck.id,
        deckName: deck.name,
        totalQuestions: quizSet.totalQuestions,
        questionTypes: quizSet.questionTypes,
        difficultyDistribution: quizSet.difficultyDistribution,
        categoryDistribution: quizSet.categoryDistribution
      });

      totalQuestions += quizSet.totalQuestions;

      console.log(`✅ Generated ${quizSet.totalQuestions} questions for ${deck.name}`);
      console.log(`   Question types: ${quizSet.questionTypes.join(', ')}`);
      console.log(`   Difficulty distribution: ${JSON.stringify(quizSet.difficultyDistribution)}`);
      console.log('');

    } catch (error) {
      console.error(`❌ Error generating quizzes for ${deck.name}:`, error.message);
    }
  }

  // Save the generated quiz data
  const quizData = {
    generatedAt: new Date().toISOString(),
    totalDecks: results.length,
    totalQuestions,
    results
  };

  const outputPath = path.join(__dirname, 'comprehensive-quiz-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(quizData, null, 2));

  console.log('🎉 Comprehensive quiz generation completed!');
  console.log(`📊 Summary:`);
  console.log(`   Total decks processed: ${results.length}`);
  console.log(`   Total questions generated: ${totalQuestions}`);
  console.log(`   Average questions per deck: ${Math.round(totalQuestions / results.length)}`);
  console.log(`📁 Quiz data saved to: ${outputPath}`);

  // Display detailed results
  console.log('\n📋 Detailed Results:');
  results.forEach(result => {
    console.log(`   ${result.deckName}: ${result.totalQuestions} questions`);
  });
}

// Run the generation
generateAllComprehensiveQuizzes().catch(console.error); 