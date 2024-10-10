import { initializeApp } from 'firebase/app';
import { initializeFirestore  } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAeClskbm7yPuPbYWEQDtvWG-yZDFS3rBA",
  authDomain: "test-4a04f.firebaseapp.com",
  projectId: "test-4a04f",
  storageBucket: "test-4a04f.appspot.com",
  messagingSenderId: "202280500971",
  appId: "1:202280500971:web:c7ff93a0771ce8ac8908ae"
};

console.log(firebaseConfig)

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

const firestore = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

export { firestore };
