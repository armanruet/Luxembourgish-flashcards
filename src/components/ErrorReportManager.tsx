import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
  Search,
  Calendar,
  BarChart3,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

import { ErrorReport } from '@/types/errorReport';
import ErrorReportService from '@/services/ErrorReportService';

const ErrorReportManager: React.FC = () => {
  const [reports, setReports] = useState<ErrorReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<ErrorReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deckFilter, setDeckFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'timestamp' | 'deck' | 'status'>('timestamp');
  const [isLoading, setIsLoading] = useState(true);

  const errorReportService = ErrorReportService.getInstance();

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reports, searchTerm, statusFilter, deckFilter, sortBy]);

  const loadReports = () => {
    setIsLoading(true);
    try {
      const allReports = errorReportService.getAllReports();
      setReports(allReports);
    } catch (error) {
      console.error('Failed to load reports:', error);
      toast.error('Failed to load error reports');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...reports];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(report =>
        report.deckName.toLowerCase().includes(term) ||
        report.flashcardId.toLowerCase().includes(term) ||
        report.errorDescription.toLowerCase().includes(term) ||
        report.correctAnswer.toLowerCase().includes(term) ||
        report.flashcardContent.luxembourgish.toLowerCase().includes(term) ||
        report.flashcardContent.english.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    // Deck filter
    if (deckFilter !== 'all') {
      filtered = filtered.filter(report => report.deckName === deckFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'timestamp':
          return b.timestamp.getTime() - a.timestamp.getTime();
        case 'deck':
          return a.deckName.localeCompare(b.deckName);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    setFilteredReports(filtered);
  };

  const handleStatusUpdate = (reportId: string, newStatus: ErrorReport['status']) => {
    const success = errorReportService.updateReportStatus(reportId, newStatus);
    if (success) {
      toast.success(`Report status updated to ${newStatus}`);
      loadReports();
    } else {
      toast.error('Failed to update report status');
    }
  };

  const handleDeleteReport = (reportId: string) => {
    if (window.confirm('Are you sure you want to delete this error report?')) {
      const success = errorReportService.deleteReport(reportId);
      if (success) {
        toast.success('Error report deleted');
        loadReports();
      } else {
        toast.error('Failed to delete report');
      }
    }
  };

  const handleExportReports = (format: 'csv' | 'json') => {
    try {
      errorReportService.downloadReports(format);
      toast.success(`Reports exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export reports');
    }
  };

  const getStatusIcon = (status: ErrorReport['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'reviewing':
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      case 'fixed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: ErrorReport['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'fixed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const uniqueDecks = [...new Set(reports.map(r => r.deckName))];
  const statusCounts = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    reviewing: reports.filter(r => r.status === 'reviewing').length,
    fixed: reports.filter(r => r.status === 'fixed').length,
    rejected: reports.filter(r => r.status === 'rejected').length
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading error reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="h-8 w-8 text-red-600" />
              Error Reports Manager
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and track flashcard error reports from users
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleExportReports('csv')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={() => handleExportReports('json')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Download className="h-4 w-4" />
              Export JSON
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{statusCounts.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600">Pending</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-600">Reviewing</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{statusCounts.reviewing}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-gray-600">Fixed</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{statusCounts.fixed}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium text-gray-600">Rejected</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{statusCounts.rejected}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="h-4 w-4 inline mr-1" />
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search reports..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="h-4 w-4 inline mr-1" />
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="fixed">Fixed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4 inline mr-1" />
                Deck
              </label>
              <select
                value={deckFilter}
                onChange={(e) => setDeckFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Decks</option>
                {uniqueDecks.map(deck => (
                  <option key={deck} value={deck}>{deck}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="timestamp">Date (Newest First)</option>
                <option value="deck">Deck Name</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No error reports found</h3>
          <p className="text-gray-600">
            {reports.length === 0 
              ? "No error reports have been submitted yet." 
              : "No reports match your current filters."
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-red-50 rounded-lg">
                      {getStatusIcon(report.status)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{report.deckName}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Card ID: {report.flashcardId} • 
                        Field: {report.errorField} • 
                        Reported: {report.timestamp.toLocaleDateString()} {report.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={report.status}
                      onChange={(e) => handleStatusUpdate(report.id, e.target.value as ErrorReport['status'])}
                      className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="fixed">Fixed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete report"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Current Content:</h4>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Luxembourgish:</span>
                        <p className="text-gray-900">{report.flashcardContent.luxembourgish}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">English:</span>
                        <p className="text-gray-900">{report.flashcardContent.english}</p>
                      </div>
                      {report.flashcardContent.pronunciation && (
                        <div>
                          <span className="font-medium text-gray-700">Pronunciation:</span>
                          <p className="text-gray-900">{report.flashcardContent.pronunciation}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Error Report:</h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Issue:</span>
                        <p className="text-gray-900">{report.errorDescription}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Correct Answer:</span>
                        <p className="text-green-700 font-medium">{report.correctAnswer}</p>
                      </div>
                      {report.additionalNotes && (
                        <div>
                          <span className="font-medium text-gray-700">Additional Notes:</span>
                          <p className="text-gray-900">{report.additionalNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ErrorReportManager;
