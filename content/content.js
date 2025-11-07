// Content script - Se inyecta en la página de Gemini
console.log('Gemini Toolbox: Content script cargado');

// Esperar a que el DOM esté completamente cargado
function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error('Timeout esperando el elemento: ' + selector));
    }, timeout);
  });
}

// Crear el botón del toolbox
function createToolboxButton() {
  const button = document.createElement('button');
  button.id = 'gemini-toolbox-button';
  button.className = 'gemini-toolbox-btn';
  button.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
    </svg>
    <span>GeminiFlow</span>
  `;
  button.title = 'Abrir Gemini Toolbox';
  
  button.addEventListener('click', toggleToolbox);
  
  return button;
}

// Crear el panel del toolbox
function createToolboxPanel() {
  const panel = document.createElement('div');
  panel.id = 'gemini-toolbox-panel';
  panel.className = 'gemini-toolbox-panel hidden';
  
  panel.innerHTML = `
    <div class="toolbox-header">
      <h2>GeminiFlow</h2>
      <button class="close-btn" id="close-toolbox">×</button>
    </div>
    
    <div class="toolbox-tabs">
      <button class="tab-btn active" data-tab="chats">Gestión de Chats</button>
      <button class="tab-btn" data-tab="prompts">Mis Prompts</button>
    </div>
    
    <div class="toolbox-content">
      <!-- Tab: Gestión de Chats -->
      <div class="tab-content active" id="tab-chats">
        <h3>Gestión de Chats</h3>
        
        <!-- Búsqueda de chats -->
        <div class="search-box">
          <input type="text" id="search-chats" placeholder="🔍 Buscar chats..." class="search-input">
          <span id="search-results-count" class="search-count"></span>
        </div>
        
        <!-- Acciones principales -->
        <div class="action-buttons">
          <button id="select-all-chats" class="btn btn-secondary">Seleccionar Todos</button>
          <button id="deselect-all-chats" class="btn btn-secondary">Deseleccionar Todos</button>
        </div>
        
        <!-- Acciones avanzadas -->
        <details class="advanced-actions">
          <summary>Acciones Avanzadas</summary>
          <div class="advanced-actions-content">
            <button id="export-chats" class="btn btn-primary">📥 Exportar Seleccionados</button>
            <button id="rename-chats" class="btn btn-primary">✏️ Renombrar Masivo</button>
            <button id="delete-selected-chats" class="btn btn-danger">🗑️ Eliminar Seleccionados</button>
          </div>
        </details>
        
        <div id="chat-list" class="chat-list">
          <p class="loading">Cargando chats...</p>
        </div>
        
        <div class="chat-stats">
          <span id="selected-count">0</span> seleccionados | <span id="visible-count">0</span> visibles
        </div>
      </div>
      
      <!-- Tab: Prompts -->
      <div class="tab-content" id="tab-prompts">
        <h3>Mis Prompts Guardados</h3>
        
        <!-- Añadir nuevo prompt -->
        <div class="prompt-add">
          <textarea id="new-prompt-text" placeholder="Escribe tu prompt aquí..." rows="3"></textarea>
          <input type="text" id="new-prompt-name" placeholder="Nombre del prompt">
          <select id="new-prompt-category" class="category-select">
            <option value="">Sin categoría</option>
          </select>
          <button id="save-prompt" class="btn btn-primary">💾 Guardar Prompt</button>
        </div>
        
        <!-- Gestión de categorías -->
        <details class="category-manager">
          <summary>Gestionar Categorías</summary>
          <div class="category-manager-content">
            <div class="category-input-group">
              <input type="text" id="new-category-name" placeholder="Nueva categoría">
              <button id="add-category" class="btn btn-secondary">➕ Añadir</button>
            </div>
            <div id="categories-list" class="categories-list"></div>
          </div>
        </details>
        
        <!-- Filtro por categoría -->
        <div class="prompt-filters">
          <select id="filter-category" class="category-select">
            <option value="">📁 Todas las categorías</option>
          </select>
          <input type="text" id="search-prompts" placeholder="🔍 Buscar prompts..." class="search-input">
        </div>
        
        <div id="prompt-list" class="prompt-list">
          <p class="empty-state">No hay prompts guardados aún</p>
        </div>
      </div>
    </div>
  `;
  
  // Event listeners
  panel.querySelector('#close-toolbox').addEventListener('click', toggleToolbox);
  
  // Tab switching
  panel.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tabName = e.target.dataset.tab;
      switchTab(tabName);
    });
  });
  
  // Chat management
  panel.querySelector('#select-all-chats').addEventListener('click', selectAllChats);
  panel.querySelector('#deselect-all-chats').addEventListener('click', deselectAllChats);
  panel.querySelector('#delete-selected-chats').addEventListener('click', deleteSelectedChats);
  panel.querySelector('#export-chats').addEventListener('click', exportSelectedChats);
  panel.querySelector('#rename-chats').addEventListener('click', renameSelectedChats);
  
  // Chat search
  panel.querySelector('#search-chats').addEventListener('input', filterChats);
  
  // Prompt management
  panel.querySelector('#save-prompt').addEventListener('click', savePrompt);
  panel.querySelector('#add-category').addEventListener('click', addCategory);
  panel.querySelector('#filter-category').addEventListener('change', filterPrompts);
  panel.querySelector('#search-prompts').addEventListener('input', filterPrompts);
  
  return panel;
}

// Toggle toolbox visibility
function toggleToolbox() {
  const panel = document.getElementById('gemini-toolbox-panel');
  if (panel) {
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) {
      loadChats();
      loadPrompts();
    }
  }
}

// Switch between tabs
function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  document.getElementById(`tab-${tabName}`).classList.add('active');
}

// Store found chats globally
let foundChats = [];

// Load chats from Gemini
function loadChats() {
  const chatList = document.getElementById('chat-list');
  chatList.innerHTML = '<p class="loading">Buscando chats...</p>';
  
  // Buscar elementos de chat en la interfaz de Gemini
  setTimeout(() => {
    foundChats = [];
    
    // Buscar usando los botones de menú de conversación (estructura exacta de Gemini)
    const conversationMenuButtons = document.querySelectorAll('.conversation-actions-menu-button');
    
    console.log(`Botones de menú de conversación encontrados: ${conversationMenuButtons.length}`);
    
    conversationMenuButtons.forEach((menuButton) => {
      // El botón está dentro de: conversation-actions-container -> conversation-items-container
      // Necesitamos buscar el título en el nivel del conversation-items-container
      const actionsContainer = menuButton.closest('.conversation-actions-container');
      if (!actionsContainer) return;
      
      const itemsContainer = actionsContainer.closest('.conversation-items-container');
      if (!itemsContainer) return;
      
      // Buscar el título dentro del items-container
      const titleElement = itemsContainer.querySelector('.conversation-title');
      
      if (titleElement) {
        const titleText = titleElement.textContent.trim();
        
        // Filtrar textos inválidos
        if (titleText && 
            titleText.length > 2 && 
            !titleText.includes('Toolbox') &&
            !titleText.toLowerCase().includes('nueva conversación') &&
            !titleText.toLowerCase().includes('new chat')) {
          
          // Buscar el div.conversation que es clickeable
          const conversationDiv = itemsContainer.querySelector('[data-test-id="conversation"]');
          
          foundChats.push({
            id: foundChats.length,
            element: conversationDiv || itemsContainer,
            menuButton: menuButton,
            itemsContainer: itemsContainer,
            titleElement: titleElement,
            title: titleText.substring(0, 60) + (titleText.length > 60 ? '...' : ''),
            deleteButton: menuButton
          });
        }
      }
    });
    
    console.log(`Chats procesados: ${foundChats.length}`);
    
    if (foundChats.length === 0) {
      chatList.innerHTML = `
        <p class="empty-state">
          No se encontraron chats. 
          <br><br>
          <strong>Sugerencias:</strong><br>
          • <strong>Abre el menú lateral</strong> de Gemini (click en ☰)<br>
          • Asegúrate de tener chats guardados<br>
          • Desplázate por el historial para cargar más<br>
          • Recarga la página e intenta de nuevo<br>
          <br>
          <small style="color: #999;">Se buscaron ${conversationMenuButtons.length} botones de menú</small>
        </p>
      `;
      return;
    }
    
    chatList.innerHTML = foundChats.map(chat => `
      <div class="chat-item" data-chat-index="${chat.id}">
        <input type="checkbox" class="chat-checkbox" data-chat-id="${chat.id}">
        <span class="chat-title" title="${chat.title}">${chat.title}</span>
        <span class="chat-status" title="${chat.deleteButton ? 'Listo para eliminar' : 'Sin botón de menú'}">${chat.deleteButton ? '✓' : '⚠️'}</span>
      </div>
    `).join('');
    
    // Update counter on checkbox change
    chatList.querySelectorAll('.chat-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', updateSelectedCount);
    });
    
    // Hacer que los chat items sean clickeables para abrir el chat
    chatList.querySelectorAll('.chat-item').forEach((item) => {
      const chatIndex = parseInt(item.dataset.chatIndex);
      const chat = foundChats[chatIndex];
      
      item.addEventListener('click', (e) => {
        // No hacer nada si se clickeó el checkbox
        if (e.target.classList.contains('chat-checkbox')) {
          return;
        }
        
        // Abrir el chat clickeando en su elemento
        if (chat && chat.element) {
          console.log(`Abriendo chat: ${chat.title}`);
          chat.element.click();
        }
      });
      
      // Cambiar el cursor cuando se pasa el mouse por el título
      const titleElement = item.querySelector('.chat-title');
      if (titleElement) {
        titleElement.style.cursor = 'pointer';
      }
    });
    
    updateSelectedCount();
  }, 1500);
}

// Select all chats
function selectAllChats() {
  document.querySelectorAll('.chat-checkbox').forEach(checkbox => {
    checkbox.checked = true;
  });
  updateSelectedCount();
}

// Deselect all chats
function deselectAllChats() {
  document.querySelectorAll('.chat-checkbox').forEach(checkbox => {
    checkbox.checked = false;
  });
  updateSelectedCount();
}

// Update selected count
function updateSelectedCount() {
  const count = document.querySelectorAll('.chat-checkbox:checked').length;
  const visible = document.querySelectorAll('.chat-item:not(.hidden)').length;
  document.getElementById('selected-count').textContent = count;
  document.getElementById('visible-count').textContent = visible;
}

// Filter chats by search term
function filterChats() {
  const searchTerm = document.getElementById('search-chats').value.toLowerCase().trim();
  const chatItems = document.querySelectorAll('.chat-item');
  let visibleCount = 0;
  
  chatItems.forEach(item => {
    const title = item.querySelector('.chat-title').textContent.toLowerCase();
    
    if (title.includes(searchTerm)) {
      item.classList.remove('hidden');
      visibleCount++;
    } else {
      item.classList.add('hidden');
    }
  });
  
  // Update search results count
  const searchCount = document.getElementById('search-results-count');
  if (searchTerm) {
    searchCount.textContent = `${visibleCount} resultado(s)`;
  } else {
    searchCount.textContent = '';
  }
  
  updateSelectedCount();
}

// Export selected chats
async function exportSelectedChats() {
  const selectedCheckboxes = document.querySelectorAll('.chat-checkbox:checked');
  
  if (selectedCheckboxes.length === 0) {
    alert('No hay chats seleccionados para exportar');
    return;
  }
  
  const format = confirm(
    `Exportar ${selectedCheckboxes.length} chat(s)\n\n` +
    `OK = Copiar al portapapeles\n` +
    `Cancelar = Descargar como archivo`
  );
  
  let exportText = `EXPORTACIÓN DE CHATS DE GEMINI\n`;
  exportText += `Fecha: ${new Date().toLocaleString()}\n`;
  exportText += `Total de chats: ${selectedCheckboxes.length}\n`;
  exportText += `${'='.repeat(60)}\n\n`;
  
  for (const checkbox of selectedCheckboxes) {
    const chatId = parseInt(checkbox.dataset.chatId);
    const chat = foundChats[chatId];
    
    if (!chat) continue;
    
    exportText += `CHAT: ${chat.title}\n`;
    exportText += `${'-'.repeat(60)}\n`;
    
    try {
      // Intentar extraer el contenido del chat
      // Click en el chat para abrirlo
      if (chat.element) {
        chat.element.click();
        await sleep(1000);
        
        // Buscar el contenedor de mensajes
        const messageContainers = document.querySelectorAll('message-content, .message-content, [class*="message"]');
        
        if (messageContainers.length > 0) {
          messageContainers.forEach((msg, idx) => {
            const text = msg.textContent.trim();
            if (text && text.length > 10) {
              exportText += `\n${text}\n`;
            }
          });
        } else {
          exportText += `[No se pudo extraer el contenido completo]\n`;
        }
      }
    } catch (error) {
      console.error('Error extrayendo chat:', error);
      exportText += `[Error al extraer contenido: ${error.message}]\n`;
    }
    
    exportText += `\n${'='.repeat(60)}\n\n`;
  }
  
  if (format) {
    // Copiar al portapapeles
    try {
      await navigator.clipboard.writeText(exportText);
      alert(`✓ ${selectedCheckboxes.length} chat(s) copiados al portapapeles`);
    } catch (error) {
      alert('Error al copiar. Usa la opción de descargar.');
    }
  } else {
    // Descargar como archivo
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gemini-chats-export-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`✓ ${selectedCheckboxes.length} chat(s) descargados`);
  }
}

// Rename selected chats
async function renameSelectedChats() {
  const selectedCheckboxes = document.querySelectorAll('.chat-checkbox:checked');
  
  if (selectedCheckboxes.length === 0) {
    alert('No hay chats seleccionados para renombrar');
    return;
  }
  
  // Mostrar diálogo para elegir el modo
  const mode = prompt(
    `RENOMBRADO MASIVO DE ${selectedCheckboxes.length} CHAT(S)\n\n` +
    `Elige una opción:\n` +
    `1 = Añadir prefijo (ej: "[Proyecto] Título")\n` +
    `2 = Añadir sufijo (ej: "Título [2024]")\n` +
    `3 = Reemplazar texto\n\n` +
    `Escribe el número:`
  );
  
  if (!mode || !['1', '2', '3'].includes(mode)) {
    return;
  }
  
  let text;
  if (mode === '1') {
    text = prompt('Escribe el prefijo a añadir:', '[Proyecto] ');
  } else if (mode === '2') {
    text = prompt('Escribe el sufijo a añadir:', ' [2024]');
  } else {
    const searchText = prompt('Texto a buscar:');
    if (!searchText) return;
    const replaceText = prompt('Reemplazar con:', '');
    text = { search: searchText, replace: replaceText };
  }
  
  if (!text && mode !== '3') return;
  
  const chatList = document.getElementById('chat-list');
  chatList.innerHTML = `
    <div class="loading">
      <p>Renombrando chats...</p>
      <p class="progress-text">0 de ${selectedCheckboxes.length}</p>
    </div>
  `;
  
  let successCount = 0;
  let failedCount = 0;
  
  for (const checkbox of selectedCheckboxes) {
    const chatId = parseInt(checkbox.dataset.chatId);
    const chat = foundChats[chatId];
    
    if (!chat) {
      failedCount++;
      continue;
    }
    
    try {
      // Scroll al chat
      chat.itemsContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await sleep(300);
      
      // Abrir menú
      chat.menuButton.click();
      await sleep(600);
      
      // Buscar opción "Cambiar nombre" o "Rename"
      const renameButton = document.querySelector('button[data-test-id="rename-button"]');
      
      if (!renameButton) {
        // Método alternativo
        const menuItems = document.querySelectorAll('button[mat-menu-item]');
        let found = false;
        
        for (const item of menuItems) {
          const text = item.textContent.trim().toLowerCase();
          if (text.includes('cambiar nombre') || text.includes('rename') || text.includes('edit')) {
            item.click();
            found = true;
            await sleep(500);
            break;
          }
        }
        
        if (!found) {
          failedCount++;
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, bubbles: true }));
          await sleep(300);
          continue;
        }
      } else {
        renameButton.click();
        await sleep(500);
      }
      
      // Buscar el input de renombrado
      await sleep(400);
      const inputFields = document.querySelectorAll('input[type="text"], textarea');
      
      let renamed = false;
      for (const input of inputFields) {
        if (input.value && input.value.length > 5) {
          const currentTitle = input.value;
          let newTitle;
          
          if (mode === '1') {
            newTitle = text + currentTitle;
          } else if (mode === '2') {
            newTitle = currentTitle + text;
          } else {
            newTitle = currentTitle.replace(new RegExp(text.search, 'g'), text.replace);
          }
          
          input.value = newTitle;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          
          // Buscar y hacer click en botón de confirmar/guardar
          await sleep(300);
          const saveButtons = document.querySelectorAll('button');
          
          for (const btn of saveButtons) {
            const btnText = btn.textContent.toLowerCase().trim();
            if (btnText === 'guardar' || btnText === 'save' || btnText === 'ok' || btnText === 'aceptar') {
              btn.click();
              renamed = true;
              await sleep(500);
              break;
            }
          }
          
          if (renamed) break;
        }
      }
      
      if (renamed) {
        successCount++;
      } else {
        failedCount++;
      }
      
      // Actualizar progreso
      const progressText = document.querySelector('.progress-text');
      if (progressText) {
        progressText.textContent = `${successCount + failedCount} de ${selectedCheckboxes.length}`;
      }
      
    } catch (error) {
      console.error('Error renombrando chat:', error);
      failedCount++;
    }
    
    await sleep(800);
  }
  
  alert(
    `Renombrado completado\n\n` +
    `✓ Exitosos: ${successCount}\n` +
    `✗ Fallidos: ${failedCount}\n\n` +
    `Recarga la página para ver los cambios.`
  );
  
  setTimeout(() => loadChats(), 1000);
}

// Delete selected chats
async function deleteSelectedChats() {
  const selectedCheckboxes = document.querySelectorAll('.chat-checkbox:checked');
  
  if (selectedCheckboxes.length === 0) {
    alert('No hay chats seleccionados');
    return;
  }
  
  const confirmDelete = confirm(
    `¿Estás seguro de que quieres eliminar ${selectedCheckboxes.length} chat(s)?\n\n` +
    `Esta acción NO se puede deshacer.\n\n` +
    `RECOMENDACIÓN: Si es la primera vez, prueba con solo 1 chat.`
  );
  
  if (!confirmDelete) return;
  
  // Mostrar progreso
  const chatList = document.getElementById('chat-list');
  chatList.innerHTML = `
    <div class="loading">
      <p>Eliminando chats...</p>
      <p class="progress-text">0 de ${selectedCheckboxes.length}</p>
      <p style="font-size: 12px; color: #666; margin-top: 10px;">Esto puede tardar 3-5 segundos por chat...</p>
    </div>
  `;
  
  let deletedCount = 0;
  let failedCount = 0;
  const errors = [];
  
  for (const checkbox of selectedCheckboxes) {
    const chatId = parseInt(checkbox.dataset.chatId);
    const chat = foundChats[chatId];
    
    if (!chat) {
      failedCount++;
      errors.push(`Chat ${chatId}: No encontrado en la lista`);
      continue;
    }
    
    try {
      console.log(`\n=== Procesando: "${chat.title}" ===`);
      
      if (!chat.menuButton) {
        failedCount++;
        errors.push(`"${chat.title}": Sin botón de menú`);
        console.error('Sin botón de menú');
        continue;
      }
      
      // Paso 1: Hacer scroll al elemento
      chat.itemsContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await sleep(400);
      
      // Paso 2: Hacer hover sobre el contenedor
      chat.itemsContainer.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, cancelable: true }));
      await sleep(300);
      
      // Paso 3: Click en el botón de menú (tres puntos)
      console.log('Click en botón de menú...');
      chat.menuButton.click();
      await sleep(800); // Esperar a que se abra el menú
      
      // Paso 4: Buscar el botón de "Eliminar" en el menú desplegable
      console.log('Buscando botón "Eliminar"...');
      
      // El botón tiene data-test-id="delete-button" y texto "Eliminar"
      const deleteButton = document.querySelector('button[data-test-id="delete-button"]');
      
      if (!deleteButton) {
        // Método alternativo: buscar por texto
        const menuItems = document.querySelectorAll('button[mat-menu-item]');
        let found = false;
        
        for (const item of menuItems) {
          const text = item.textContent.trim().toLowerCase();
          if (text === 'eliminar' || text === 'delete') {
            console.log('Botón "Eliminar" encontrado (método alternativo)');
            item.click();
            found = true;
            await sleep(600);
            break;
          }
        }
        
        if (!found) {
          failedCount++;
          errors.push(`"${chat.title}": No se encontró botón "Eliminar" en el menú`);
          console.error('Botón "Eliminar" no encontrado');
          
          // Cerrar el menú presionando ESC
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, bubbles: true }));
          await sleep(300);
          continue;
        }
      } else {
        console.log('✓ Botón "Eliminar" encontrado');
        deleteButton.click();
        await sleep(600);
      }
      
      // Paso 5: Buscar y confirmar en el diálogo
      console.log('Buscando diálogo de confirmación...');
      
      // Gemini suele mostrar un diálogo con botones de confirmación
      // Buscar botones que digan "Eliminar", "Delete", "Confirmar", "OK"
      await sleep(400);
      
      const dialogButtons = document.querySelectorAll('button, [role="button"]');
      let confirmed = false;
      
      for (const btn of dialogButtons) {
        const btnText = btn.textContent.trim().toLowerCase();
        const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
        
        // Buscar botón de confirmación (evitar "Cancelar")
        if ((btnText === 'eliminar' || btnText === 'delete' || 
             btnText === 'confirmar' || btnText === 'confirm' ||
             btnText === 'ok' || btnText === 'aceptar') &&
            !btnText.includes('cancelar') && !btnText.includes('cancel')) {
          
          console.log('✓ Confirmando eliminación:', btnText);
          btn.click();
          confirmed = true;
          await sleep(800);
          break;
        }
      }
      
      if (confirmed) {
        deletedCount++;
        console.log(`✓✓✓ Chat "${chat.title}" eliminado exitosamente`);
      } else {
        // Si no hay diálogo de confirmación, asumir que se eliminó directamente
        deletedCount++;
        console.log(`✓ Chat "${chat.title}" procesado (sin diálogo de confirmación)`);
      }
      
      // Actualizar progreso
      const progressText = document.querySelector('.progress-text');
      if (progressText) {
        progressText.textContent = `${deletedCount + failedCount} de ${selectedCheckboxes.length}`;
      }
      
    } catch (error) {
      console.error(`❌ Error eliminando chat "${chat.title}":`, error);
      failedCount++;
      errors.push(`"${chat.title}": ${error.message}`);
    }
    
    // Pausa entre eliminaciones para no sobrecargar
    await sleep(1000);
  }
  
  // Mostrar resultado final
  let resultMessage = `✅ Proceso completado\n\n`;
  resultMessage += `✓ Eliminados: ${deletedCount}\n`;
  
  if (failedCount > 0) {
    resultMessage += `✗ Fallidos: ${failedCount}\n`;
    
    if (errors.length > 0) {
      resultMessage += `\nErrores:\n`;
      errors.slice(0, 3).forEach(err => {
        resultMessage += `• ${err}\n`;
      });
      
      if (errors.length > 3) {
        resultMessage += `... y ${errors.length - 3} más\n`;
      }
    }
  }
  
  if (deletedCount > 0) {
    resultMessage += `\n💡 Recarga la página de Gemini para ver los cambios.`;
  }
  
  alert(resultMessage);
  
  // Recargar la lista de chats
  console.log('Recargando lista de chats...');
  setTimeout(() => {
    loadChats();
  }, 1500);
}

// Helper function para esperas
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Load prompts from storage
async function loadPrompts() {
  try {
    const result = await browser.storage.local.get(['prompts', 'categories']);
    const prompts = result.prompts || [];
    const categories = result.categories || [];
    
    // Actualizar selectores de categoría
    updateCategorySelects(categories);
    
    // Actualizar lista de categorías en el gestor
    updateCategoriesList(categories);
    
    const promptList = document.getElementById('prompt-list');
    
    if (prompts.length === 0) {
      promptList.innerHTML = '<p class="empty-state">No hay prompts guardados aún</p>';
      return;
    }
    
    // Aplicar filtros
    const filterCategory = document.getElementById('filter-category').value;
    const searchTerm = document.getElementById('search-prompts').value.toLowerCase();
    
    let filteredPrompts = prompts.map((prompt, index) => ({ ...prompt, originalIndex: index }));
    
    // Filtrar por categoría
    if (filterCategory) {
      filteredPrompts = filteredPrompts.filter(p => p.category === filterCategory);
    }
    
    // Filtrar por búsqueda
    if (searchTerm) {
      filteredPrompts = filteredPrompts.filter(p => 
        (p.name || '').toLowerCase().includes(searchTerm) ||
        p.text.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filteredPrompts.length === 0) {
      promptList.innerHTML = '<p class="empty-state">No se encontraron prompts con esos filtros</p>';
      return;
    }
    
    // Agrupar por categoría
    const grouped = {};
    filteredPrompts.forEach(prompt => {
      const cat = prompt.category || 'Sin categoría';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(prompt);
    });
    
    let html = '';
    Object.keys(grouped).sort().forEach(category => {
      html += `<div class="prompt-category-group">`;
      html += `<div class="category-header">${getCategoryIcon(category)} ${category}</div>`;
      
      grouped[category].forEach(prompt => {
        html += `
          <div class="prompt-item" data-category="${prompt.category || ''}">
            <div class="prompt-header">
              <strong>${prompt.name || 'Prompt sin nombre'}</strong>
              <div class="prompt-actions">
                <button class="btn-icon" data-action="copy" data-index="${prompt.originalIndex}" title="Copiar">📋</button>
                <button class="btn-icon" data-action="insert" data-index="${prompt.originalIndex}" title="Insertar">➕</button>
                <button class="btn-icon" data-action="edit" data-index="${prompt.originalIndex}" title="Editar">✏️</button>
                <button class="btn-icon" data-action="delete" data-index="${prompt.originalIndex}" title="Eliminar">🗑️</button>
              </div>
            </div>
            <div class="prompt-text">${prompt.text}</div>
            ${prompt.category ? `<div class="prompt-category-tag">${prompt.category}</div>` : ''}
          </div>
        `;
      });
      
      html += `</div>`;
    });
    
    promptList.innerHTML = html;
    
    // Add event listeners
    promptList.querySelectorAll('.btn-icon').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        const index = parseInt(e.target.dataset.index);
        handlePromptAction(action, index, prompts);
      });
    });
  } catch (error) {
    console.error('Error cargando prompts:', error);
  }
}

// Get category icon
function getCategoryIcon(category) {
  const icons = {
    'Programación': '💻',
    'Escritura': '✍️',
    'Aprendizaje': '📚',
    'Productividad': '⚡',
    'Creatividad': '🎨',
    'Análisis': '📊',
    'Sin categoría': '📄'
  };
  return icons[category] || '📁';
}

// Update category selects
function updateCategorySelects(categories) {
  const newPromptCategory = document.getElementById('new-prompt-category');
  const filterCategory = document.getElementById('filter-category');
  
  // Guardar valor actual
  const currentNew = newPromptCategory.value;
  const currentFilter = filterCategory.value;
  
  // Actualizar opciones
  newPromptCategory.innerHTML = '<option value="">Sin categoría</option>';
  filterCategory.innerHTML = '<option value="">📁 Todas las categorías</option>';
  
  categories.forEach(cat => {
    newPromptCategory.innerHTML += `<option value="${cat}">${cat}</option>`;
    filterCategory.innerHTML += `<option value="${cat}">${getCategoryIcon(cat)} ${cat}</option>`;
  });
  
  // Restaurar valores
  newPromptCategory.value = currentNew;
  filterCategory.value = currentFilter;
}

// Update categories list in manager
function updateCategoriesList(categories) {
  const list = document.getElementById('categories-list');
  
  if (categories.length === 0) {
    list.innerHTML = '<p class="empty-state-small">No hay categorías creadas</p>';
    return;
  }
  
  list.innerHTML = categories.map(cat => `
    <div class="category-item">
      <span>${getCategoryIcon(cat)} ${cat}</span>
      <button class="btn-icon-small" data-action="delete-category" data-category="${cat}" title="Eliminar categoría">×</button>
    </div>
  `).join('');
  
  // Event listeners para eliminar categorías
  list.querySelectorAll('[data-action="delete-category"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const category = e.target.dataset.category;
      deleteCategory(category);
    });
  });
}

// Add category
async function addCategory() {
  const input = document.getElementById('new-category-name');
  const categoryName = input.value.trim();
  
  if (!categoryName) {
    alert('Por favor escribe un nombre para la categoría');
    return;
  }
  
  try {
    const result = await browser.storage.local.get('categories');
    const categories = result.categories || [];
    
    if (categories.includes(categoryName)) {
      alert('Esta categoría ya existe');
      return;
    }
    
    categories.push(categoryName);
    await browser.storage.local.set({ categories });
    
    input.value = '';
    loadPrompts();
  } catch (error) {
    console.error('Error añadiendo categoría:', error);
    alert('Error al añadir la categoría');
  }
}

// Delete category
async function deleteCategory(categoryName) {
  if (!confirm(`¿Eliminar la categoría "${categoryName}"?\n\nLos prompts de esta categoría quedarán sin categoría.`)) {
    return;
  }
  
  try {
    const result = await browser.storage.local.get(['categories', 'prompts']);
    const categories = result.categories || [];
    const prompts = result.prompts || [];
    
    // Eliminar categoría
    const index = categories.indexOf(categoryName);
    if (index > -1) {
      categories.splice(index, 1);
    }
    
    // Limpiar categoría de los prompts
    prompts.forEach(prompt => {
      if (prompt.category === categoryName) {
        prompt.category = '';
      }
    });
    
    await browser.storage.local.set({ categories, prompts });
    loadPrompts();
  } catch (error) {
    console.error('Error eliminando categoría:', error);
    alert('Error al eliminar la categoría');
  }
}

// Filter prompts
function filterPrompts() {
  loadPrompts();
}

// Save prompt
async function savePrompt() {
  const text = document.getElementById('new-prompt-text').value.trim();
  const name = document.getElementById('new-prompt-name').value.trim();
  const category = document.getElementById('new-prompt-category').value;
  
  if (!text) {
    alert('Por favor escribe un prompt');
    return;
  }
  
  try {
    const result = await browser.storage.local.get('prompts');
    const prompts = result.prompts || [];
    
    prompts.push({
      name: name || `Prompt ${prompts.length + 1}`,
      text: text,
      category: category,
      createdAt: new Date().toISOString()
    });
    
    await browser.storage.local.set({ prompts });
    
    // Clear inputs
    document.getElementById('new-prompt-text').value = '';
    document.getElementById('new-prompt-name').value = '';
    document.getElementById('new-prompt-category').value = '';
    
    // Reload list
    loadPrompts();
    alert('✓ Prompt guardado exitosamente');
  } catch (error) {
    console.error('Error guardando prompt:', error);
    alert('Error al guardar el prompt');
  }
}

// Handle prompt actions
async function handlePromptAction(action, index, prompts) {
  const prompt = prompts[index];
  
  switch (action) {
    case 'copy':
      navigator.clipboard.writeText(prompt.text);
      alert('✓ Prompt copiado al portapapeles');
      break;
      
    case 'insert':
      // Buscar el textarea de Gemini e insertar el texto
      const textarea = document.querySelector('rich-textarea, textarea, [contenteditable="true"]');
      if (textarea) {
        if (textarea.tagName === 'TEXTAREA') {
          textarea.value = prompt.text;
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
        } else if (textarea.hasAttribute('contenteditable')) {
          textarea.textContent = prompt.text;
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }
        textarea.focus();
        alert('✓ Prompt insertado');
      } else {
        alert('⚠️ No se pudo encontrar el área de texto de Gemini');
      }
      break;
      
    case 'edit':
      // Editar prompt
      const newName = prompt('Nombre del prompt:', prompt.name);
      if (newName === null) return;
      
      const newText = prompt('Texto del prompt:', prompt.text);
      if (newText === null) return;
      
      const result = await browser.storage.local.get(['prompts', 'categories']);
      const categories = result.categories || [];
      
      let newCategory = prompt.category;
      if (categories.length > 0) {
        const catChoice = prompt(
          `Categoría actual: ${prompt.category || 'Sin categoría'}\n\n` +
          `Categorías disponibles:\n${categories.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\n` +
          `Escribe el número de la categoría o el nombre (deja vacío para sin categoría):`
        );
        
        if (catChoice !== null) {
          const catIndex = parseInt(catChoice) - 1;
          if (!isNaN(catIndex) && categories[catIndex]) {
            newCategory = categories[catIndex];
          } else if (catChoice.trim()) {
            newCategory = catChoice.trim();
          } else {
            newCategory = '';
          }
        }
      }
      
      prompts[index] = {
        ...prompt,
        name: newName.trim() || prompt.name,
        text: newText.trim() || prompt.text,
        category: newCategory
      };
      
      await browser.storage.local.set({ prompts });
      loadPrompts();
      alert('✓ Prompt actualizado');
      break;
      
    case 'delete':
      if (confirm(`¿Eliminar el prompt "${prompt.name}"?`)) {
        prompts.splice(index, 1);
        await browser.storage.local.set({ prompts });
        loadPrompts();
        alert('✓ Prompt eliminado');
      }
      break;
  }
}

// Initialize
async function init() {
  try {
    // Esperar a que la página esté lista
    await waitForElement('body');
    
    // Crear y añadir el botón
    const button = createToolboxButton();
    document.body.appendChild(button);
    
    // Crear y añadir el panel
    const panel = createToolboxPanel();
    document.body.appendChild(panel);
    
    console.log('Gemini Toolbox: Inicializado correctamente');
  } catch (error) {
    console.error('Error inicializando Gemini Toolbox:', error);
  }
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
