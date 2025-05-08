// nestedMenu.js

export function showNestedMenu() {
    const container = document.getElementById('nestedMenuContainer');
    container.innerHTML = `
      <div class="nested-menu">
        <ul>
          <li>Orthotics
            <ul>
              <li>Arm Sling</li>
              <li>Wrist Brace</li>
            </ul>
          </li>
          <li>Vision
            <ul>
              <li>Eyeglasses</li>
              <li>Yellow Vision Vest</li>
            </ul>
          </li>
          <li>Compression
            <ul>
              <li>Compression Gloves</li>
              <li>Burn Garment</li>
            </ul>
          </li>
        </ul>
      </div>
    `;
    container.style.display = 'block';
  }
  