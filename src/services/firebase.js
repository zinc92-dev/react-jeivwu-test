const firebaseConfig = {
  apiKey: 'AIzaSyDibIuRKmTgmsE4ZWfsor8a8JmmpM8LN3s',
  authDomain: 'minenoti-app.firebaseapp.com',
  projectId: 'minenoti-app',
  storageBucket: 'minenoti-app.appspot.com',
  messagingSenderId: '1175334579',
  appId: '1:1175334579:web:b116aec0a4f70445ed0ac6',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
