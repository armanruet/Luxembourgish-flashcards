import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, RefreshCw, X, Package, Plus, AlertCircle } from 'lucide-react';
import { useDeckStore } from '@/store/deckStore';
import toast from 'react-hot-toast';

interface ContentUpdateBannerProps {
  className?: string;
}

export const ContentUpdateBanner: React.FC<ContentUpdateBannerProps> = ({ className }) => {
  const { 
    migrationStatus, 
    // lastMigrationCheck, // Currently unused
    checkForContentUpdates, 
    migrateUserContent 
  } = useDeckStore();
  
  const [updateInfo, setUpdateInfo] = useState<{
    hasUpdates: boolean;
    newDecks: number;
    updatedDecks: number;
    newCards: number;
  } | null>(null);
  
  const [isVisible, setIsVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  // Check for updates on component mount and periodically
  useEffect(() => {
    const checkUpdates = async () => {
      try {
        const info = await checkForContentUpdates();
        setUpdateInfo(info);
        setLastCheck(new Date());
        
        // Show banner if there are updates
        if (info.hasUpdates) {
          setIsVisible(true);
        }
      } catch (error) {
        console.error('Failed to check for updates:', error);
      }
    };

    checkUpdates();
    
    // Check for updates every 30 minutes
    const interval = setInterval(checkUpdates, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkForContentUpdates]);

  const handleUpdateContent = async () => {
    console.log('🔄 User clicked Update Now button');
    setIsUpdating(true);
    
    try {
      console.log('📊 Current update info:', updateInfo);
      const success = await migrateUserContent();
      console.log('📋 Migration result:', success);
      
      if (success) {
        toast.success(
          `Content updated! Added ${updateInfo?.newDecks || 0} new decks and ${updateInfo?.newCards || 0} new cards.`,
          { duration: 5000 }
        );
        setIsVisible(false);
        setUpdateInfo(null);
        console.log('✅ Update completed successfully');
      } else {
        console.error('❌ Migration returned false');
        toast.error('Failed to update content. Please try again.');
      }
    } catch (error) {
      console.error('❌ Update failed with exception:', error);
      toast.error('Failed to update content. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleRefreshCheck = async () => {
    try {
      const info = await checkForContentUpdates();
      setUpdateInfo(info);
      setLastCheck(new Date());
      
      if (info.hasUpdates) {
        setIsVisible(true);
        toast.success('Updates available!');
      } else {
        toast.success('You have the latest content!');
      }
    } catch (error) {
      toast.error('Failed to check for updates.');
    }
  };

  // Don't render if no updates available
  if (!updateInfo?.hasUpdates || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`relative bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4 shadow-sm ${className}`}
      >
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Dismiss update notification"
        >
          <X size={16} />
        </button>

        <div className="flex items-start space-x-3">
          {/* Update icon */}
          <div className="flex-shrink-0 p-2 bg-blue-100 rounded-full">
            <Package className="w-5 h-5 text-blue-600" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-medium text-gray-900">
                New Content Available!
              </h3>
              {migrationStatus === 'checking' && (
                <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
              )}
            </div>
            
            <div className="mt-1 text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                {updateInfo.newDecks > 0 && (
                  <div className="flex items-center space-x-1">
                    <Plus className="w-4 h-4 text-green-500" />
                    <span>{updateInfo.newDecks} new deck{updateInfo.newDecks !== 1 ? 's' : ''}</span>
                  </div>
                )}
                
                {updateInfo.updatedDecks > 0 && (
                  <div className="flex items-center space-x-1">
                    <RefreshCw className="w-4 h-4 text-blue-500" />
                    <span>{updateInfo.updatedDecks} updated deck{updateInfo.updatedDecks !== 1 ? 's' : ''}</span>
                  </div>
                )}
                
                {updateInfo.newCards > 0 && (
                  <div className="flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                    <span>{updateInfo.newCards} new card{updateInfo.newCards !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-3 flex items-center space-x-2">
              <button
                onClick={handleUpdateContent}
                disabled={isUpdating || migrationStatus === 'migrating'}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUpdating || migrationStatus === 'migrating' ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Update Now
                  </>
                )}
              </button>
              
              <button
                onClick={handleRefreshCheck}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Check Again
              </button>
            </div>
          </div>
        </div>

        {/* Status indicator */}
        {migrationStatus === 'failed' && (
          <div className="mt-2 flex items-center space-x-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Update failed. Please try again.</span>
          </div>
        )}
        
        {lastCheck && (
          <div className="mt-2 text-xs text-gray-500">
            Last checked: {lastCheck.toLocaleTimeString()}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

// Hook to provide update status for other components
export const useContentUpdates = () => {
  const { migrationStatus, checkForContentUpdates, migrateUserContent } = useDeckStore();
  
  return {
    migrationStatus,
    checkForContentUpdates,
    migrateUserContent,
  };
};
