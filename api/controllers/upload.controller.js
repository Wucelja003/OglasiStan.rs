import cloudinary from '../utils/cloudinary.js';

export const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Nema fajlova za upload.' });
    }

    const uploads = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'oglasiStan', resource_type: 'image', format: 'webp', transformation: [{ quality: 'auto' }] },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.end(file.buffer);
      });
    });

    const urls = await Promise.all(uploads);
    res.status(200).json({ success: true, urls });
  } catch (error) {
    next(error);
  }
};
