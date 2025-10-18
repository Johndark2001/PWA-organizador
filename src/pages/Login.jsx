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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6 text-center">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">Inicia sesión para continuar</h1>
        <p className="text-sm text-gray-600 mb-4">Usa tu cuenta Google para probar el prototipo.</p>
        <div className="flex justify-center">
          <GoogleLogin onSuccess={handleLoginSuccess} onError={() => alert("Error al iniciar sesión")} />
        </div>
      </div>
    </div>
  );
}
