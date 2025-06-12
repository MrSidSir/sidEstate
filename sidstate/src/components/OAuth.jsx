import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../Firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const res = await fetch('http://localhost:3000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        }),
      });

      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      console.log('Could not sign in with Google:', error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
    >
      Continue with Google
    </button>
  );
}



// import { GoogleAuthProvider, signInWithRedirect, getRedirectResult, getAuth } from 'firebase/auth';
// import { app } from '../firebase';
// import { useDispatch } from 'react-redux';
// import { signInSuccess } from '../redux/user/userSlice';
// import { useNavigate } from 'react-router-dom';
// import { useEffect } from 'react';

// export default function OAuth() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleGoogleClick = async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       const auth = getAuth(app);
//       await signInWithRedirect(auth, provider); // Redirects immediately
//     } catch (error) {
//       console.log('Could not initiate Google Sign-In redirect', error);
//     }
//   };

//   useEffect(() => {
//     const auth = getAuth(app);
//     getRedirectResult(auth)
//       .then(async (result) => {
//         if (result && result.user) {
//           const user = result.user;

//           // Send to backend
//           const res = await fetch('/api/auth/google', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               name: user.displayName,
//               email: user.email,
//               photo: user.photoURL,
//             }),
//           });

//           const data = await res.json();
//           dispatch(signInSuccess(data));
//           navigate('/');
//         }
//       })
//       .catch((error) => {
//         console.log('Google redirect sign-in error:', error);
//       });
//   }, [dispatch, navigate]);

//   return (
//     <button 
//       onClick={handleGoogleClick}
//       type='button'
//       className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
//     >
//       Continue with Google
//     </button>
//   );
// }
