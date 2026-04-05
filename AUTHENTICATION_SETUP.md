# Firebase Authentication Setup Guide

Complete authentication system with Email/Password and Google Sign-In now implemented! Here's how to set it up:

## 📋 Table of Contents
1. [Create Firebase Project](#firebase-setup)
2. [Configure Environment Variables](#environment-variables)
3. [Features Implemented](#features-implemented)
4. [How It Works](#how-it-works)
5. [Testing](#testing)

---

## 🔥 Firebase Setup

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Enter project name (e.g., "qpg-flow")
4. Accept terms and create project
5. Wait for project creation to complete

### Step 2: Enable Authentication
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
   - Click on Email/Password
   - Toggle ON for Email/Password
   - Toggle ON for "Email link (password-less sign-in)" (optional)
   - Save changes

3. Enable **Google Sign-In**
   - Click on Google
   - Toggle ON
   - Choose project support email
   - Save changes

### Step 3: Get Firebase Configuration
1. Click the ⚙️ **Settings icon** → **Project settings**
2. Under "Your apps" section, look for your web app
3. If no web app exists:
   - Click **"Add app"** → **Web** (</>)
   - Name it (e.g., "qpg-flow-web")
   - Check "Also set up Firebase Hosting"
   - Click "Register app"

4. Copy the Firebase config object that looks like:
```javascript
{
  apiKey: "AIza...",
  authDomain: "qpg-flow.firebaseapp.com",
  projectId: "qpg-flow",
  storageBucket: "qpg-flow.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
}
```

### Step 4: Setup Google OAuth Credentials (for Google Sign-In)
1. In Firebase Console → **Settings** → **Service Accounts**
2. Click on the OAuth Consent Screen link or go to Google Cloud Console
3. Configure OAuth Consent Screen:
   - User type: Internal or External
   - Fill required fields (app name, support email, logo)
   - Add scopes: `email`, `profile`, `openid`
   - Add test users if internal
   - Complete setup

---

## 🔑 Environment Variables

### Create .env file in `/app` directory:

```bash
# Copy the template
cp .env.example .env
```

### Edit `.env` with your Firebase credentials:
```
REACT_APP_FIREBASE_API_KEY=your_api_key_from_firebase_console
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

REACT_APP_API_URL=http://localhost:5000
```

### Important Security Notes:
⚠️ **NEVER commit .env to git**
- Add `.env` to `.gitignore`
- Use `.env.example` for sharing config template
- Firebase API keys in browser apps are safe (tied to your project domain)
- Implement Firestore Security Rules to protect data

---

## ✨ Features Implemented

### Authentication Features:
✅ **Email/Password Registration** - Sign up with email & password
✅ **Email/Password Login** - Sign in with credentials
✅ **Google Sign-In** - One-click Google login
✅ **Persistent Sessions** - Stay logged in across page refreshes
✅ **Protected Routes** - Dashboard only accessible when authenticated
✅ **Auto-redirect** - Authenticated users redirected from login to dashboard
✅ **User Context** - Global auth state across app
✅ **Logout** - Sign out from dashboard

### File Structure:
```
app/src/
├── config/
│   ├── firebase.js              # Firebase config & initialization
│   └── authUtils.js             # Auth functions (login, signup, logout, etc)
├── context/
│   └── AuthContext.jsx          # Auth context provider & useAuth hook
├── components/
│   └── ProtectedRoute.jsx       # Route protection components
├── pages/
│   ├── Login.jsx                # Login page with email & Google auth
│   ├── Signup.jsx               # Signup page
│   ├── Dashboard.jsx            # Protected dashboard
│   └── Landing.jsx              # Public landing page
└── App.jsx                       # Updated with AuthProvider & routes
```

---

## 🔄 How It Works

### Authentication Flow:

```
User Visits App
        ↓
AuthProvider Checks Auth State
        ↓
    Is Authenticated?
    ↙            ↘
   YES            NO
    ↓              ↓
Dashboard      Login/Signup
              ↓           ↓
          Email/Pwd  Google Sign-In
              ↓           ↓
          Same Auth Logic
              ↓
          Create User
              ↓
          Navigate to Dashboard
```

### Key Functions:

**Login:**
```javascript
import { loginWithEmail, loginWithGoogle } from '../config/authUtils';

const result = await loginWithEmail(email, password);
if (result.success) {
  // User logged in!
  navigate('/dashboard');
} else {
  // Show error
  console.error(result.error);
}
```

**Check Current User:**
```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, loading, isAuthenticated } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return <div>Welcome, {user.email}!</div>;
}
```

**Logout:**
```javascript
import { logoutUser } from '../config/authUtils';

const result = await logoutUser();
if (result.success) {
  navigate('/login');
}
```

---

## 🧪 Testing

### Test Email/Password Auth:
1. Go to http://localhost:3000/signup
2. Enter test email and password
3. Click "Continue"
4. Should redirect to dashboard ✓

### Test Google Sign-In:
1. Go to http://localhost:3000/login or /signup
2. Click "continue with google"
3. Complete Google OAuth flow
4. Should redirect to dashboard ✓

### Test Protected Routes:
1. Without logging in, try accessing /dashboard
2. Should redirect to /login ✓
3. Log in, then try /login
4. Should redirect to /dashboard ✓

### Test Logout:
1. Log in (any method)
2. Go to dashboard
3. Click "Log out" button
4. Should redirect to login ✓
5. Session cleared, try accessing dashboard
6. Should redirect to login ✓

---

## 🛡️ Security Best Practices

1. **Firestore Rules** - Set strict read/write rules in Firebase:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
  }
}
```

2. **Backend Validation** - Always verify tokens on backend:
```python
from firebase_admin import auth

try:
    decoded_token = auth.verify_id_token(token)
    uid = decoded_token['uid']
except auth.ExpiredSignInError:
    # Handle expired token
finally:
    # Verify user before returning sensitive data
```

3. **Environment Security** - Never expose API keys in frontend (it's OK, they're public-facing)

4. **HTTPS Only** - Use HTTPS in production

---

## 🐛 Troubleshooting

### "Firebase App not initialized"
- Check `.env` file has all required variables
- Restart dev server: `npm start`

### "Google Sign-in popup blocked"
- Check browser popup permissions
- Allow popups for localhost in browser settings

### "Email already in use"
- Use different email or reset via Firebase Console
- Authentication → Users → Delete test user

### "Too many requests"
- Firebase limits login attempts
- Wait 15-30 minutes before retrying

### Backend Token Verification (if needed)
```python
# app.py
from firebase_admin import credentials, initialize_app, auth
import firebase_admin

# Initialize Firebase Admin SDK
cred = credentials.Certificate('path/to/serviceAccountKey.json')
firebase_admin.initialize_app(cred)

@app.route('/api/protected')
def protected_route():
    token = request.headers.get('Authorization', '').split(' ')[1]
    try:
        decoded = auth.verify_id_token(token)
        user_id = decoded['uid']
        # Access to user-specific data
        return {'user': user_id}
    except Exception as e:
        return {'error': str(e)}, 401
```

---

## 📚 Resources

- [Firebase Docs](https://firebase.google.com/docs)
- [Firebase Auth Reference](https://firebase.google.com/docs/auth)
- [Google Sign-In Setup](https://firebase.google.com/docs/auth/web/google-signin)
- [React Firebase Integration](https://github.com/FirebaseExtended/firebase-web-quickstarts)

---

## ✅ Next Steps

1. ✅ Firebase project created
2. ✅ Authentication enabled
3. ✅ Configuration added to `.env`
4. ✅ Auth system implemented in app
5. **→ Test authentication flows**
6. **→ Connect backend APIs with user verification** (optional)
7. **→ Add Firestore for user data** (if needed)

You're all set! Your QPG Flow app now has professional authentication. 🚀
