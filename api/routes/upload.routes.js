import express from 'express';
import multer from 'multer';
import { uploadImages } from '../controllers/upload.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Čuvamo slike u memoriji (buffer), ne na disku
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB po slici
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Dozvoljeni su samo fajlovi slika.'), false);
  },
});

router.post('/', verifyToken, upload.array('images', 8), uploadImages);

export default router;
