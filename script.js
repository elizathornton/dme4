let dmeDetails = [];
console.log("LINE 1");

// Load both CSVs safely
Promise.all([
  fetch('DME_list.csv').then(res => res.text()),
  fetch('data.csv').then(res => res.text())
]).then(([dmeCSV, dataCSV]) => {
  dmeDetails = parseCSV(dmeCSV);
  const rows = parseCSV(dataCSV);
  populateTable(rows);
});

function parseCSV(data) {
  console.log("Top of parseCSV");
  const lines = data.trim().split(/\r?\n/);
  const headers = parseCSVLine(lines[0]).map(h => h.trim());

  return lines.slice(1)
    .filter(line => line.trim() !== '')
    .map(line => {
      const values = parseCSVLine(line);
      const row = {};
      headers.forEach((header, i) => {
        row[header] = values[i]?.trim() ?? '';
      });
      return row;
    });
}

function parseCSVLine(line) {
  console.log("Top of parseCSVLine");
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"';
      i++; // skip escaped quote
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function getColorByStatus(status) {
  if (status === 'Valid') return 'green';
  if (status === 'Needs Receipt') return 'red';
  return 'blue';
}

function populateTable(dataRows) {
  const tbody = document.querySelector('#dmeTable tbody');
  const infoBox = document.getElementById('infoBox');

  dataRows.forEach(row => {
    const tr = document.createElement('tr');

    // Name cell with status bar and info icon
    const nameTd = document.createElement('td');
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row-container';

    const color = getColorByStatus(row.Status);

    const bar = document.createElement('div');
    bar.className = 'status-bar';
    bar.style.backgroundColor = color;

    const infoIcon = document.createElement('div');
    infoIcon.className = 'info-icon';
    infoIcon.style.backgroundColor = color;
    infoIcon.textContent = 'i';
    infoIcon.onclick = (e) => {
      e.stopPropagation();
      const detail = dmeDetails.find(d => d['Item'] === row.Name);
      if (detail) {
        infoBox.style.display = 'block';
        infoBox.style.top = `${e.pageY + 10}px`;
        infoBox.style.left = `${e.pageX + 10}px`;
        infoBox.innerHTML = `<strong>${row.Name}</strong><br><small>${detail['Subcategory 1'] || ''}, ${detail['Subcategory 2'] || ''}</small><br><br>` +
          `<div style="font-size: 13px;">${detail.Description || ''}<br><br>
            <strong>Brand:</strong> ${detail.Brand || ''}<br>
            <strong>Image:</strong> ${detail.Image || ''}<br>
            <strong>Indications:</strong> ${detail['Indications'] || ''}<br>
            <strong>Clinical Actions:</strong> ${detail['Clinical Actions'] || ''}<br>
            <strong>Workflow Actions:</strong> ${detail['Workflow Actions'] || ''}</div>`;
      } else {
        infoBox.style.display = 'block';
        infoBox.style.top = `${e.pageY + 10}px`;
        infoBox.style.left = `${e.pageX + 10}px`;
        infoBox.innerHTML = `<strong>${row.Name}</strong><br><small>No details found.</small>`;
      }
    };

    rowDiv.appendChild(infoIcon);
    rowDiv.appendChild(bar);

    const nameContent = document.createElement('div');
    nameContent.innerHTML = `<div>${row.Name}</div><div style="font-size: 13px; color: #aaa;">Loading subcategories...</div>`;
    rowDiv.appendChild(nameContent);

    nameTd.appendChild(rowDiv);
    tr.appendChild(nameTd);

    // Status
    const statusTd = document.createElement('td');
    statusTd.textContent = row.Status;
    statusTd.style.color = color; 
    tr.appendChild(statusTd);

    // Stop
    const stopTd = document.createElement('td');
    stopTd.textContent = row.Stop;
    tr.appendChild(stopTd);

    // Actions
    const actionTd = document.createElement('td');
    actionTd.className = 'action-buttons';

    ['DC', 'Patient Has', 'Does Not Have', 'Damaged'].forEach(action => {
      const btn = document.createElement('button');
      btn.textContent = action;
      if (action === 'DC') btn.classList.add('dc');
      else if (action === 'Patient Has') btn.classList.add('has');
      else if (action === 'Does Not Have') btn.classList.add('lost');
      else if (action === 'Damaged') btn.classList.add('damaged');
      actionTd.appendChild(btn);
    });

    tr.appendChild(actionTd);
    tbody.appendChild(tr);

    // Load subcategories into 2nd line
    const detail = dmeDetails.find(d => d['Item'] === row.Name);
    if (detail) {
      nameContent.children[1].textContent = `${detail['Subcategory 1'] || ''}, ${detail['Subcategory 2'] || ''}`;
    }
  });

  document.body.onclick = (e) => {
    if (!e.target.classList.contains('info-icon')) {
      infoBox.style.display = 'none';
    }
  };
}
