import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  AlertTriangle, 
  CheckCircle, 
  MessageCircle,
  FileText,
  Volume2,
  Globe,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';

import { ErrorReportSubmission } from '@/types/errorReport';
import { Flashcard } from '@/types';
import ErrorReportService from '@/services/ErrorReportService';

interface ErrorReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  deckId: string;
  deckName: string;
  flashcard: Flashcard;
}

const ErrorReportModal: React.FC<ErrorReportModalProps> = ({
  isOpen,
  onClose,
  deckId,
  deckName,
  flashcard
}) => {
  const [errorField, setErrorField] = useState<ErrorReportSubmission['errorField']>('luxembourgish');
  const [errorDescription, setErrorDescription] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errorReportService = ErrorReportService.getInstance();

  const fieldOptions = [
    { value: 'luxembourgish', label: 'Luxembourgish Text', icon: Globe },
    { value: 'english', label: 'English Translation', icon: MessageCircle },
    { value: 'pronunciation', label: 'Pronunciation Guide', icon: Volume2 },
    { value: 'notes', label: 'Notes/Examples', icon: FileText },
    { value: 'other', label: 'Other Issue', icon: Info }
  ] as const;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!errorDescription.trim() || !correctAnswer.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const submission: ErrorReportSubmission = {
        errorField,
        errorDescription: errorDescription.trim(),
        correctAnswer: correctAnswer.trim(),
        additionalNotes: additionalNotes.trim() || undefined
      };

      const reportId = errorReportService.createReport(
        deckId,
        deckName,
        flashcard,
        submission
      );

      console.log('Error report created with ID:', reportId);
      toast.success('Error report submitted successfully!');
      
      // Reset form
      setErrorDescription('');
      setCorrectAnswer('');
      setAdditionalNotes('');
      setErrorField('luxembourgish');
      
      onClose();
    } catch (error) {
      console.error('Failed to submit error report:', error);
      toast.error('Failed to submit error report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentFieldValue = () => {
    switch (errorField) {
      case 'luxembourgish':
        return flashcard.luxembourgish;
      case 'english':
        return flashcard.english;
      case 'pronunciation':
        return flashcard.pronunciation || 'Not provided';
      case 'notes':
        return flashcard.notes || 'Not provided';
      default:
        return '';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Report Error</h2>
                  <p className="text-sm text-gray-600">
                    {deckName} • Card: {flashcard.id}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Current Card Preview */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Current Card Content:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Luxembourgish:</span>
                  <p className="text-gray-900">{flashcard.luxembourgish}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">English:</span>
                  <p className="text-gray-900">{flashcard.english}</p>
                </div>
                {flashcard.pronunciation && (
                  <div>
                    <span className="font-medium text-gray-700">Pronunciation:</span>
                    <p className="text-gray-900">{flashcard.pronunciation}</p>
                  </div>
                )}
                {flashcard.notes && (
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-700">Notes:</span>
                    <p className="text-gray-900">{flashcard.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Error Report Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Field Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Which field has an error? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {fieldOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <label
                        key={option.value}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                          errorField === option.value
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                            : 'border-gray-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="errorField"
                          value={option.value}
                          checked={errorField === option.value}
                          onChange={(e) => setErrorField(e.target.value as typeof errorField)}
                          className="sr-only"
                        />
                        <IconComponent className="h-5 w-5 text-gray-600" />
                        <span className="font-medium text-gray-900">{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Current Value Display */}
              {errorField !== 'other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Value:
                  </label>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <p className="text-gray-900">{getCurrentFieldValue()}</p>
                  </div>
                </div>
              )}

              {/* Error Description */}
              <div>
                <label htmlFor="errorDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  What's wrong with it? *
                </label>
                <textarea
                  id="errorDescription"
                  value={errorDescription}
                  onChange={(e) => setErrorDescription(e.target.value)}
                  placeholder="Describe the error (e.g., 'Wrong spelling', 'Incorrect translation', 'Missing pronunciation'...)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={3}
                  required
                />
              </div>

              {/* Correct Answer */}
              <div>
                <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700 mb-2">
                  What should the correct value be? *
                </label>
                <textarea
                  id="correctAnswer"
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  placeholder="Provide the correct answer..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={3}
                  required
                />
              </div>

              {/* Additional Notes */}
              <div>
                <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="additionalNotes"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Any additional context or notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={2}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !errorDescription.trim() || !correctAnswer.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Submit Report
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ErrorReportModal;
