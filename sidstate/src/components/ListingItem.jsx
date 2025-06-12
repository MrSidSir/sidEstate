import { Link } from 'react-router-dom'; // 🔗 Used to navigate to detail page via <Link>
import { MdLocationOn } from 'react-icons/md'; // 📍 Location icon from react-icons

// 🏠 Component to render a single listing item (like a card)
export default function ListingItem({ listing }) {
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
      {/* 🔗 Clicking the card navigates to the listing details page */}
      <Link to={`/listing/${listing._id}`}>
        {/* 🖼️ Listing image or fallback default */}
        <img
          src={
            listing.imageUrls[0] || // ✅ Use first image if available
            'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg' // 🔁 Fallback image
          }
          alt='listing cover' // 🏷️ Alt text for image
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300' // 🎨 Styling for image and hover effect
        />

        {/* 📦 Listing details below image */}
        <div className='p-3 flex flex-col gap-2 w-full'>
          {/* 🏷️ Property name/title */}
          <p className='truncate text-lg font-semibold text-slate-700'>
            {listing.name}
          </p>

          {/* 📍 Address with location icon */}
          <div className='flex items-center gap-1'>
            <MdLocationOn className='h-4 w-4 text-green-700' />
            <p className='text-sm text-gray-600 truncate w-full'>
              {listing.address}
            </p>
          </div>

          {/* 🧾 Short description */}
          <p className='text-sm text-gray-600 line-clamp-2'>
            {listing.description}
          </p>

          {/* 💲 Price display (with or without discount) */}
          <p className='text-slate-500 mt-2 font-semibold '>
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString('en-US') // 🔻 Discounted price if offer is true
              : listing.regularPrice.toLocaleString('en-US')} 
            {listing.type === 'rent' && ' / month'} {/* 🏷️ Rent label */}
          </p>

          {/* 🛏️🛁 Bedroom and Bathroom count */}
          <div className='text-slate-700 flex gap-4'>
            <div className='font-bold text-xs'>
              {listing.bedroom > 1
                ? `${listing.bedroom} beds ` // 🛏️ Plural beds
                : `${listing.bedroom} bed `} 
            </div>
            <div className='font-bold text-xs'>
              {listing.bathroom > 1
                ? `${listing.bathroom} baths ` // 🛁 Plural baths
                : `${listing.bathroom} bath `} 
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
