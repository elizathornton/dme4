// dmeCatalogMenu.js

export function openCatalogModal(dmeCatalog, onSelectDME) {
    const modal = document.getElementById('catalogModal');
    modal.innerHTML = '';
    modal.style.display = 'flex';
  
    const overlay = document.createElement('div');
    overlay.className = 'catalog-overlay';
    overlay.addEventListener('click', () => modal.style.display = 'none');
  
    const container = document.createElement('div');
    container.className = 'catalog-container';
    container.addEventListener('click', e => e.stopPropagation());
  
    const title = document.createElement('h2');
    title.textContent = 'DME Catalog';
    title.className = 'catalog-title';
    container.appendChild(title);
  
    // Group by category and subcategory
    const grouped = {};
    for (const item of dmeCatalog) {
      const category = item.category || 'Uncategorized';
      const sub = item.subcategory1 || 'Uncategorized';
  
      if (!grouped[category]) grouped[category] = {};
      if (!grouped[category][sub]) grouped[category][sub] = [];
      grouped[category][sub].push(item);
    }
  
    for (const [category, subcategories] of Object.entries(grouped)) {
      const catDiv = document.createElement('div');
      catDiv.className = 'catalog-category';
  
      const catHeader = document.createElement('div');
      catHeader.textContent = category;
      catHeader.className = 'category-header';
  
      const subList = document.createElement('div');
      subList.className = 'subcategory-list';
      subList.style.display = 'none';
  
      catHeader.addEventListener('click', () => {
        subList.style.display = subList.style.display === 'none' ? 'block' : 'none';
      });
  
      for (const [subcat, items] of Object.entries(subcategories)) {
        const subHeader = document.createElement('div');
        subHeader.textContent = subcat;
        subHeader.className = 'subcategory-header';
  
        const itemList = document.createElement('div');
        itemList.className = 'dme-item-list';
        itemList.style.display = 'none';
  
        subHeader.addEventListener('click', () => {
          itemList.style.display = itemList.style.display === 'none' ? 'block' : 'none';
        });
  
        for (const dme of items) {
          const itemDiv = document.createElement('div');
          itemDiv.textContent = dme.item;
          itemDiv.className = 'dme-item';
          itemDiv.addEventListener('click', () => {
            modal.style.display = 'none';
            if (onSelectDME) onSelectDME(dme);
          });
          itemList.appendChild(itemDiv);
        }
  
        subList.appendChild(subHeader);
        subList.appendChild(itemList);
      }
  
      catDiv.appendChild(catHeader);
      catDiv.appendChild(subList);
      container.appendChild(catDiv);
    }
  
    overlay.appendChild(container);
    modal.appendChild(overlay);
  }
  