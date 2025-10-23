// src/pages/Login.jsx
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { jwtDecode } from "jwt-decode";
import { useSession } from "../contexts/SessionContext";
import "./Login.css";

export default function LoginPage() {
  const { signIn } = useSession();

  return (
    <div className="login-container">
      {/* Burbujas animadas del fondo */}
      <div className="bubbles">
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
      </div>

      {/* Tarjeta de inicio de sesión */}
      <div className="login-card">
        <div className="login-avatar">
          <svg
            className="w-10 h-10 text-blue-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4zm0-2a4 4 0 110-8 4 4 0 010 8z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-2">Bienvenido</h1>
        <p className="text-sm text-gray-600 mb-6">
          Inicia sesión con tu cuenta de Google para continuar
        </p>

        <button
          onClick={async () => {
            try {
              const provider = new GoogleAuthProvider();
              const result = await signInWithPopup(auth, provider);
              const idToken = await result.user.getIdToken();

              // Decodifica el token (opcional)
              let decoded = null;
              try {
                decoded = jwtDecode(idToken);
              } catch (e) {
                console.warn("No se pudo decodificar el token JWT:", e);
              }

              // Guarda la sesión
              signIn({
                user: decoded || {
                  email: result.user.email,
                  uid: result.user.uid,
                },
                credential: idToken,
              });
            } catch (e) {
              console.error("Error Google SignIn:", e);
              alert("Error al iniciar sesión con Google");
            }
          }}
          className="google-btn"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 48 48"
          >
            <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
          </svg>
          <span>Iniciar con Google</span>
        </button>
      </div>
    </div>
  );
}
