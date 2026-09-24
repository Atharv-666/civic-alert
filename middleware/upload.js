const multer = require('multer');

// Memory storage engine keeps files in RAM buffers for immediate forwarding to Cloudinary
const storage = multer.memoryStorage();

// File type validation filter
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error('Invalid file format. Only JPEG, JPG, PNG, and WEBP image files are allowed.'),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB Max File Size Limit
  }
});

module.exports = upload;
