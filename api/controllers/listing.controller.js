import Listing from "../models/listing.module.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
    try {
        // Vlasnik oglasa je uvek prijavljeni korisnik (iz tokena), ne ono što pošalje klijent
        const listing = await Listing.create({ ...req.body, userRef: req.user.id });
        return res.status(201).json(listing);
    } catch (error) {
       next(error);
    }
};

export const searchListings = async (req, res, next) => {
    try {
        const {
            searchTerm = '',
            type,
            furnished,
            parking,
            minPrice,
            maxPrice,
            bedrooms,
            bathrooms,
            sort = 'createdAt',
            order = 'desc',
            limit = 9,
            startIndex = 0,
        } = req.query;

        const query = {};

        // Pretraga po nazivu, opisu i adresi.
        // Escapujemo specijalne regex znakove da korisnički unos ne bi mogao
        // da napravi skup regex (ReDoS) ili neočekivano poklapanje.
        if (searchTerm) {
            const safeTerm = String(searchTerm).slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.$or = [
                { name: { $regex: safeTerm, $options: 'i' } },
                { address: { $regex: safeTerm, $options: 'i' } },
                { description: { $regex: safeTerm, $options: 'i' } },
            ];
        }

        // Tip: prodaja / izdavanje
        if (type && type !== 'sve') {
            query.type = type;
        }

        // Boolean filteri
        if (furnished === 'true') query.furnished = true;
        if (parking === 'true') query.parking = true;
        if (req.query.terrace === 'true') query.terrace = true;

        // Broj soba i kupatila (minimum)
        if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
        if (bathrooms) query.bathrooms = { $gte: Number(bathrooms) };

        // Opseg cena
        if (minPrice || maxPrice) {
            query.regularPrice = {};
            if (minPrice) query.regularPrice.$gte = Number(minPrice);
            if (maxPrice) query.regularPrice.$lte = Number(maxPrice);
        }

        const listings = await Listing.find(query)
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .limit(Math.min(Number(limit) || 9, 50))
            .skip(Number(startIndex));

        const total = await Listing.countDocuments(query);

        res.status(200).json({ listings, total });
    } catch (error) {
        next(error);
    }
};

export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) return next(errorHandler(404, 'Listing not found'));
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
};

export const getUserListings = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(403, 'You can only view your own listings'));
    try {
        const listings = await Listing.find({ userRef: req.params.id });
        res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
};

export const updateListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) return next(errorHandler(404, 'Listing not found'));
        if (req.user.id !== listing.userRef) return next(errorHandler(403, 'You can only edit your own listings'));
        // Vlasnik se ne može promeniti kroz izmenu oglasa
        const updated = await Listing.findByIdAndUpdate(
            req.params.id,
            { ...req.body, userRef: listing.userRef },
            { new: true, runValidators: true },
        );
        res.status(200).json(updated);
    } catch (error) {
        next(error);
    }
};

export const deleteListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) return next(errorHandler(404, 'Listing not found'));
        if (req.user.id !== listing.userRef) return next(errorHandler(403, 'You can only delete your own listings'));
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('Listing has been deleted');
    } catch (error) {
        next(error);
    }
};