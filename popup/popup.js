// Popup script
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on a Gemini tab
  checkGeminiTab();
  
  // Open Gemini button
  document.getElementById('open-gemini').addEventListener('click', () => {
    browser.tabs.create({
      url: 'https://gemini.google.com/'
    });
  });
  
  // View prompts button
  document.getElementById('view-prompts').addEventListener('click', async () => {
    const result = await browser.storage.local.get('prompts');
    const prompts = result.prompts || [];
    
    if (prompts.length === 0) {
      alert('No tienes prompts guardados aún. Navega a Gemini y abre el Toolbox para añadir prompts.');
    } else {
      alert(`Tienes ${prompts.length} prompt(s) guardado(s). Abre el Toolbox en Gemini para gestionarlos.`);
    }
  });
});

// Check if current tab is Gemini
async function checkGeminiTab() {
  try {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];
    
    const statusDiv = document.getElementById('status');
    
    if (currentTab.url && currentTab.url.includes('gemini.google.com')) {
      statusDiv.className = 'status';
      statusDiv.textContent = '✓ Toolbox activo en esta pestaña';
    } else {
      statusDiv.className = 'status inactive';
      statusDiv.textContent = 'Navega a gemini.google.com para usar el toolbox';
    }
  } catch (error) {
    console.error('Error checking tab:', error);
  }
}
