import { useState, useEffect } from 'react';

export interface LocalCSVFile {
  name: string;
  path: string;
  description?: string;
}

/**
 * Hook to manage available local CSV files and fetch manifest
 */
export const useLocalCSVFiles = () => {
  const [files, setFiles] = useState<LocalCSVFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManifest = async () => {
      try {
        // Try to fetch a manifest file that lists available CSVs
        const response = await fetch('/data/manifest.json');
        if (response.ok) {
          const manifest = await response.json();
          setFiles(manifest.files || []);
        } else {
          // If no manifest, provide empty array - users can still type filename
          setFiles([]);
        }
      } catch {
        // No manifest found - that's okay
        console.log('No manifest.json found in /data folder');
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchManifest();
  }, []);

  return { files, loading };
};
