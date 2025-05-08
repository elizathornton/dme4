// dataLoader.js

export let dmeCatalog= [];
export let patientDmeData = [];

// Public function to load and parse both CSVs
export async function loadCSVData() {
  const [dmeCSV, patientCSV] = await Promise.all([
    fetch('Data/dme_list.csv').then(res => res.text()),
    fetch('Data/patient_dme.csv').then(res => res.text())
  ]);

  dmeCatalog = parseCSV(dmeCSV);
  patientDmeData = parseCSV(patientCSV);
  return { dmeCatalog, patientDmeData };
}

// Helper to parse a full CSV into objects
function parseCSV(data) {
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

// Handles a single line (with commas and quotes)
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"';
      i++;
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

