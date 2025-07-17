import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Download,
  Upload,
  Trash2,
  Globe,
  Bell,
  Clock,
  Brain,
  Palette,
  RefreshCw,
  Package,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useStudyStore } from '@/store/studyStore';
import { useDeckStore } from '@/store/deckStore';
import { 
  loadAppSettings, 
  saveAppSettings, 
  exportAllData, 
  importAllData, 
  clearAllData 
} from '@/utils/storage';
import { AppSettings } from '@/types';
import { useContentUpdates } from './ContentUpdateBanner';

const Settings: React.FC = () => {
  const { loadUserProgress } = useStudyStore();
  const { loadDecks } = useDeckStore();
  
  const [settings, setSettings] = useState<AppSettings>(loadAppSettings());
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Content update functionality
  const { 
    migrationStatus, 
    checkForContentUpdates, 
    migrateUserContent 
  } = useContentUpdates();
  
  const [isCheckingUpdates, setIsCheckingUpdates] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<{
    hasUpdates: boolean;
    newDecks: number;
    updatedDecks: number;
    newCards: number;
    lastCheck?: Date;
  } | null>(null);

  const updateSetting = <K extends keyof AppSettings>(
    key: K, 
    value: AppSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveAppSettings(newSettings);
    toast.success('Settings updated');
  };

  const handleExportData = () => {
    try {
      const data = exportAllData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `luxembourgish-flashcards-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        if (importAllData(data)) {
          loadDecks();
          loadUserProgress();
          toast.success('Data imported successfully');
        } else {
          toast.error('Failed to import data - invalid format');
        }
      } catch (error) {
        toast.error('Failed to import data');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  const handleResetData = () => {
    clearAllData();
    loadDecks();
    loadUserProgress();
    setShowResetConfirm(false);
    toast.success('All data has been reset');
  };

  // Content update handlers
  const handleCheckForUpdates = async () => {
    setIsCheckingUpdates(true);
    try {
      const updateInfo = await checkForContentUpdates();
      setUpdateStatus({
        ...updateInfo,
        lastCheck: new Date()
      });
      
      if (updateInfo.hasUpdates) {
        toast.success(`Updates available! ${updateInfo.newDecks} new decks, ${updateInfo.newCards} new cards`);
      } else {
        toast.success('You have the latest content!');
      }
    } catch (error) {
      toast.error('Failed to check for updates');
    } finally {
      setIsCheckingUpdates(false);
    }
  };

  const handleUpdateContent = async () => {
    try {
      const success = await migrateUserContent();
      if (success) {
        toast.success('Content updated successfully!');
        // Refresh update status
        handleCheckForUpdates();
      } else {
        toast.error('Failed to update content');
      }
    } catch (error) {
      toast.error('Failed to update content');
    }
  };

  const settingSections = [
    {
      title: 'Appearance',
      icon: Palette,
      settings: [
        {
          key: 'theme' as const,
          label: 'Theme',
          type: 'select' as const,
          options: [
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'system', label: 'System' }
          ],
          description: 'Choose your preferred color scheme'
        },
        {
          key: 'cardAnimation' as const,
          label: 'Card Animations',
          type: 'toggle' as const,
          description: 'Enable smooth card flip animations'
        }
      ]
    },
    {
      title: 'User Interface',
      icon: Globe,
      settings: [
        {
          key: 'showCacheNotification' as const,
          label: 'Show Cache Notification',
          type: 'toggle' as const,
          description: 'Display version checker and cache issue notifications'
        },
        {
          key: 'showLiveStatsOverlay' as const,
          label: 'Show Live Stats Overlay',
          type: 'toggle' as const,
          description: 'Display statistics overlay during study sessions'
        }
      ]
    },
    {
      title: 'Study Experience',
      icon: Brain,
      settings: [
        {
          key: 'autoPlayAudio' as const,
          label: 'Auto-play Audio',
          type: 'toggle' as const,
          description: 'Automatically play pronunciation when showing cards'
        },
        {
          key: 'showPronunciation' as const,
          label: 'Show Pronunciation',
          type: 'toggle' as const,
          description: 'Display pronunciation guides on flashcards'
        },
        {
          key: 'showAnswerTimer' as const,
          label: 'Answer Timer',
          type: 'toggle' as const,
          description: 'Show how long you take to answer each card'
        },
        {
          key: 'newCardsPerDay' as const,
          label: 'New Cards Per Day',
          type: 'number' as const,
          min: 5,
          max: 50,
          description: 'Maximum number of new cards to introduce daily'
        },
        {
          key: 'maxReviewsPerDay' as const,
          label: 'Max Reviews Per Day',
          type: 'number' as const,
          min: 20,
          max: 500,
          description: 'Maximum number of review cards per day'
        }
      ]
    },
    {
      title: 'Spaced Repetition',
      icon: Clock,
      settings: [
        {
          key: 'easyBonus' as const,
          label: 'Easy Bonus',
          type: 'number' as const,
          min: 1.1,
          max: 2.0,
          step: 0.1,
          description: 'Multiplier for "Easy" answers (higher = longer intervals)'
        },
        {
          key: 'intervalModifier' as const,
          label: 'Interval Modifier',
          type: 'number' as const,
          min: 0.5,
          max: 2.0,
          step: 0.1,
          description: 'Global modifier for all intervals (higher = longer intervals)'
        },
        {
          key: 'maximumInterval' as const,
          label: 'Maximum Interval (days)',
          type: 'number' as const,
          min: 30,
          max: 36500,
          step: 1,
          description: 'Maximum number of days between reviews'
        }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        {
          key: 'studyReminders' as const,
          label: 'Study Reminders',
          type: 'toggle' as const,
          description: 'Receive daily reminders to study'
        }
      ]
    }
  ];

  // Content update section (separate from main settings) - currently unused
  // const contentUpdateSection = {
  //   title: 'Content Updates',
  //   icon: Download,
  //   description: 'Manage your flashcard content and get the latest updates'
  // };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <SettingsIcon className="h-8 w-8 mr-3 text-primary" />
          Settings
        </h1>
        <p className="text-gray-600">
          Customize your Luxembourgish learning experience
        </p>
      </motion.div>

      {/* Settings Sections */}
      <div className="space-y-8">
        {settingSections.map((section, sectionIndex) => {
          const SectionIcon = section.icon;
          
          return (
            <motion.div
              key={section.title}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <SectionIcon className="h-5 w-5 mr-2 text-primary" />
                  {section.title}
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                {section.settings.map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-900 block mb-1">
                        {setting.label}
                      </label>
                      <p className="text-sm text-gray-600">{setting.description}</p>
                    </div>
                    
                    <div className="ml-6">
                      {setting.type === 'toggle' && (
                        <button
                          onClick={() => updateSetting(setting.key, !settings[setting.key])}
                          className={`
                            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                            ${settings[setting.key] ? 'bg-primary' : 'bg-gray-200'}
                          `}
                        >
                          <span
                            className={`
                              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                              ${settings[setting.key] ? 'translate-x-6' : 'translate-x-1'}
                            `}
                          />
                        </button>
                      )}
                      
                      {setting.type === 'select' && setting.options && (
                        <select
                          value={settings[setting.key] as string}
                          onChange={(e) => updateSetting(setting.key, e.target.value as any)}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                          {setting.options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                      
                      {setting.type === 'number' && (
                        <input
                          type="number"
                          value={settings[setting.key] as number}
                          onChange={(e) => updateSetting(setting.key, Number(e.target.value) as any)}
                          min={setting.min}
                          max={setting.max}
                          step={(setting as any).step || 1}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-20 focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Content Updates */}
      <motion.div
        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Package className="h-5 w-5 mr-2 text-primary" />
            Content Updates
          </h2>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Check for updates */}
          <div className="flex items-center justify-between py-3">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                Check for Updates
              </h3>
              <p className="text-sm text-gray-600">
                Check if new flashcard decks or content updates are available
              </p>
              {updateStatus?.lastCheck && (
                <p className="text-xs text-gray-500 mt-1">
                  Last checked: {updateStatus.lastCheck.toLocaleString()}
                </p>
              )}
            </div>
            <button
              onClick={handleCheckForUpdates}
              disabled={isCheckingUpdates}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingUpdates ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Check Now
                </>
              )}
            </button>
          </div>

          {/* Update status */}
          {updateStatus && (
            <div className="border-t border-gray-200 pt-4">
              {updateStatus.hasUpdates ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">
                        Updates Available!
                      </h4>
                      <div className="text-sm text-blue-800 space-y-1">
                        {updateStatus.newDecks > 0 && (
                          <p>• {updateStatus.newDecks} new deck{updateStatus.newDecks !== 1 ? 's' : ''}</p>
                        )}
                        {updateStatus.updatedDecks > 0 && (
                          <p>• {updateStatus.updatedDecks} updated deck{updateStatus.updatedDecks !== 1 ? 's' : ''}</p>
                        )}
                        {updateStatus.newCards > 0 && (
                          <p>• {updateStatus.newCards} new card{updateStatus.newCards !== 1 ? 's' : ''}</p>
                        )}
                      </div>
                      <button
                        onClick={handleUpdateContent}
                        disabled={migrationStatus === 'migrating'}
                        className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {migrationStatus === 'migrating' ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Update Now
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-green-900">
                        You're up to date!
                      </h4>
                      <p className="text-sm text-green-800">
                        You have the latest flashcard content.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Data Management */}
      <motion.div
        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Globe className="h-5 w-5 mr-2 text-primary" />
            Data Management
          </h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleExportData}
              className="flex items-center justify-center space-x-2 py-3 px-4 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </button>
            
            <label className="flex items-center justify-center space-x-2 py-3 px-4 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
              <Upload className="h-4 w-4" />
              <span>Import Data</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
            
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center justify-center space-x-2 py-3 px-4 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Reset All Data</span>
            </button>
          </div>
          
          <p className="text-sm text-gray-600">
            Export your data to create backups, import data from another device, or reset everything to start fresh.
          </p>
        </div>
      </motion.div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowResetConfirm(false)}
        >
          <motion.div
            className="bg-white rounded-xl p-6 max-w-md w-full"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <Trash2 className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-4">Reset All Data</h3>
              <p className="text-gray-600 mb-6">
                This will permanently delete all your progress, decks, and settings. 
                This action cannot be undone.
              </p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleResetData}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Yes, Reset Everything
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* App Info */}
      <motion.div
        className="bg-gray-50 rounded-xl p-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="font-semibold text-gray-900 mb-2">Luxembourgish Flashcards</h3>
        <p className="text-sm text-gray-600 mb-4">
          Built with ❤️ for learning Lëtzebuergesch • Version 1.0.0
        </p>
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <span>🇱🇺 Made for Luxembourg residents</span>
          <span>•</span>
          <span>📚 Open source & privacy-first</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
