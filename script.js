const mainImage = document.getElementById('mainImage');
const container = document.getElementById('container');
const areas = document.querySelectorAll('area');
const overlays = {}; 

// ===========================================================
// Get center of each <area>
function getAreaCenter(area) {
  const coords = area.coords.split(',').map(Number);
  if (area.shape === 'circle') {
    return [coords[0], coords[1]];
  } else if (area.shape === 'rect') {
    return [(coords[0] + coords[2]) / 2, (coords[1] + coords[3]) / 2];
  } else if (area.shape === 'poly') {
    let sumX = 0, sumY = 0;
    for (let i = 0; i < coords.length; i += 2) {
      sumX += coords[i];
      sumY += coords[i + 1];
    }
    return [sumX / (coords.length / 2), sumY / (coords.length / 2)];
  }
  return null;
}

// ===========================================================
// Convert image pixel coords to viewport coords
function imagePixelToViewport(x, y) {
  const rect = mainImage.getBoundingClientRect();
  const naturalW = mainImage.naturalWidth;
  const naturalH = mainImage.naturalHeight;
  if (!naturalW || !naturalH) return [x, y]; // Fallback

  const scale = Math.max(rect.width / naturalW, rect.height / naturalH);
  const offsetX = (rect.width - naturalW * scale) / 2;
  const offsetY = (rect.height - naturalH * scale) / 2;
  return [x * scale + offsetX + rect.left, y * scale + offsetY + rect.top];
}

// ===========================================================
// Create an overlay image at the specified area
function createOverlay(area) {
  const center = getAreaCenter(area);
  if (!center) return;
  const [x, y] = imagePixelToViewport(center[0], center[1]);

  const div = document.createElement('div');
  div.className = 'overlay';
  div.style.left = `${x}px`;
  div.style.top = `${y}px`;

  const img = document.createElement('img');
  img.src = area.dataset.img;
  img.style.width = `${Math.floor(Math.random() * 800) + 800}px`; 
  img.style.opacity = 0;
  img.style.transition = 'opacity 1s ease';

  div.appendChild(img);
  container.appendChild(div);

  requestAnimationFrame(() => (img.style.opacity = 1));

  // fade out after 20s
  setTimeout(() => {
    img.style.opacity = 0;
    setTimeout(() => div.remove(), 2000);
  }, 20000);
}

// ===========================================================
// Keydown event to trigger overlays
document.addEventListener('keydown', (e) => {
  const keyMap = { 65: 0, 68: 1, 71: 2, 74: 3, 76: 4 }; // A D G J L
  const index = keyMap[e.keyCode];
  if (index === undefined) return;

  const area = areas[index];
  if (!area) return;

  if (overlays[index]) {
    overlays[index].remove();
    delete overlays[index];
    return;
  }

  createOverlay(area);
});
