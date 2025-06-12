import { useEffect, useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../Firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user); // Get current logged-in user
  const navigate = useNavigate(); // For redirecting after successful update
  const params = useParams(); // To get listingId from URL
  const [files, setFiles] = useState([]); // Store selected image files
  const [formData, setFormData] = useState({
    imageUrls: [], // Array of uploaded image URLs
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedroom: 1,
    bathroom: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false); // To show image upload errors
  const [uploading, setUploading] = useState(false); // To show uploading status
  const [error, setError] = useState(false); // To show form submission errors
  const [loading, setLoading] = useState(false); // To show form loading spinner

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId; // Get listing ID from URL
      const res = await fetch(`http://localhost:3000/api/listing/get/${listingId}`); // Fetch listing details from backend
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message); // Log error if failed
        return;
      }
      setFormData(data); // Populate form with fetched data
    };

    fetchListing();
  }, []);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i])); // Upload each image to Firebase
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls), // Append uploaded image URLs to formData
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    // Upload single image to Firebase and return its download URL
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name; // Unique filename
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error); // Upload failed
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL); // Upload succeeded, return URL
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    // Remove image from formData by index
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    // Handle form field change
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id, // Update type based on selected radio
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked, // Toggle boolean fields
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value, // Update text/number fields
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch(`http://localhost:3000/api/listing/update/${params.listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id, // Send user ID as reference
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message); // Show backend error
      }
      navigate(`/listing/${data._id}`); // Redirect to updated listing page
    } catch (error) {
      setError(error.message); // Catch network or parsing error
      setLoading(false);
    }
  };

  return (
       <main className='p-4 max-w-4xl mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-6'>Update Listing</h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-6'>
        <div className='flex flex-col gap-4 flex-1'>
          <input type='text' id='name' value={formData.name} onChange={handleChange} placeholder='Name' required className='border p-2 rounded' />
          <textarea id='description' value={formData.description} onChange={handleChange} placeholder='Description' required className='border p-2 rounded' />
          <input type='text' id='address' value={formData.address} onChange={handleChange} placeholder='Address' required className='border p-2 rounded' />
          <div className='flex gap-4'>
            <input type='number' id='bedroom' value={formData.bedroom} onChange={handleChange} className='w-1/2 border p-2 rounded' placeholder='Bedrooms' />
            <input type='number' id='bathroom' value={formData.bathroom} onChange={handleChange} className='w-1/2 border p-2 rounded' placeholder='Bathrooms' />
          </div>
          <div className='flex gap-4'>
            <input type='number' id='regularPrice' value={formData.regularPrice} onChange={handleChange} className='w-1/2 border p-2 rounded' placeholder='Regular Price' />
            <input type='number' id='discountPrice' value={formData.discountPrice} onChange={handleChange} className='w-1/2 border p-2 rounded' placeholder='Discount Price' />
          </div>
          <div className='flex flex-wrap gap-4'>
            <label>
              <input type='checkbox' id='parking' checked={formData.parking} onChange={handleChange} /> Parking
            </label>
            <label>
              <input type='checkbox' id='furnished' checked={formData.furnished} onChange={handleChange} /> Furnished
            </label>
            <label>
              <input type='checkbox' id='offer' checked={formData.offer} onChange={handleChange} /> Offer
            </label>
            <label>
              <input type='radio' id='sale' checked={formData.type === 'sale'} onChange={handleChange} /> Sale
            </label>
            <label>
              <input type='radio' id='rent' checked={formData.type === 'rent'} onChange={handleChange} /> Rent
            </label>
          </div>
        </div>

        <div className='flex flex-col gap-4 flex-1'>
          <p className='font-medium'>Images (max 6)</p>
          <input onChange={(e) => setFiles(e.target.files)} type='file' accept='image/*' multiple className='border p-2' />
          <button type='button' onClick={handleImageSubmit} disabled={uploading} className='bg-blue-500 text-white p-2 rounded'>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          {imageUploadError && <p className='text-red-500'>{imageUploadError}</p>}
          <div className='grid grid-cols-3 gap-2'>
            {formData.imageUrls.map((url, idx) => (
              <div key={idx} className='relative'>
                <img src={url} alt='uploaded' className='w-full h-24 object-cover rounded' />
                <button type='button' onClick={() => handleRemoveImage(idx)} className='absolute top-0 right-0 text-white bg-red-600 p-1 text-xs rounded-full'>X</button>
              </div>
            ))}
          </div>
          <button disabled={loading || uploading} className='bg-green-600 text-white p-3 rounded font-semibold'>
            {loading ? 'Updating...' : 'Update Listing'}
          </button>
          {error && <p className='text-red-500'>{error}</p>}
        </div>
      </form>
    </main>
  );
}
