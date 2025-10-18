"""
<<<<<<< HEAD
Módulo de autenticación simple usado por las rutas de sincronización.
Provee verify_token(token) que intenta decodificar JWT si PyJWT está
disponible, o devuelve un payload simulado para facilitar pruebas locales.
"""
try:
    import jwt
except Exception:
    jwt = None

def verify_token(token: str):
    """Verifica y decodifica un token JWT.

    - Si PyJWT está instalado y no se provee clave, intentará decodificar sin verificación
      (solo para desarrollo). Si falla, devolverá None.
    - Si PyJWT no está disponible, devolverá un payload simulado con 'sub'=token.
    """
    if not token:
        return None

    if jwt:
        try:
            # Intentar decodificar sin verificar firma (solo entornos de desarrollo)
=======
Utilidad opcional para verificar tokens recibidos desde el frontend.
Intenta usar firebase_admin si está disponible; si no, ofrece un fallback que no verifica.
"""
import os
import logging

try:
    import firebase_admin
    from firebase_admin import auth as firebase_auth, credentials
    _FIREBASE_AVAILABLE = True
except Exception:
    _FIREBASE_AVAILABLE = False

def init_firebase_admin(cred_path=None):
    if not _FIREBASE_AVAILABLE:
        return False
    try:
        if not firebase_admin._apps:
            if cred_path:
                cred = credentials.Certificate(cred_path)
                firebase_admin.initialize_app(cred)
            else:
                firebase_admin.initialize_app()
        return True
    except Exception as e:
        logging.exception("No se pudo inicializar firebase-admin: %s", e)
        return False

def verify_token(token):
    """Devuelve el payload verificado o None si no se puede verificar.
    Si firebase-admin no está disponible, intenta decodificar sin verificar (no seguro).
    """
    if not token:
        return None
    if _FIREBASE_AVAILABLE:
        try:
            decoded = firebase_auth.verify_id_token(token)
            return decoded
        except Exception:
            return None
    else:
        # Fallback: no verification available here. Podríamos usar PyJWT para decodificar sin verificar
        try:
            import jwt
>>>>>>> 9690f33 (chore: normalize imports, unify auth token handling, fix jwt-decode import, Vite port and misc fixes)
            payload = jwt.decode(token, options={"verify_signature": False})
            return payload
        except Exception:
            return None
<<<<<<< HEAD
    else:
        # No hay PyJWT instalado: devolver payload mínimo para pruebas.
        return {"sub": token, "email": token}
=======
>>>>>>> 9690f33 (chore: normalize imports, unify auth token handling, fix jwt-decode import, Vite port and misc fixes)
