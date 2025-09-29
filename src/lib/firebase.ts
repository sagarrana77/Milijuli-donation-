import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  "projectId": "clarity-chainfinal2-5492-9f214",
  "appId": "1:84723762935:web:137a6d525928256a8d35f2",
  "apiKey": "AIzaSyBijGQCTwKQNBb4ZrvWnhlpngmEwLfhbmM",
  "authDomain": "clarity-chainfinal2-5492-9f214.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "84723762935"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Connect to emulators if running locally
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    try {
        console.log('Connecting to Firebase emulators...');
        connectAuthEmulator(auth, 'http://localhost:9099');
        connectFirestoreEmulator(db, 'localhost', 8080);
        connectStorageEmulator(storage, 'localhost', 9199);
        console.log('Successfully connected to Firebase emulators.');
    } catch(e) {
        console.warn('Could not connect to Firebase emulators. This is normal if you are not running them.', e)
    }
}


export { app, auth, db, storage };
