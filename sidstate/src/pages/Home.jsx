import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
// import { Navigation } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';


export default function Home() {
  // 🔹 States for different listing types
  const [offerListings, setOfferListings] = useState([]); // recent offers
  const [saleListings, setSaleListings] = useState([]);   // for sale
  const [rentListings, setRentListings] = useState([]);   // for rent (fixed: previously it was an object `{}`)
 console.log(offerListings)
  // 🔹 Enable Swiper navigation
  SwiperCore.use([Navigation]);

  // 🐛 FIXED: use correct variable name
  console.log(offerListings); // to debug current offer listings

  // 🔹 Fetch listings on page load
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings(); // fetch rent listings after offers
        fetchSaleListings(); // fetch sale listings after offers
      } catch (error) {
        console.log(error); // debug if error happens in offer API
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/listing/get?type=sale&limit=4'); // 🐛 FIXED: 'listung' => 'listing'
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error); // 🐛 FIXED: was `log(error)` which would crash the app
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings(); // 🔹 initiate data loading
  }, []);  
  console.log(offerListings)
   

  return (
    <div>
      {/* 🔹 Top Section (Heading & Intro) */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span>
          <br />
          place with ease
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          Sid Estate is the best place to find your next perfect place to
          live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Let's get started...
        </Link>
      </div>

   <Swiper
  modules={[Navigation, Autoplay]}
  navigation
  autoplay={{
    delay: 3000,
    disableOnInteraction: false,
  }}
  loop={true}
  spaceBetween={50}
  slidesPerView={1}
  breakpoints={{
  640: {
    slidesPerView: 1,
  },
  768: {
    slidesPerView: 2,
  },
  1024: {
    slidesPerView: 3,
  },
}}
>
  {offerListings?.map((listing) => (
    
    <SwiperSlide key={listing._id}>
      
      
      <div
        className='h-[500px] w-full'
        style={{
          backgroundImage: `url(${listing.imageUrls[0]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>
    </SwiperSlide>
  ))}
</Swiper>


      {/* 🔹 Offer, Sale, and Rent Listings */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {/* 🟡 Offer Listings */}
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>
                Show more offers
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {/* 🔵 Rent Listings */}
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>
                Show more places for rent
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {/* 🔴 Sale Listings */}
        {saleListings && saleListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>
                Show more places for sale
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
