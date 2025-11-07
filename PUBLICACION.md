# 📦 Guía de Publicación - Gemini Toolbox

## 🎯 Opciones de Distribución

### Opción 1: Firefox Add-ons (AMO) - **RECOMENDADO** ⭐

#### Ventajas:
- ✅ Oficial y confiable
- ✅ Actualizaciones automáticas
- ✅ Visible en la tienda de Firefox
- ✅ Miles de usuarios potenciales
- ✅ Revisado por Mozilla (da confianza)

#### Pasos:

1. **Crear Cuenta en Mozilla**
   - Ve a: https://addons.mozilla.org/
   - Click en "Registrarse" (arriba derecha)
   - Completa el formulario

2. **Ir al Panel de Desarrollador**
   - https://addons.mozilla.org/developers/
   - Click en "Submit a New Add-on"

3. **Subir la Extensión**
   - Sube el archivo: `gemini-toolbox-v2.1.0.zip`
   - Selecciona "On this site" (AMO)
   - Click "Continue"

4. **Completar Información**
   ```
   Name: Gemini Toolbox
   Slug: gemini-toolbox
   Summary: Herramientas avanzadas para Google Gemini
   
   Description:
   Mejora tu experiencia con Google Gemini con estas potentes herramientas:
   
   🗂️ GESTIÓN DE CHATS
   • Búsqueda instantánea de conversaciones
   • Eliminación masiva con confirmación
   • Exportar chats completos (copiar/descargar)
   • Renombrado masivo con 3 modos
   • Click para abrir chats directamente
   
   💾 BIBLIOTECA DE PROMPTS
   • Guarda tus prompts favoritos
   • Organiza con categorías personalizadas
   • Búsqueda y filtrado rápido
   • Edita y reutiliza fácilmente
   • Interfaz moderna y cómoda
   
   🎨 DISEÑO PREMIUM
   • Interfaz moderna con gradientes
   • Transiciones suaves y fluidas
   • Modo claro optimizado
   • Responsive y adaptable
   
   ⚡ PRODUCTIVIDAD
   • Acceso rápido con botón flotante
   • Sin interrupciones en tu flujo
   • 100% local y privado
   • Sin permisos innecesarios
   
   Categories: Productivity, Other
   Support email: [tu-email@ejemplo.com]
   Support website: https://github.com/[tu-usuario]/gemini-toolbox
   License: MIT License
   ```

5. **Capturas de Pantalla** (Requeridas)
   - Toma 3-5 screenshots:
     - Panel principal con lista de chats
     - Tab de prompts guardados
     - Acciones avanzadas (exportar, renombrar)
     - Gestor de categorías
     - Vista completa en Gemini
   - Tamaño recomendado: 1280x800px

6. **Notas para Revisores**
   ```
   Esta extensión mejora la productividad en Google Gemini añadiendo:
   - Gestión avanzada de chats (búsqueda, exportación, renombrado)
   - Biblioteca de prompts con categorías
   - Interfaz moderna y user-friendly
   
   Permisos usados:
   - storage: Para guardar prompts y categorías localmente
   - gemini.google.com: Para inyectar el toolbox en la página
   
   Funciona 100% local, sin servidores externos.
   No recopila datos del usuario.
   
   Para probar:
   1. Abre gemini.google.com
   2. Verás un botón flotante "Gemini Toolbox"
   3. Click para abrir el panel
   4. Prueba buscar chats, guardar prompts, etc.
   ```

7. **Enviar para Revisión**
   - Click "Submit Version"
   - **Tiempo de espera**: 1-7 días para revisión

---

### Opción 2: Distribución Manual (Inmediata) 🚀

#### Para ti y amigos:

1. **Comparte el ZIP**
   - Archivo: `gemini-toolbox-v2.1.0.zip`
   - Envía por email, Drive, etc.

2. **Instalación Manual**
   ```
   1. Abrir Firefox
   2. about:debugging#/runtime/this-firefox
   3. Click "Cargar complemento temporal"
   4. Seleccionar manifest.json
   ```

