export interface FileInfo {
  name: string;
  size: number;
  type: string;
  extension: string;
  lastModified: number;
}

export function getFileInfo(file: File): FileInfo {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    extension,
    lastModified: file.lastModified,
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

export function isTextFile(file: File): boolean {
  const textTypes = [
    'text/',
    'application/json',
    'application/xml',
    'application/javascript',
    'application/typescript',
  ];
  
  return textTypes.some(type => file.type.startsWith(type)) || 
         file.type === '' && isTextExtension(getFileInfo(file).extension);
}

export function isTextExtension(extension: string): boolean {
  const textExtensions = [
    'txt', 'md', 'json', 'xml', 'html', 'htm', 'css', 'js', 'ts', 
    'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'h', 'cs', 'php', 
    'rb', 'go', 'rs', 'sh', 'bat', 'ps1', 'sql', 'yml', 'yaml',
    'ini', 'cfg', 'conf', 'log', 'csv', 'rtf'
  ];
  
  return textExtensions.includes(extension.toLowerCase());
}

export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file as text'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}

export async function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file as data URL'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

export async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const result = event.target?.result;
      if (result instanceof ArrayBuffer) {
        resolve(result);
      } else {
        reject(new Error('Failed to read file as array buffer'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

export function downloadFile(content: string | Blob, filename: string, mimeType?: string): void {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType || 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  URL.revokeObjectURL(url);
}

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      return file.type.startsWith(type.slice(0, -1));
    }
    return file.type === type;
  });
}

export function validateFileSize(file: File, maxSizeBytes: number): boolean {
  return file.size <= maxSizeBytes;
}

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateFile(
  file: File, 
  options: {
    allowedTypes?: string[];
    maxSize?: number;
    minSize?: number;
  } = {}
): FileValidationResult {
  const errors: string[] = [];
  
  if (options.allowedTypes && !validateFileType(file, options.allowedTypes)) {
    errors.push(`File type "${file.type}" is not allowed. Allowed types: ${options.allowedTypes.join(', ')}`);
  }
  
  if (options.maxSize && file.size > options.maxSize) {
    errors.push(`File size (${formatFileSize(file.size)}) exceeds maximum allowed size (${formatFileSize(options.maxSize)})`);
  }
  
  if (options.minSize && file.size < options.minSize) {
    errors.push(`File size (${formatFileSize(file.size)}) is below minimum required size (${formatFileSize(options.minSize)})`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export async function convertTextToFormat(text: string, format: string): Promise<string> {
  switch (format.toLowerCase()) {
    case 'json':
      try {
        // Try to parse as JSON first, if it fails, wrap in content object
        JSON.parse(text);
        return text;
      } catch {
        return JSON.stringify({ content: text }, null, 2);
      }
    
    case 'html':
      return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <pre>${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body>
</html>`;
    
    case 'md':
    case 'markdown':
      return `# Document\n\n${text}`;
    
    case 'csv':
      // Simple text to CSV conversion (each line becomes a row)
      const lines = text.split('\n');
      return lines.map(line => `"${line.replace(/"/g, '""')}"`).join('\n');
    
    case 'xml':
      return `<?xml version="1.0" encoding="UTF-8"?>
<document>
    <content><![CDATA[${text}]]></content>
</document>`;
    
    case 'txt':
    default:
      return text;
  }
}

export function getMimeTypeFromExtension(extension: string): string {
  const mimeTypes: Record<string, string> = {
    'txt': 'text/plain',
    'html': 'text/html',
    'htm': 'text/html',
    'css': 'text/css',
    'js': 'text/javascript',
    'json': 'application/json',
    'xml': 'application/xml',
    'md': 'text/markdown',
    'csv': 'text/csv',
    'rtf': 'application/rtf',
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    'tar': 'application/x-tar',
    'gz': 'application/gzip',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'bmp': 'image/bmp',
    'ico': 'image/x-icon',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'ogg': 'audio/ogg',
    'mp4': 'video/mp4',
    'avi': 'video/x-msvideo',
    'mov': 'video/quicktime',
    'wmv': 'video/x-ms-wmv',
    'flv': 'video/x-flv',
  };
  
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
}

export function generateUniqueFileName(originalName: string, existingNames: string[]): string {
  const fileInfo = getFileInfo({ name: originalName } as File);
  const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
  const extension = fileInfo.extension;
  
  let counter = 1;
  let newName = originalName;
  
  while (existingNames.includes(newName)) {
    newName = extension 
      ? `${baseName} (${counter}).${extension}`
      : `${baseName} (${counter})`;
    counter++;
  }
  
  return newName;
}
