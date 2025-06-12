import React, { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase'; // ✅ Corrected: Path should point to firebase config file
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
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

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData((prevData) => ({
            ...prevData,
            imageUrls: [...prevData.imageUrls, ...urls],
          }));
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError('Image upload failed (max 2MB each)');
          setUploading(false);
        });
    } else {
      setImageUploadError('Maximum 6 images allowed');
    }
  };

  const storeImage = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        null,
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      imageUrls: prevData.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (id === 'sale' || id === 'rent') {
      setFormData((prevData) => ({ ...prevData, type: id }));
    } else if (['parking', 'furnished', 'offer'].includes(id)) {
      setFormData((prevData) => ({ ...prevData, [id]: checked }));
    } else {
      setFormData((prevData) => ({ ...prevData, [id]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
  // ✅ Validation checks
  if (formData.imageUrls.length < 1) {
    return setError('Upload at least one image');
  }

  if (+formData.discountPrice >= +formData.regularPrice) {
    return setError('Discount must be less than regular price');
  }

  setLoading(true);
  setError(false);

  // ✅ Create listing API call
  const res = await fetch('http://localhost:3000/api/listing/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...formData, userRef: currentUser._id }),
    credentials: 'include', // ✅ Include cookies
  });

  const data = await res.json();
  console.log('✅ Server response:', data); // ✅ Logs full backend response

  setLoading(false);

  // ✅ Check HTTP status
  if (!res.ok) {
    return setError(data.message || 'Something went wrong');
  }

  // ✅ Validate presence of ID to avoid /listing/undefined
  if (!data || !data._id) {
    console.error('❌ Listing created but no _id returned');
    return setError('Listing created, but no ID returned by server.');
  }

  // ✅ Navigate to created listing
  navigate(`/listing/${data._id}`);
} catch (err) {
  console.error('❌ Error during listing creation:', err);
  setError(err.message || 'Something went wrong');
  setLoading(false);
}

     };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>

      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          {/* Text inputs */}
          <input type='text' id='name' required value={formData.name} onChange={handleChange} className='border p-3 rounded-lg' placeholder='Name' />
          <textarea id='description' required value={formData.description} onChange={handleChange} className='border p-3 rounded-lg' placeholder='Description'></textarea>
          <input type='text' id='address' required value={formData.address} onChange={handleChange} className='border p-3 rounded-lg' placeholder='Address' />

          {/* Checkboxes */}
          <div className='flex gap-6 flex-wrap'>
            {['sale', 'rent', 'parking', 'furnished', 'offer'].map((id) => (
              <div key={id} className='flex items-center gap-2'>
                <input type='checkbox' id={id} onChange={handleChange} checked={formData[id] || formData.type === id} className='w-5' />
                <label htmlFor={id}>{id.charAt(0).toUpperCase() + id.slice(1)}</label>
              </div>
            ))}
          </div>

          {/* Numbers */}
          <div className='flex gap-4 flex-wrap'>
             <div className='flex flex-col'>
              <label htmlFor='bedroom'>Bedroom</label>
            <input type='number' id='bedroom' min='1' value={formData.bedroom} onChange={handleChange} className='p-3 border rounded-lg' placeholder='Bedroom' />
            </div>
            <div className='flex flex-col'>
    <label htmlFor='bathroom'>Bathroom</label>
            <input type='number' id='bathroom' min='1' value={formData.bathroom} onChange={handleChange} className='p-3 border rounded-lg' placeholder='Bathroom' />
            </div>
            <div className='flex flex-col'>
    <label htmlFor='regularPrice'>Regular Price</label>
            <input type='number' id='regularPrice' min='50' value={formData.regularPrice} onChange={handleChange} className='p-3 border rounded-lg' placeholder='Regular Price' />
             </div>
            {formData.offer && (
              <div className='flex flex-col'>
      <label htmlFor='discountPrice'>Discount Price</label>
              <input type='number' id='discountPrice' min='0' value={formData.discountPrice} onChange={handleChange} className='p-3 border rounded-lg' placeholder='Discount Price' />
             </div>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <div className='flex flex-col flex-1 gap-4'>
          <label className='font-semibold'>
            Images: <span className='text-gray-500 text-sm'>(Max 6, first is cover)</span>
          </label>
          <div className='flex gap-4'>
            <input onChange={(e) => setFiles(e.target.files)} type='file' id='images' accept='image/*' multiple className='p-3 border rounded w-full' />
            <button type='button' onClick={handleImageSubmit} disabled={uploading} className='p-3 text-green-700 border border-green-700 rounded hover:shadow-lg'>
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>{imageUploadError}</p>

          {formData.imageUrls.map((url, index) => (
            <div key={url} className='flex justify-between items-center border p-2'>
              <img src={url} alt='Listing' className='h-20 w-20 rounded object-cover' />
              <button onClick={() => handleRemoveImage(index)} className='text-red-700 uppercase hover:underline'>Delete</button>
            </div>
          ))}

          <button disabled={loading || uploading} className='bg-slate-700 text-white p-3 rounded hover:opacity-90'>
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}
