const cloudinary = require('cloudinary').v2;

const configureCloudinary = () => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return false;
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return true;
};

const uploadReceipt = async (file) => {
  const configured = configureCloudinary();

  if (!configured) {
    return {
      url: `https://placehold.co/1200x1600?text=${encodeURIComponent(file.originalname)}`,
      publicId: `local_${Date.now()}`,
      fileName: file.originalname,
      mimeType: file.mimetype,
    };
  }

  const base64Data = file.buffer.toString('base64');
  const dataUri = `data:${file.mimetype};base64,${base64Data}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: process.env.CLOUDINARY_FOLDER || 'ers-receipts',
    resource_type: 'image',
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    fileName: file.originalname,
    mimeType: file.mimetype,
  };
};

module.exports = { uploadReceipt };
