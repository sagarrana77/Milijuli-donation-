
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
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

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

if (process.env.NODE_ENV === 'development') {
    try {
        // Important: Use 127.0.0.1 instead of localhost to avoid potential network issues.
        // Check if emulators are already connected to prevent errors during hot-reloading.
        if (auth.emulatorConfig === null) {
            console.log("Connecting to Firebase Auth emulator...");
            connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
        }
        // @ts-ignore - _settings is a private property but a reliable way to check emulator connection for Firestore
        if (db._settings.host.includes('localhost') || db._settings.host.includes('127.0.0.1')) {
            // Already connected
        } else {
            console.log("Connecting to Firebase Firestore emulator...");
            connectFirestoreEmulator(db, '127.0.0.1', 8080);
        }
        console.log("Successfully configured Firebase emulators.");
    } catch (error) {
        console.error("Error connecting to Firebase emulators:", error);
    }
}


export { app, auth, db, storage };
