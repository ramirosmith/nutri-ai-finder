# Deploy en GitHub Pages

Esta guía te ayudará a desplegar tu aplicación Healthy Recipe Finder en GitHub Pages.

## Configuración Automática

### 1. Subir Código a GitHub

```bash
# Inicializar repositorio (si no existe)
git init
git add .
git commit -m "Initial commit"

# Conectar con GitHub (cambiar por tu repositorio)
git remote add origin https://github.com/TU-USUARIO/healthy-recipe-finder.git
git branch -M main
git push -u origin main
```

### 2. Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Ir a **Settings** > **Pages**
3. En **Source** seleccionar **GitHub Actions**
4. El deploy será automático con cada push a main

### 3. Configurar Nombre del Repositorio

Si tu repositorio se llama diferente a `healthy-recipe-finder`, actualizar en `vite.config.ts`:

```typescript
// Cambiar 'healthy-recipe-finder' por el nombre de tu repositorio
base: mode === 'production' ? '/TU-REPOSITORIO/' : '/',
```

## URLs de Acceso

- **Repositorio**: `https://github.com/TU-USUARIO/TU-REPOSITORIO`
- **GitHub Pages**: `https://TU-USUARIO.github.io/TU-REPOSITORIO/`

## Proceso de Deploy

1. **Push a main** → Trigger automático del workflow
2. **Build** → Compilación automática con Vite
3. **Deploy** → Publicación automática en GitHub Pages
4. **Live** → Disponible en la URL en ~2-5 minutos

## Archivos Importantes

- `.github/workflows/deploy.yml` - Workflow de deploy automático
- `vite.config.ts` - Configuración de rutas base
- `public/.htaccess` - Configuración para client-side routing (no necesario en GitHub Pages)

## Comandos Útiles

```bash
# Build local para testing
npm run build
npm run preview

# Ver el sitio localmente como en GitHub Pages
npm run build && npm run preview
```

## Solución de Problemas

### Deploy Falla
- Verificar que el workflow tiene permisos en **Settings** > **Actions** > **General**
- Asegurar que **Workflow permissions** esté en "Read and write permissions"

### Rutas 404
- GitHub Pages maneja automáticamente el client-side routing para SPAs
- Verificar que la ruta base en `vite.config.ts` coincida con el nombre del repositorio

### Recursos No Cargan
- Verificar que la ruta base esté correcta
- GitHub Pages puede tardar hasta 10 minutos en propagar cambios

### API de Gemini
- La API key debe estar configurada como secret del repositorio si planeas usarla en producción
- Para desarrollo local, usar variables de entorno locales