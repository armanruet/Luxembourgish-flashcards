import React, { useState, useEffect } from 'react';
import { loadAppSettings } from '@/utils/storage';

interface VersionInfo {
  version: string;
  buildTime: string;
  totalCards: number;
  lastUpdate: string;
  deploymentId: string;
  cacheBuster?: string;
}

export const VersionChecker: React.FC = () => {
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
  const [isLatest, setIsLatest] = useState<boolean>(true);
  const [settings] = useState(() => loadAppSettings());

  useEffect(() => {
    const checkVersion = async () => {
      try {
        // Add cache-busting parameter to ensure fresh fetch
        const timestamp = Date.now();
        const response = await fetch(`/Luxembourgish-flashcards/version.json?t=${timestamp}`, {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (response.ok) {
          const version: VersionInfo = await response.json();
          setVersionInfo(version);
          
          // Check if version is from today (rough check for latest)
          const today = new Date().toISOString().split('T')[0];
          const versionDate = version.buildTime.split('T')[0];
          setIsLatest(versionDate === today);
        }
      } catch (error) {
        console.log('Version check failed:', error);
      }
    };

    checkVersion();
  }, []);

  // Don't render if settings disabled or no version info
  if (!versionInfo || !settings.showCacheNotification) return null;

  return (
    <div className={`fixed bottom-4 right-4 p-3 rounded-lg text-xs max-w-xs z-50 ${
      isLatest ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    }`}>
      <div className="font-semibold mb-1">
        {isLatest ? '✅ Latest Version' : '⚠️ Cache Issue?'}
      </div>
      <div>Version: {versionInfo.version}</div>
      <div>Cards: {versionInfo.totalCards}</div>
      {!isLatest && (
        <div className="mt-2 text-xs">
          <div>If card count seems wrong:</div>
          <div>• Hard refresh (Ctrl+Shift+R)</div>
          <div>• Try incognito mode</div>
          <div>• Clear browser cache</div>
        </div>
      )}
    </div>
  );
};
