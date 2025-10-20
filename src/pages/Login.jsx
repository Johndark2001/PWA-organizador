// src/pages/Login.jsx
import { GoogleLogin } from "@react-oauth/google";
import { useSession } from "../contexts/SessionContext";
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
          <GoogleLogin onSuccess={handleLoginSuccess} onError={() => alert("Error al iniciar sesión")} />
        </div>
      </div>
    </div>
  );
}
