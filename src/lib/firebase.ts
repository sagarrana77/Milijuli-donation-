
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  "projectId": "clarity-chainfinal2-5492-9f214",
  "appId": "1:84723762935:web:137a6d525928256a8d35f2",
  "apiKey": "AIzaSyBijGQCTwKQNBb4ZrvWnhlpngmEwLfhbmM",
  "authDomain": "clarity-chainfinal2-5492-9f214.firebaseapp.com",
  "measurementId": "G-551LB03C9E",
  "storageBucket": "clarity-chainfinal2-5492-9f214.appspot.com",
  "messagingSenderId": "84723762935"
};

// Force the authDomain to solve for odd development environments.
if (typeof window !== 'undefined' && window.location.hostname.includes('cloudworkstations.dev')) {
    firebaseConfig.authDomain = 'clarity-chainfinal2-5492-9f214.firebaseapp.com';
}


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
