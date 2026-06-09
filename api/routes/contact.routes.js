import express from 'express';
import { contactLandlord } from '../controllers/contact.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/', verifyToken, contactLandlord);

export default router;
