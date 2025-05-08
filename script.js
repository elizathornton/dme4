// Import all the classes and functions
import { loadCSVData } from './dataLoader.js';
import { DMEItem, Patient, PatientDme, F1845, F7410, F7536 } from './classes.js';
import { showNestedMenu } from './browseMenu.js';
import { openCatalogModal } from './dmeCatalogMenu.js';


let globalDmeCatalog = []; // store DME catalog here

loadCSVData().then(({ dmeCatalog, patientDmeData }) => {
  globalDmeCatalog = dmeCatalog;
  populateTable(patientDmeData);
});

document.getElementById('browseButton').addEventListener('click', () => {
  showNestedMenu(globalDmeCatalog);
});




function populateTable(patientDmeData) {
  const tableBody = document.querySelector('#dmeTable tbody');
  tableBody.innerHTML = ''; // Clear any existing rows

  patientDmeData.forEach(dmeRow => {
    const row = document.createElement('tr');
    console.log(dmeRow); // Log the current row for debugging

    //Add info icon
    const infoCell = document.createElement('td');
    const infoIcon = document.createElement('span');
    infoIcon.innerHTML = '&#9432;'; // Unicode info symbol ℹ
    infoIcon.classList.add('info-icon');
    infoIcon.title = 'More info about this DME';
    infoCell.appendChild(infoIcon);
    row.appendChild(infoCell);

    // Add DME Name cell
    const nameCell = document.createElement('td');
    nameCell.textContent = dmeRow['DME'] ; // The first column is the DME name
    row.appendChild(nameCell);


    // Add Status cell
    const statusCell = createStatusCell(dmeRow['Status'], dmeRow['Stop Date']);
    row.appendChild(statusCell);


    // Add empty <td> for blank column
    const emptyCell = document.createElement('td');
    row.appendChild(emptyCell);

    // Add Action cell
    // Add Action cell with multiple buttons
    const actionCell = createActionCell(dmeRow);
    row.appendChild(actionCell);

    tableBody.appendChild(row);
  });
}


// Add event listener to close the pop-up box when the close button is clicked
const closeButton = document.getElementById('closeButton');
closeButton.addEventListener('click', () => {
  const popUpBox = document.getElementById('popUpBox');
  popUpBox.style.display = 'none';  // Hide the pop-up box when clicking the close button
});



document.addEventListener('DOMContentLoaded', async () => {
  const { dmeCatalog } = await loadCSVData();

  const browseLabel = document.querySelector('.browse-label');
  browseLabel.addEventListener('click', () => {
    openCatalogModal(dmeCatalog, selected => {
      console.log('Selected DME:', selected); // handle selection
    });
  });

  // ... rest of your table population logic
});




// This function shows an info box with a message
function showInfoBox(message) {
  const popUpBox = document.getElementById('popUpBox');
  const popUpMessage = document.getElementById('popUpMessage');
  popUpMessage.textContent = message;  // Set the message in the pop-up
  popUpBox.style.display = 'block';  // Make the pop-up visible
}


// This function creates a status cell with color coding
function createStatusCell(status, stopDateStr) {
  const statusCell = document.createElement('td');
  const statusLower = status?.toLowerCase();
  const today = new Date();
  let isGreen = false;

  if (statusLower === 'permanent') {
    isGreen = true;
  } else if (statusLower === 'temporary' && stopDateStr) {
    const stopDate = new Date(stopDateStr);
    isGreen = stopDate > today;
  }

  statusCell.style.color = isGreen ? 'green' : 'red';
  statusCell.textContent = `${status} ${stopDateStr}`.trim();
  return statusCell;
}

// This function creates an action cell with buttons
function createActionCell(dmeRow) {
  const actionCell = document.createElement('td');
  const actions = [
    {
      text: 'Has DME',
      colorClass: 'green-btn',
      message: 'Thank you for confirming that the patient has the DME in their possession.'
    },
    {
      text: 'No DME',
      colorClass: 'yellow-btn',
      message: 'DME has been lost, stolen, destroyed, or confiscated. The patient must obtain a receipt from custody stating what happened to the DME. Patient must return to clinic with the receipt and will be issued replacement DME.'
    },
    {
      text: 'Damaged',
      colorClass: 'purple-btn',
      message: 'Patient must submit the damaged DME to clinic and receive replacement DME.'
    },
    {
      text: 'DC',
      colorClass: 'red-btn',
      message: 'The DME order has been discontinued.'
    }
  ];

  actions.forEach(action => {
    const btn = document.createElement('button');
    btn.textContent = action.text;
    btn.classList.add('action-btn', action.colorClass);
    btn.onclick = () => showInfoBox(action.message);
    actionCell.appendChild(btn);
  });

  return actionCell;
}

