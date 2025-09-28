import { toast as sonnerToast } from 'sonner';

// Toast utilities for consistent styling across the app
export const toast = {
  success: (message: string, description?: string) => {
    sonnerToast.success(message, {
      description,
      duration: 4000,
      style: {
        background: '#10b981', // success green
        color: 'white',
        border: '1px solid #059669',
      },
    });
  },

  error: (message: string, description?: string) => {
    sonnerToast.error(message, {
      description,
      duration: 5000,
      style: {
        background: '#ef4444', // error red
        color: 'white',
        border: '1px solid #dc2626',
      },
    });
  },

  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, {
      description,
      duration: 4000,
      style: {
        background: '#f59e0b', // warning amber
        color: 'white',
        border: '1px solid #d97706',
      },
    });
  },

  info: (message: string, description?: string) => {
    sonnerToast.info(message, {
      description,
      duration: 4000,
      style: {
        background: '#374151', // admin gray
        color: 'white',
        border: '1px solid #4b5563',
      },
    });
  },

  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
      duration: 4000,
    });
  },
};

// Utility for localStorage operations with error handling
export const storage = {
  set: (key: string, value: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Failed to save to localStorage:`, error);
      toast.error('Failed to save settings', 'Please try again');
      return false;
    }
  },

  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Failed to read from localStorage:`, error);
      return defaultValue;
    }
  },

  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Failed to remove from localStorage:`, error);
      return false;
    }
  },

  clear: (): boolean => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error(`Failed to clear localStorage:`, error);
      return false;
    }
  },
};

// Utility for generating mock files for download
export const fileUtils = {
  downloadFile: (filename: string, content: string, type: string = 'text/plain') => {
    try {
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Failed to download file:', error);
      toast.error('Download failed', 'Please try again');
      return false;
    }
  },

  copyToClipboard: async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch (fallbackError) {
        document.body.removeChild(textArea);
        return false;
      }
    }
  },

  generateMockCSV: (data: any[], filename: string) => {
    if (!data.length) return false;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => 
          typeof row[header] === 'string' && row[header].includes(',') 
            ? `"${row[header]}"` 
            : row[header]
        ).join(',')
      )
    ].join('\n');
    
    return fileUtils.downloadFile(`${filename}.csv`, csvContent, 'text/csv');
  },

  generateMockPDF: (title: string, content: string) => {
    // Mock PDF content - in real app would use jsPDF or similar
    const pdfContent = `PDF DOCUMENT - ${title}\n\n${content}\n\n--- End of Document ---`;
    return fileUtils.downloadFile(`${title.toLowerCase().replace(/\s+/g, '-')}.txt`, pdfContent);
  },
};