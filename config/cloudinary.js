const cloudinary = require('cloudinary').v2;

// Configure Cloudinary credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Uploads a file buffer directly to Cloudinary without writing to disk
 * @param {Buffer} fileBuffer - The memory buffer from Multer (req.file.buffer)
 * @param {string} folder - Target Cloudinary folder (default: 'civic-alert-salokhenagar')
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
const uploadToCloudinary = (fileBuffer, folder = 'civic-alert-salokhenagar') => {
  return new Promise((resolve, reject) => {
    // Fallback mock mode if Cloudinary credentials are not set during local offline development
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      console.warn('⚠️ Cloudinary environment variables missing. Returning simulated CDN URL.');
      return resolve({
        secure_url: `https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80`,
        public_id: `mock_asset_${Date.now()}`
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' }, // Optimize image dimensions
          { quality: 'auto', fetch_format: 'auto' }     // Auto compression
        ]
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id
        });
      }
    );

    // Write buffer to stream
    uploadStream.end(fileBuffer);
  });
};

/**
 * Deletes an image from Cloudinary by public ID
 * @param {string} publicId 
 */
const deleteFromCloudinary = async (publicId) => {
  if (!publicId || !process.env.CLOUDINARY_CLOUD_NAME) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Failed to delete asset from Cloudinary:', err.message);
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary
};
