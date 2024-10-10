import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { firestore } from '../config/FirebaseConfig'; // Adjust the import path if needed

// Function to fetch or create a user in Firestore by Telegram ID
export const fetchOrCreateUserByTelegramId = async (telegramUserId, userInfo) => {
  try {
    // Step 1: Check if the user exists in Firestore by their Telegram ID
    const usersRef = collection(firestore, 'users'); // Reference to 'users' collection
    const q = query(usersRef, where('telegramUserId', '==', telegramUserId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // User exists, return the user data
      const userDoc = querySnapshot.docs[0];
      console.log('User exists: ', userDoc.data());
      return { id: userDoc.id, ...userDoc.data() };
    } else {
      // Step 2: If user doesn't exist, create a new user document in Firestore
      const newUserRef = await addDoc(usersRef, {
        telegramUserId: telegramUserId, // Store Telegram user ID
        name: userInfo.name || 'Unknown User', // Store other user info if available
        createdAt: new Date(),
      });

      console.log('New user created with ID: ', newUserRef.id);
      return { id: newUserRef.id, telegramUserId, ...userInfo }; // Return the newly created user
    }
  } catch (error) {
    console.error('Error fetching or creating user: ', error);
    throw error;
  }
};
