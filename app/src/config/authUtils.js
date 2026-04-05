import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { auth } from './firebase';

const googleProvider = new GoogleAuthProvider();

// Enable persistence (auto-login)
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Persistence error:', error);
});

/**
 * Register a new user with email and password
 */
export const signUpWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { 
      success: false, 
      error: mapFirebaseError(error.code, error.message) 
    };
  }
};

/**
 * Login with email and password
 */
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { 
      success: false, 
      error: mapFirebaseError(error.code, error.message) 
    };
  }
};

/**
 * Login with Google
 */
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (error) {
    return { 
      success: false, 
      error: mapFirebaseError(error.code, error.message) 
    };
  }
};

/**
 * Logout current user
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Listen to auth state changes
 */
export const onUserStateChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

/**
 * Get user ID token for backend requests
 */
export const getUserToken = async () => {
  try {
    const token = await auth.currentUser?.getIdToken();
    return token;
  } catch (error) {
    console.error('Token error:', error);
    return null;
  }
};

/**
 * Map Firebase error codes to user-friendly messages
 */
const mapFirebaseError = (code, message) => {
  const errorMap = {
    'auth/email-already-in-use': 'Email is already registered. Please login or use a different email.',
    'auth/invalid-email': 'Invalid email address. Please check and try again.',
    'auth/weak-password': 'Password should be at least 6 characters long.',
    'auth/user-not-found': 'No account found with this email. Please sign up first.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/too-many-requests': 'Too many login attempts. Please try again later.',
    'auth/operation-not-allowed': 'This operation is not allowed. Please contact support.',
    'auth/account-exists-with-different-credential': 'An account already exists with this email using a different method.',
    'auth/popup-blocked': 'Google sign-in popup was blocked. Please check your browser settings.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
    'auth/network-request-failed': 'Network error. Please check your internet connection.',
  };

  return errorMap[code] || message || 'An error occurred. Please try again.';
};
