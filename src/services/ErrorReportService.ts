import { ErrorReport, ErrorReportSubmission } from '@/types/errorReport';
import { Flashcard } from '@/types';

class ErrorReportService {
  private static instance: ErrorReportService;
  private reports: ErrorReport[] = [];
  private readonly STORAGE_KEY = 'flashcard_error_reports';

  private constructor() {
    this.loadReports();
  }

  static getInstance(): ErrorReportService {
    if (!ErrorReportService.instance) {
      ErrorReportService.instance = new ErrorReportService();
    }
    return ErrorReportService.instance;
  }

  private loadReports(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsedReports = JSON.parse(stored);
        this.reports = parsedReports.map((report: any) => ({
          ...report,
          timestamp: new Date(report.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load error reports:', error);
      this.reports = [];
    }
  }

  private saveReports(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.reports));
    } catch (error) {
      console.error('Failed to save error reports:', error);
    }
  }

  createReport(
    deckId: string,
    deckName: string,
    flashcard: Flashcard,
    submission: ErrorReportSubmission
  ): string {
    const reportId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newReport: ErrorReport = {
      id: reportId,
      timestamp: new Date(),
      deckId,
      deckName,
      flashcardId: flashcard.id,
      flashcardContent: {
        luxembourgish: flashcard.luxembourgish,
        english: flashcard.english,
        pronunciation: flashcard.pronunciation,
        notes: flashcard.notes
      },
      errorField: submission.errorField,
      errorDescription: submission.errorDescription,
      correctAnswer: submission.correctAnswer,
      additionalNotes: submission.additionalNotes,
      status: 'pending'
    };

    this.reports.push(newReport);
    this.saveReports();
    
    return reportId;
  }

  getAllReports(): ErrorReport[] {
    return [...this.reports].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getReportsByDeck(deckId: string): ErrorReport[] {
    return this.reports
      .filter(report => report.deckId === deckId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  updateReportStatus(reportId: string, status: ErrorReport['status']): boolean {
    const reportIndex = this.reports.findIndex(report => report.id === reportId);
    if (reportIndex !== -1) {
      this.reports[reportIndex].status = status;
      this.saveReports();
      return true;
    }
    return false;
  }

  deleteReport(reportId: string): boolean {
    const initialLength = this.reports.length;
    this.reports = this.reports.filter(report => report.id !== reportId);
    
    if (this.reports.length < initialLength) {
      this.saveReports();
      return true;
    }
    return false;
  }

  exportReportsAsJSON(): string {
    return JSON.stringify(this.reports, null, 2);
  }

  exportReportsAsCSV(): string {
    if (this.reports.length === 0) {
      return 'No error reports to export';
    }

    const headers = [
      'Report ID',
      'Timestamp',
      'Deck Name',
      'Flashcard ID',
      'Current Luxembourgish',
      'Current English',
      'Current Pronunciation',
      'Error Field',
      'Error Description',
      'Correct Answer',
      'Additional Notes',
      'Status'
    ];

    const csvRows = [
      headers.join(','),
      ...this.reports.map(report => [
        `"${report.id}"`,
        `"${report.timestamp.toISOString()}"`,
        `"${report.deckName}"`,
        `"${report.flashcardId}"`,
        `"${report.flashcardContent.luxembourgish.replace(/"/g, '""')}"`,
        `"${report.flashcardContent.english.replace(/"/g, '""')}"`,
        `"${(report.flashcardContent.pronunciation || '').replace(/"/g, '""')}"`,
        `"${report.errorField}"`,
        `"${report.errorDescription.replace(/"/g, '""')}"`,
        `"${report.correctAnswer.replace(/"/g, '""')}"`,
        `"${(report.additionalNotes || '').replace(/"/g, '""')}"`,
        `"${report.status}"`
      ].join(','))
    ];

    return csvRows.join('\n');
  }

  downloadReports(format: 'json' | 'csv' = 'csv'): void {
    const timestamp = new Date().toISOString().split('T')[0];
    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'json') {
      content = this.exportReportsAsJSON();
      filename = `flashcard_error_reports_${timestamp}.json`;
      mimeType = 'application/json';
    } else {
      content = this.exportReportsAsCSV();
      filename = `flashcard_error_reports_${timestamp}.csv`;
      mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  getReportsCount(): number {
    return this.reports.length;
  }

  getPendingReportsCount(): number {
    return this.reports.filter(report => report.status === 'pending').length;
  }
}

export default ErrorReportService;
