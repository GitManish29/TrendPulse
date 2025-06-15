/*
Project: TrendPulse Submission Site (React)
Features:
- Hosted on GitHub Pages via gh-pages
- Form with client-side validation
- Firebase Firestore backend for entries
*/

// package.json
{
  "name": "trendpulse-submission",
  "version": "1.0.0",
  "private": true,
  "homepage": "https://your-github-username.github.io/trendpulse-submission",
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-scripts": "5.0.1",
    "firebase": "^9.0.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "deploy": "npm run build && gh-pages -d build",
    "predeploy": "npm run build"
  },
  "devDependencies": {
    "gh-pages": "^4.0.0"
  }
}

// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// src/App.js
import React, { useState } from 'react';
import './App.css';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

function App() {
  const [form, setForm] = useState({ name: '', email: '', project: '', repo: '', ssh: '', proposal: '' });
  const [status, setStatus] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    // simple validation
    for (let key in form) {
      if (!form[key]) {
        setStatus('Please fill all fields');
        return;
      }
    }
    setStatus('Submitting...');
    try {
      await addDoc(collection(db, 'submissions'), {
        ...form,
        createdAt: Timestamp.now()
      });
      setStatus('Submission successful!');
      setForm({ name: '', email: '', project: '', repo: '', ssh: '', proposal: '' });
    } catch (err) {
      console.error(err);
      setStatus('Submission failed. Try again.');
    }
  };

  return (
    <div className="container">
      <h1>TrendPulse Project Submission</h1>
      <form onSubmit={handleSubmit}>
        {['name','email','project','repo','ssh'].map(field => (
          <div key={field} className="field">
            <label>{field.charAt(0).toUpperCase()+field.slice(1)}</label>
            <input
              type={field==='email'? 'email':'text'}
              name={field}
              value={form[field]}
              onChange={handleChange}
            />
          </div>
        ))}
        <div className="field">
          <label>Proposal</n          ><textarea name="proposal" rows="5" value={form.proposal} onChange={handleChange} />
        </div>
        <button type="submit">Submit 🚀</button>
        {status && <p className="status">{status}</p>}
      </form>
    </div>
  );
}

export default App;

// src/App.css
body { margin:0; font-family: Arial, sans-serif; background:#f9f9f9; }
.container { max-width:600px; margin:50px auto; padding:20px; background:#fff; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1); }
h1 { color:#0077cc; }
.field { margin-bottom:15px; }
label { display:block; margin-bottom:5px; font-weight:600; }
input, textarea { width:100%; padding:8px; border:1px solid #ddd; border-radius:4px; }
button { background:#0077cc; color:#fff; padding:10px 20px; border:none; border-radius:4px; cursor:pointer; }
.status { margin-top:10px; }

// .env (create in root, not committed)
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-msg-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id

// README.md
# TrendPulse Submission Site (React)

## Deployment to GitHub Pages
1. Install dependencies: `npm install`
2. Add your Firebase config in `.env`
3. Deploy: `npm run deploy`

## Firebase Setup
- Create Firestore database in Firebase console
- Enable read/write rules as needed

## Features
- Client-side form validation
- Stores submissions in Firestore
- Hosted via GitHub Pages
