import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router'
import { router } from './routes/route.jsx'
import AuthProvider from './context/Auth/AuthProvider.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <RouterProvider router={router}>
                <App />
            </RouterProvider>
        </AuthProvider>
    </StrictMode>,
)
