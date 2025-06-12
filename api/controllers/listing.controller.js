import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

/* ✅ Create a new listing using request body */
export const createListing = async (req, res, next) => {
  try {
    const data = req.body; // Collect all form data from frontend
    const listing = await Listing.create(data); // Save listing to MongoDB
    return res.status(201).json(listing); // Return newly created listing
  } catch (error) {
    next(error);
  }
};


/* ✅ Delete a listing by ID (only if created by logged-in user) */
export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id); // Find listing by ID

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  // Only the user who created the listing can delete it
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id); // Delete listing
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};


/* ✅ Update a listing by ID (only by creator) */
export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id); // Find existing listing

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only update your own listings!'));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return the updated document
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};


/* ✅ Get a single listing by its ID */
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id); // Find listing by ID
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing); // Return listing data
  } catch (error) {
    next(error);
  }
};


/* ✅ Get multiple listings with filters, pagination, and search */
export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9; // how many listings per page
    const startIndex = parseInt(req.query.startIndex) || 0; // pagination starting point

    // Filter: offer (boolean)
    let offer = req.query.offer;
    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] }; // no filter applied
    }

    // Filter: furnished (boolean)
    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    // Filter: parking (boolean)
    let parking = req.query.parking;
    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    // Filter: type (sale/rent)
    let type = req.query.type;
    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || ''; // search by name
    const sort = req.query.sort || 'createdAt'; // sort field
    const order = req.query.order || 'desc'; // sort order

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' }, // search by name (case-insensitive)
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order }) // sort dynamically
      .limit(limit) // limit results
      .skip(startIndex); // skip results for pagination

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
