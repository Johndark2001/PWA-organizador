import { execSync } from 'child_process';

try {
    // Obtener los archivos que se van a commitear
    const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf-8' })
        .split('\n')
        .filter(Boolean);

    // Patrones de secretos comunes
    const patterns = [
        /(password|pwd|pass|secret|token|key|api[_-]?key).*?[=:]\s*['"]?\w+['"]?/i,
        /-----BEGIN (RSA|DSA|EC|PGP|OPENSSH) PRIVATE KEY-----/,
        /[a-f0-9]{32,}/i, // Posibles hashes o tokens
        /(firebase|aws|azure|google).*?[=:]\s*['"]?\w+['"]?/i,
        /[a-z0-9_-]{21}\.iam\.gserviceaccount\.com/i, // Google Service Account
    ];

    let foundSecrets = false;

    for (const file of stagedFiles) {
        try {
            const content = execSync(`git show :${file}`, { encoding: 'utf-8' });
            
            for (const pattern of patterns) {
                const match = content.match(pattern);
                if (match) {
                    console.error(`\x1b[31mPosible secreto encontrado en ${file}:\x1b[0m`);
                    console.error(`- Coincidencia con patrón: ${pattern}`);
                    console.error(`- Línea: ${match[0]}`);
                    foundSecrets = true;
                }
            }
        } catch (err) {
            console.warn(`No se pudo leer el archivo ${file}:`, err.message);
        }
    }

    if (foundSecrets) {
        console.error('\x1b[31m¡Se encontraron posibles secretos! Commit abortado.\x1b[0m');
        console.error('Por favor, revisa los archivos y asegúrate de no subir información sensible.');
        console.error('Si estás seguro de que no son secretos, usa --no-verify para forzar el commit.');
        process.exit(1);
    }
} catch (err) {
    console.error('Error al ejecutar el check de secretos:', err.message);
    process.exit(1);
}