**Limitación**: Se desinstala al cerrar Firefox

#### Firma Autohospedada (Permanente):

1. **Obtener API Keys de Mozilla**
   - https://addons.mozilla.org/developers/addon/api/key/
   - Genera JWT issuer y secret

2. **Instalar web-ext**
   ```bash
   npm install -g web-ext
   ```

3. **Firmar la extensión**
   ```bash
   web-ext sign \
     --api-key=tu-jwt-issuer \
     --api-secret=tu-jwt-secret \
     --channel=unlisted
   ```

4. **Resultado**
   - Genera archivo `.xpi` firmado
   - Instalación permanente
   - Sin aparecer en AMO

---

### Opción 3: GitHub Releases 📦

Para distribución open-source:

1. **Crear Repositorio**
   ```bash
   cd /home/francisco/01_PLAYGROUND/Gemini
   git init
   git add .
   git commit -m "Initial release v2.1.0"
   git remote add origin https://github.com/[usuario]/gemini-toolbox.git
   git push -u origin main
   ```

2. **Crear Release**
   - GitHub → Releases → New Release
   - Tag: `v2.1.0`
   - Title: `Gemini Toolbox v2.1.0 - UI Redesign`
   - Adjuntar: `gemini-toolbox-v2.1.0.zip`

3. **README con instrucciones**
   - Ya tienes un buen README.md
   - Añade badges, screenshots

---

## 📋 Checklist Pre-Publicación

Antes de publicar, verifica:

- [x] ✅ Versión actualizada en manifest.json (2.1.0)
- [x] ✅ CHANGELOG.md actualizado
- [x] ✅ README.md con instrucciones claras
- [ ] 📸 Capturas de pantalla de calidad
- [ ] 📧 Email de soporte definido
- [ ] 🔗 URL de soporte (GitHub/web)
- [x] ✅ Código comentado y limpio
- [x] ✅ Sin console.logs innecesarios
- [x] ✅ Pruebas en diferentes situaciones
- [ ] 📄 Política de privacidad (opcional pero recomendado)
- [x] ✅ Licencia definida (MIT en package.json)

---

## 🎨 Recursos para Screenshots

### Herramientas recomendadas:
- **Firefox Screenshot Tool**: Shift+F2 → screenshot --fullpage
- **GIMP**: Editor gratuito para retoques
- **Flameshot**: Capturas con anotaciones

### Qué capturar:
1. Vista general del toolbox abierto
2. Tab de Gestión de Chats con búsqueda
3. Tab de Prompts con categorías
4. Acciones avanzadas expandidas
5. Resultado de exportación/renombrado

---

## 📈 Post-Publicación

### Promoción:
- 🐦 Twitter/X con hashtag #GeminiAI #Firefox
- 💬 Reddit r/firefox, r/googlegemini
- 🔗 LinkedIn post
- 📝 Blog post explicando funcionalidades
- 🎥 Video demo en YouTube

### Mantenimiento:
- Monitorear reviews en AMO
- Responder preguntas de usuarios
- Fix bugs reportados
- Actualizar cuando Gemini cambie UI

---

## 🆘 Soporte

Si tienes problemas con la revisión de Mozilla:
- **Documentación**: https://extensionworkshop.com/
- **Foro**: https://discourse.mozilla.org/c/add-ons/
- **Email**: amo-admins@mozilla.org

---

## 📊 Métricas Esperadas

Después de publicar en AMO:
- **Primeros 7 días**: 10-50 instalaciones
- **Primer mes**: 100-500 usuarios
- **Con promoción**: 1000+ usuarios

---

## 🎉 ¡Felicidades!

Tu extensión está lista para el mundo. Cualquiera de las 3 opciones funciona:
- **Oficial (AMO)**: Mejor para alcance y confianza
- **Manual**: Inmediato pero limitado
- **GitHub**: Open-source y comunidad

**Recomendación**: Empieza con AMO oficial. Mientras esperas revisión, comparte manualmente con amigos.
