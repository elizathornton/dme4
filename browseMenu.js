// browseMenu.js
export function showNestedMenu(dmeCatalog, containerId = 'nestedMenuContainer') {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear previous content
    container.style.display = 'block'; // Show it
  
    const menu = document.createElement('ul');
    menu.classList.add('nested-menu');
  
    // Example: assume dmeCatalog is an array of DMEItem instances or objects
    dmeCatalog.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.name || item.DME || 'Unnamed Item';
      menu.appendChild(li);
    });
  
    container.appendChild(menu);
  }
  