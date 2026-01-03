import { getFirestore, doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const db = getFirestore();

/**
 * Creates a new user document in Firestore
 * @param {string} uid - Firebase user ID
 * @param {object} userData - User information
 * @returns {Promise<void>}
 */
export const createUserDocument = async (uid, userData) => {
    try {
        const { name, email, photoURL, role } = userData;

        // Determine initial coin allocation based on role
        const initialCoins = role === 'worker' ? 10 : 50;

        const userDoc = {
            name,
            email,
            photoURL: photoURL || '',
            role: role.toLowerCase(),
            coin: initialCoins,
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp()
        };

        await setDoc(doc(db, 'users', uid), userDoc);

        return userDoc;
    } catch (error) {
        console.error('Error creating user document:', error);
        throw new Error('Failed to create user profile');
    }
};

/**
 * Gets user document from Firestore
 * @param {string} uid - Firebase user ID
 * @returns {Promise<object|null>}
 */
export const getUserDocument = async (uid) => {
    try {
        const userDocRef = doc(db, 'users', uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
            return { uid, ...userSnapshot.data() };
        }

        return null;
    } catch (error) {
        console.error('Error fetching user document:', error);
        throw new Error('Failed to fetch user data');
    }
};

/**
 * Updates user's last login timestamp
 * @param {string} uid - Firebase user ID
 * @returns {Promise<void>}
 */
export const updateLastLogin = async (uid) => {
    try {
        const userDocRef = doc(db, 'users', uid);
        await updateDoc(userDocRef, {
            lastLoginAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating last login:', error);
        // Non-critical error, don't throw
    }
};

/**
 * Checks if user document exists (for Google Sign-In users)
 * @param {string} uid - Firebase user ID
 * @returns {Promise<boolean>}
 */
export const checkUserExists = async (uid) => {
    try {
        const userDoc = await getUserDocument(uid);
        return userDoc !== null;
    } catch (error) {
        console.error('Error checking user existence:', error);
        return false;
    }
};
