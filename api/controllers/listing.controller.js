import Listing from "../models/listing.module.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
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

        // Pretraga po nazivu, opisu i adresi
        if (searchTerm) {
            query.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { address: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
            ];
        }

        // Tip: prodaja / izdavanje
        if (type && type !== 'sve') {
            query.type = type;
        }

        // Boolean filteri
        if (furnished === 'true') query.furnished = true;
        if (parking === 'true') query.parking = true;

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
            .limit(Number(limit))
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
        if (!listing) return next(errorHandler(404, 'Oglas nije pronađen'));
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
};

export const getUserListings = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(403, 'Možete videti samo svoje oglase'));
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
        if (!listing) return next(errorHandler(404, 'Oglas nije pronađen'));
        if (req.user.id !== listing.userRef) return next(errorHandler(403, 'Možete urediti samo svoje oglase'));
        const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        next(error);
    }
};

export const deleteListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) return next(errorHandler(404, 'Oglas nije pronađen'));
        if (req.user.id !== listing.userRef) return next(errorHandler(403, 'Možete obrisati samo svoje oglase'));
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('Oglas je obrisan');
    } catch (error) {
        next(error);
    }
};