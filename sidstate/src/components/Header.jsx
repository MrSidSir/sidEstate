// Importing search icon from react-icons
import { FaSearch } from 'react-icons/fa';
// Importing navigation and routing hooks/components
import { Link, useNavigate } from 'react-router-dom';
// Importing Redux hook to access state
import { useSelector } from 'react-redux';
// Importing React hooks
import { useEffect, useState } from 'react';

// Header component definition
export default function Header() {
  // Getting current user from Redux store
  const { currentUser } = useSelector((state) => state.user);
  // State to manage the search input value
  const [searchTerm, setSearchTerm] = useState('');
  // Hook to programmatically navigate
  const navigate = useNavigate();

  // Function to handle search form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const urlParams = new URLSearchParams(window.location.search); // Get current URL search params
    urlParams.set('searchTerm', searchTerm); // Set the search term in URL params
    const searchQuery = urlParams.toString(); // Convert params to query string
    navigate(`/search?${searchQuery}`); // Navigate to the search results page with query
  };

  // Effect to populate searchTerm from URL when component mounts or URL changes
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search); // Get URL search params
    const searchTermFromUrl = urlParams.get('searchTerm'); // Extract search term
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl); // Set the searchTerm state
    }
  }, [location.search]); // Run effect when URL search part changes

  return (
    // Header container with background and shadow
    <header className='bg-slate-200 shadow-md'>
      {/* Flex container for content inside header */}
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        {/* Logo/Title linking to home page */}
        <Link to='/'>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>Sid</span>
            <span className='text-slate-700'>Estate</span>
          </h1>
        </Link>

        {/* Search form with input and icon */}
        <form
          onSubmit={handleSubmit}
          className='bg-slate-100 p-3 rounded-lg flex items-center'
        >
          <input
            type='text'
            placeholder='Search...'
            className='bg-transparent focus:outline-none w-24 sm:w-64'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term as user types
          />
          <button>
            <FaSearch className='text-slate-600' /> {/* Search icon */}
          </button>
        </form>

        {/* Navigation links and profile picture */}
        <ul className='flex gap-4 items-center'>
          {/* Home link (visible on sm and larger screens) */}
          <li className='hidden sm:inline text-slate-700 hover:underline'>
            <Link to='/'>Home</Link>
          </li>
          {/* About link (visible on sm and larger screens) */}
          <li className='hidden sm:inline text-slate-700 hover:underline'>
            <Link to='/about'>About</Link>
          </li>
          {/* Sign Up link (visible on sm and larger screens) */}
          <li className='hidden sm:inline text-slate-700 hover:underline'>
            <Link to='/sign-up'>Sign Up</Link>
          </li>
          {/* Sign In link (visible on sm and larger screens) */}
          <li className='hidden sm:inline text-slate-700 hover:underline'>
            <Link to='/sign-in'>Sign In</Link>
          </li>
          {/* Profile icon or Sign In text based on user login status */}
          <li>
            <Link to='/profile'>
              {currentUser ? (
                <img
                  className='rounded-full h-7 w-7 object-cover'
                  src={currentUser.avatar} // User profile image
                  alt='profile'
                />
              ) : (
                <span className='text-slate-700 hover:underline'> profile </span> // Text if not logged in
              )}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
