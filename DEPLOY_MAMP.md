# Despliegue en MAMP - Healthy Recipe Finder

## Prerequisitos
- MAMP instalado y funcionando
- Node.js y npm instalados

## Pasos para el Despliegue

### 1. Preparar el Build de Producción
```bash
# Instalar dependencias
npm install

# Crear build de producción (IMPORTANTE: usar build, no build:dev)
npm run build
```

**IMPORTANTE**: NO uses `npm run build:dev` para MAMP. Siempre usa `npm run build` para generar archivos optimizados.

### 2. Configurar MAMP

1. **Iniciar MAMP**
   - Abrir la aplicación MAMP
   - Iniciar los servidores Apache y MySQL

2. **Configurar la Carpeta de Proyecto**
   - Copiar el contenido de la carpeta `dist/` generada
   - Pegar en: `/Applications/MAMP/htdocs/healthy-recipe-finder/`
   - Asegurar que el archivo `.htaccess` esté incluido

### 3. Configurar la API de Gemini

1. **Obtener API Key de Google Gemini**
   - Visitar: https://makersuite.google.com/app/apikey
   - Crear una nueva API key

2. **Configurar la API Key**
   - Abrir el archivo `dist/assets/index-[hash].js`
   - Buscar `YOUR_GEMINI_API_KEY`
   - Reemplazar con tu API key real

   **IMPORTANTE**: Para mayor seguridad, considera usar variables de entorno o un backend proxy.

### 4. Acceder a la Aplicación

1. **URL Local**
   ```
   http://localhost:8888/healthy-recipe-finder/
   ```

2. **URL Personalizada** (si configuraste un virtual host)
   ```
   http://healthy-recipe-finder.local/
   ```

## Configuración Avanzada

### Virtual Host (Opcional)
Para usar un dominio personalizado, añadir en `/Applications/MAMP/conf/apache/httpd.conf`:

```apache
<VirtualHost *:80>
    DocumentRoot "/Applications/MAMP/htdocs/healthy-recipe-finder"
    ServerName healthy-recipe-finder.local
</VirtualHost>
```

Y en `/etc/hosts`:
```
127.0.0.1 healthy-recipe-finder.local
```

### Cambiar la Carpeta Base
Si quieres usar una carpeta diferente:

1. Editar `vite.config.ts` - cambiar el `base` path
2. Editar `public/.htaccess` - cambiar el `RewriteBase`
3. Rebuild con `npm run build`

## Solución de Problemas

### Error: GET /src/main.tsx 404 (Not Found)
**Causa**: Estás accediendo a los archivos fuente en lugar de los archivos compilados.

**Solución**:
1. Ejecutar `npm run build` (NO `npm run build:dev`)
2. Copiar SOLO el contenido de la carpeta `dist/` a MAMP
3. NO copiar archivos fuente (`src/`, `node_modules/`, etc.)

### Error 404 en Rutas
- Verificar que el archivo `.htaccess` esté en la carpeta raíz
- Asegurar que mod_rewrite esté habilitado en Apache

### Recursos No Cargan
- Verificar que la ruta base en `vite.config.ts` coincida con la carpeta en MAMP  
- Revisar permisos de archivos (755 para carpetas, 644 para archivos)
- Asegurar que copiaste SOLO el contenido de `dist/`, no el proyecto completo

### API de Gemini No Funciona
- Verificar que la API key esté configurada correctamente
- Revisar la consola del navegador para errores de CORS o API

## Estructura Final en MAMP
```
/Applications/MAMP/htdocs/healthy-recipe-finder/
├── index.html
├── .htaccess
├── assets/
│   ├── index-[hash].css
│   ├── index-[hash].js
│   └── [otros archivos]
└── robots.txt
```

## Notas de Seguridad
- No exponer API keys en el código cliente
- Considerar implementar un backend para manejar las llamadas a Gemini
- Usar HTTPS en producción