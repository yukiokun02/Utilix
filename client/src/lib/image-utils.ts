export async function resizeImage(file: File, width: number, height: number, quality: number = 0.9): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        // Clear canvas and draw resized image
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/png',
          quality
        );
      } else {
        reject(new Error('Failed to get canvas context'));
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
}

export async function convertImage(file: File, outputMimeType: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      if (ctx) {
        // Clear canvas and draw image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // For JPG conversion, fill background with white
        if (outputMimeType === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          outputMimeType,
          0.9
        );
      } else {
        reject(new Error('Failed to get canvas context'));
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
}

export function calculateAspectRatio(originalWidth: number, originalHeight: number, newWidth?: number, newHeight?: number) {
  if (newWidth && !newHeight) {
    return {
      width: newWidth,
      height: Math.round((originalHeight / originalWidth) * newWidth),
    };
  }
  
  if (newHeight && !newWidth) {
    return {
      width: Math.round((originalWidth / originalHeight) * newHeight),
      height: newHeight,
    };
  }
  
  return {
    width: newWidth || originalWidth,
    height: newHeight || originalHeight,
  };
}
