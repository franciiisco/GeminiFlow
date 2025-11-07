# Gemini Toolbox - Extensión de Firefox

Extensión de Firefox que añade funcionalidades adicionales a Google Gemini.

# Gemini Toolbox - Extensión de Firefox

Extensión de Firefox que añade funcionalidades avanzadas a Google Gemini.

## 🌟 Características v2.0

### 📁 Gestión Avanzada de Chats
- **🔍 Búsqueda en tiempo real**: Filtra chats por palabra clave
- **📥 Exportar conversaciones**: Copia o descarga el contenido completo de tus chats
- **✏️ Renombrado masivo**: Añade prefijos, sufijos o reemplaza texto en múltiples chats
- **🗑️ Eliminación masiva**: Selecciona y elimina múltiples conversaciones a la vez

### ✨ Prompts Avanzados
- **📂 Categorías personalizadas**: Organiza tus prompts por temas
- **🔍 Filtrado inteligente**: Busca por categoría, nombre o contenido
- **✏️ Edición completa**: Modifica nombre, texto y categoría de prompts existentes
- **💾 Guardado rápido**: Guarda y organiza tus prompts más usados
- **📋 Copiar/Insertar**: Usa tus prompts con un click

### 🎨 Interfaz Integrada
- **Botón flotante**: Acceso rápido desde cualquier página de Gemini
- **Panel organizado**: Pestañas para chats y prompts
- **Diseño limpio**: Se integra perfectamente con la interfaz de Gemini
- **Acciones avanzadas**: Menú desplegable para funciones adicionales

## Instalación

### Desarrollo (Temporal)
1. Abre Firefox y navega a `about:debugging`
2. Haz clic en "Este Firefox" (This Firefox)
3. Haz clic en "Cargar complemento temporal" (Load Temporary Add-on)
4. Selecciona el archivo `manifest.json` de esta carpeta

### Producción
1. Descarga la extensión desde Firefox Add-ons
2. Instala con un solo clic

## Uso

1. Navega a [Google Gemini](https://gemini.google.com)
2. Verás un nuevo botón "Toolbox" en la interfaz
3. Haz clic para acceder a las herramientas disponibles

### Eliminación masiva de chats
- Abre el Toolbox
- Ve a la sección "Gestión de Chats"
- Selecciona los chats que deseas eliminar
- Confirma la eliminación

### Prompts guardados
- Abre el Toolbox
- Ve a la sección "Prompts"
- Añade, edita o elimina tus prompts favoritos
- Haz clic en un prompt para copiarlo o insertarlo directamente

## Desarrollo

Estructura del proyecto:
```
├── manifest.json          # Configuración de la extensión
├── content/
│   ├── content.js        # Script inyectado en Gemini
│   └── styles.css        # Estilos para el toolbox
├── popup/
│   ├── popup.html        # Popup de la extensión
│   ├── popup.js          # Lógica del popup
│   ├── toolbox.html      # Panel del toolbox
│   ├── toolbox.js        # Lógica del toolbox
│   └── toolbox.css       # Estilos del toolbox
└── icons/
    ├── icon-48.png       # Icono 48x48
    └── icon-96.png       # Icono 96x96
```

## Licencia

MIT
