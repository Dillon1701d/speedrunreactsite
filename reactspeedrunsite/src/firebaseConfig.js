import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyATCuzO8JAHiiR8HLjGb2P6Mzjch8QdBLA",

    authDomain: "speedrunsite.firebaseapp.com",
  
    projectId: "speedrunsite",
  
    storageBucket: "speedrunsite.firebasestorage.app",
  
    messagingSenderId: "355279977330",
  
    appId: "1:355279977330:web:8d6124e76c1584a97afbeb"
  
};

const app = initializeApp(firebaseConfig);
export default app;
