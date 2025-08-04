
import { AuthProvider } from './context/AuthContext';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.tsx'

// In your main App.tsx or index.tsx
//import { ToastContainer } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';

//<ToastContainer position="top-right" autoClose={5000} /> 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);