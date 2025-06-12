// 🔄 React hook to use state and lifecycle effects
import { useEffect, useState } from 'react';
// 🔗 React Router to create a mailto link
import { Link } from 'react-router-dom';

// 📬 Main Contact component receives `listing` as a prop
export default function Contact({ listing }) {
  // 🧠 State to store the landlord's data (username, email)
  const [landlord, setLandlord] = useState(null);

  // 📝 State to hold user's message to landlord
  const [message, setMessage] = useState('');

  // ✍️ Handles message input typing
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  // 🔄 Fetch landlord details from backend when component mounts or listing.userRef changes
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        // 📡 API call to get landlord info by userRef
        const res = await fetch(`http://localhost:3000/api/user/${listing.userRef}`);
        const data = await res.json(); // 📦 parse response as JSON
        setLandlord(data); // ✅ save to state
      } catch (error) {
        console.log(error); // ❌ handle errors
      }
    };
    fetchLandlord(); // 🔁 run function
  }, [listing.userRef]); // ⛓️ dependency: refetch if userRef changes

  // 🧱 UI render
  return (
    <>
      {/* ✅ Only show this if landlord data is loaded */}
      {landlord && (
        <div className='flex flex-col gap-2'>
          {/* 👤 Shows landlord's username and listing name */}
          <p>
            Contact- +91 7355534404 <span className='font-semibold'>{landlord.username}</span>{' '}
            for{' '}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>

          {/* 📝 Textarea for user to write message */}
          <textarea
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={onChange} // 🧠 updates message state
            placeholder='Enter your message here...'
            className='w-full border p-3 rounded-lg'
          ></textarea>

          {/* 📧 Click to send email with subject and message body */}
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
