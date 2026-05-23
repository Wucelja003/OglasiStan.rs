import express from 'express';
import { createListing, searchListings, getListing, updateListing, getUserListings, deleteListing } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.get('/search', searchListings);
router.get('/get/:id', getListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/user/:id', verifyToken, getUserListings);
router.delete('/delete/:id', verifyToken, deleteListing);

export default router;