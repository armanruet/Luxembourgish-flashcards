export interface ErrorReport {
  id: string;
  timestamp: Date;
  deckId: string;
  deckName: string;
  flashcardId: string;
  flashcardContent: {
    luxembourgish: string;
    english: string;
    pronunciation?: string;
    notes?: string;
  };
  errorField: 'luxembourgish' | 'english' | 'pronunciation' | 'notes' | 'other';
  errorDescription: string;
  correctAnswer: string;
  additionalNotes?: string;
  reportedBy?: string;
  status: 'pending' | 'reviewing' | 'fixed' | 'rejected';
}

export interface ErrorReportSubmission {
  errorField: ErrorReport['errorField'];
  errorDescription: string;
  correctAnswer: string;
  additionalNotes?: string;
}
