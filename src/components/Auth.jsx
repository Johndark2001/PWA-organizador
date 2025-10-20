// src/components/Auth.jsx

import React, { useState } from 'react';
// Importamos las funciones de autenticación que necesitamos de Firebase
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
// Importamos la instancia 'auth' que configuramos en firebase.js
import { auth } from '../firebase';
import { useSession } from "../contexts/SessionContext";

const Auth = () => {
    // Estados para guardar el email y la contraseña que el usuario escribe
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Estado para mostrar errores al usuario
    const [error, setError] = useState(null);
    const { signIn } = useSession();

    // Función para manejar el registro con email y contraseña
    const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();
        // guardamos la sesión local para que syncService pueda usar el token
        signIn({ user: { email: userCredential.user.email, uid: userCredential.user.uid }, credential: idToken });
        console.log("Usuario registrado exitosamente!");
    } catch (error) {
        console.error("Error en el registro:", error.code);
        // Ahora revisamos el código de error específico de Firebase
        if (error.code === 'auth/email-already-in-use') {
            setError("Este correo electrónico ya está registrado. Intenta iniciar sesión.");
        } else if (error.code === 'auth/weak-password') {
            setError("La contraseña debe tener al menos 6 caracteres.");
        } else {
            setError("Ocurrió un error al registrar el usuario.");
        }
    }
};

    // Función para manejar el inicio de sesión con email y contraseña
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();
        signIn({ user: { email: userCredential.user.email, uid: userCredential.user.uid }, credential: idToken });
        console.log("Usuario ha iniciado sesión!");
        } catch (error) {
            console.error("Error en el inicio de sesión:", error);
            setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
        }
    };

    // Función para manejar el inicio de sesión con Google
    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        setError(null);
        try {
        const result = await signInWithPopup(auth, provider);
        const idToken = await result.user.getIdToken();
        signIn({ user: { email: result.user.email, uid: result.user.uid }, credential: idToken });
        console.log("Usuario ha iniciado sesión con Google!");
        } catch (error) {
            console.error("Error con Google Sign-In:", error);
            setError("No se pudo iniciar sesión con Google.");
        }
    };

    // JSX: La estructura visual del componente con clases de Tailwind CSS
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-6">
                <div className="max-w-md w-full bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-soft p-8 border border-gray-700">
                    <h2 className="text-3xl font-extrabold text-center text-primary-50 mb-4">
                        Organiza tu Vida
                    </h2>
                    <p className="text-center text-sm text-primary-200 mb-6">Accede para sincronizar y organizar tu día</p>
                
                <form className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Correo Electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu.correo@ejemplo.com"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button onClick={handleLogin} className="w-full bg-primary-500 text-white py-3 px-4 rounded-full hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 transition-colors">
                            Ingresar
                        </button>
                        <button onClick={handleRegister} className="w-full bg-gray-700 text-primary-50 py-3 px-4 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors border border-gray-600">
                            Registrarse
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-3 bg-gray-800 text-primary-200">O continuar con</span>
                        </div>
                    </div>
                    <div className="mt-4">
                        <button onClick={handleGoogleSignIn} className="w-full flex justify-center items-center py-3 px-4 rounded-full bg-gray-700 border border-gray-600 text-primary-50 hover:bg-gray-600 transition-colors">
                            {/*  */}
                            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 48 48">
                                <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
                            </svg>
                            <span className="text-sm font-medium">Iniciar con Google</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;