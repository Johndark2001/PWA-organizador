// src/pages/Login.jsx
import { useSession } from "../contexts/SessionContext";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const { signIn } = useSession();

  const handleLoginSuccess = (credentialResponse) => {
    if (!credentialResponse?.credential) return;
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      // Guardamos la credential (JWT) en la sesión para usarla como token
      signIn({ user: decoded, credential: credentialResponse.credential });
    } catch (e) {
      console.error("Error decodificando token de Google:", e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="w-full max-w-sm bg-gray-800/70 border border-gray-700 rounded-xl p-6 shadow-soft">
        <h1 className="text-center text-2xl font-bold text-primary-50 mb-2">Ingresar</h1>
        <p className="text-center text-sm text-primary-200 mb-6">Accede con Google para sincronizar tus tareas</p>
        <div className="flex justify-center">
          <button
            onClick={async () => {
              try {
                const provider = new GoogleAuthProvider();
                const result = await signInWithPopup(auth, provider);
                const idToken = await result.user.getIdToken();
                // opcional: decodificar user info desde token
                let decoded = null;
                try { decoded = jwtDecode(idToken); } catch (e) {}
                // Guardamos la session usando el contexto
                signIn({ user: decoded || { email: result.user.email, uid: result.user.uid }, credential: idToken });
              } catch (e) {
                console.error('Error Google SignIn:', e);
                alert('Error al iniciar sesión con Google');
              }
            }}
            className="w-full flex justify-center items-center py-3 px-4 rounded-full bg-gray-700 border border-gray-600 text-primary-50 hover:bg-gray-600 transition-colors"
          >
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 48 48">
              <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
            </svg>
            <span className="text-sm font-medium">Iniciar con Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}
