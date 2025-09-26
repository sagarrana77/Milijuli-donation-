import { initializeApp, getApps, getApp } from 'firebase/app';

const firebaseConfig = {
  "projectId": "claritychaincopy-5248246-a89a9",
  "appId": "1:558600078971:web:419c6aa09059581f9e84de",
  "apiKey": "AIzaSyC-DcgLVpAmpbJ-8I-zWzux8cOrrUgjrAs",
  "authDomain": "claritychaincopy-5248246-a89a9.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "558600078971"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
