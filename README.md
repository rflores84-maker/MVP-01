# MVP-01

Primer modelo de app de finanzas personales.

## ¿cómo ejecutar?

1. Clona este repositorio donde prefieras trabajar:
   ```bash
   cd /workspace
   git clone https://github.com/TuUsuario/MVP-01.git
   ```
   > Si la carpeta `MVP-01` ya existe, elimina su contenido (`rm -rf MVP-01`) o clónala con otro nombre (`git clone … MVP-01-nuevo`).
2. Entra a la carpeta del proyecto `cd MVP-01`.
3. Abre el archivo `index.html` en tu navegador (puedes hacer doble clic desde el explorador de archivos o elegir *Open with Live Server* si usas VS Code).
   - Si prefieres usar la terminal, ejecuta `python3 -m http.server 8000 --bind 0.0.0.0` (o `python -m http.server 8000` / `py -m http.server 8000` según tu plataforma) dentro de la carpeta del proyecto y navega a `http://localhost:8000/index.html`.
4. Verás la pantalla de inicio de sesión. Si lo prefieres, presiona **Usar demo** para rellenar automáticamente las credenciales `admin` / `1234` y acceder al panel.
5. Carga movimientos, ajusta categorías desde la pestaña de configuración y consulta la visualización mensual.
