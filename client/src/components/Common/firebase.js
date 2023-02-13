
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCNrkrFAdA8_ZIn2Bf1ytmLlKtA-_iey6I",
    authDomain: "kode-supplier.firebaseapp.com",
    projectId: "kode-supplier",
    storageBucket: "kode-supplier.appspot.com",
    messagingSenderId: "805386123472",
    appId: "1:805386123472:web:df7335785ee828918d46d5",
    measurementId: "G-L80SE94LX0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { storage, app };