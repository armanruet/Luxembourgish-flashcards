import React from 'react';
import Flashcard from './Flashcard';
import { Flashcard as FlashcardType } from '@/types';

const ErrorReportTest: React.FC = () => {
  const testCard: FlashcardType = {
    id: 'test-card-1',
    luxembourgish: 'kommen',
    english: 'to come',
    pronunciation: '[KOM-men]',
    notes: 'ech kommen, du kënns, hien/hatt kënnt, mir kommen, dir kommt, si kommen',
    category: 'test-verbs',
    difficulty: 'easy',
    createdAt: new Date(),
    updatedAt: new Date(),
    nextReview: new Date(),
    interval: 1,
    easeFactor: 2.5,
    reviews: 0,
    lapses: 0
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Error Reporting Test</h1>
      <p className="mb-4 text-gray-600">
        This test page shows a flashcard with deck context. The red warning triangle should be visible.
      </p>
      
      <div className="max-w-md mx-auto">
        <Flashcard
          card={testCard}
          isFlipped={false}
          onFlip={() => {}}
          deckId="test-deck-1"
          deckName="Test Deck for Error Reporting"
          showPronunciation={true}
        />
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="font-semibold mb-2">Test Instructions:</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Look for the red warning triangle icon in the flashcard footer</li>
          <li>Click the red triangle to open the error report modal</li>
          <li>Fill out the form and submit a test error report</li>
          <li>Go to Navigation → Error Reports to view the submitted report</li>
        </ol>
      </div>
    </div>
  );
};

export default ErrorReportTest;
