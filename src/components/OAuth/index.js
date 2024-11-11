import React, { useState } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import AppLink from '../AppLink';
import Loader from '../Loader';
import { useStateContext } from '../../utils/context/StateContext';
import { setToken } from '../../utils/token';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import styles from './OAuth.module.sass';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQutn3GLiZLDQutVE0qnBxfFgzFNo04FA",
  authDomain: "unitrader-4907f.firebaseapp.com",
  projectId: "unitrader-4907f",
  storageBucket: "unitrader-4907f.firebasestorage.app",
  messagingSenderId: "1060735042752",
  appId: "1:1060735042752:web:40b992be4a3feda1d7d925"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
// provider.setCustomParameters({
//   hd: "iiitkottayam.ac.in" 
// });

const OAuth = ({ className, handleClose, handleOAuth, disable }) => {
  const { setCosmicUser } = useStateContext();
  const { push } = useRouter();
  const [fillFiledMessage, setFillFiledMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoHome = () => {
    push('/');
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setFillFiledMessage('');
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Verify email domain
      if (!user.email.endsWith('@iiitkottayam.ac.in') && !user.email.endsWith('@gmail.com')) {
        setFillFiledMessage('Please use your college email address');
        setLoading(false);
        return;
      }

      // Create user object
      const cosmicUser = {
        user: {
          id: user.uid,
          first_name: user.displayName?.split(' ')[0] || '',
          avatar_url: user.photoURL || '',
          email: user.email,
        }
      };

      

      // Update state and token
      setCosmicUser(cosmicUser.user);
      setToken({
        id: cosmicUser.user.id,
        first_name: cosmicUser.user.first_name,
        avatar_url: cosmicUser.user.avatar_url
      });

      setFillFiledMessage('Successfully signed in!');
      handleOAuth(cosmicUser.user);
      handleClose();

    } catch (error) {
      console.error('Error during Google sign-in:', error);
      setFillFiledMessage(
        error.code === 'auth/popup-closed-by-user'
          ? 'Sign-in cancelled'
          : 'Error signing in. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(className, styles.transfer)}>
      <div className={cn('h4', styles.title)}>
        Authentication with{' '}
        <AppLink target="_blank" href={`#`}>
          your college email
        </AppLink>
      </div>
      <div className={styles.text}>
        To sell an item you need to sign in with your college email address at{' '}
        <AppLink target="_blank" href={`#`}>
          UniTrader
        </AppLink>
      </div>
      <div className={styles.error}>{fillFiledMessage}</div>
      <div className={styles.btns}>
        <button
          onClick={handleGoogleSignIn}
          className={cn('button', styles.button, styles.googleButton)}
          disabled={loading}
        >
          {loading ? (
            <Loader />
          ) : (
            <>
              
              Sign in with Google
            </>
          )}
        </button>
        <button
          onClick={disable ? handleGoHome : handleClose}
          className={cn('button-stroke', styles.button)}
        >
          {disable ? 'Return Home Page' : 'Cancel'}
        </button>
      </div>
    </div>
  );
};

export default OAuth;