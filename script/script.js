const feImages = document.querySelectorAll("feImage");
const url = feImages[0].getAttribute("href");

fetch(url)
  .then((response) => response.blob())
  .then((blob) => {
    const objURL = URL.createObjectURL(blob);

    feImages.forEach((feImage) => {
      feImage.setAttribute("href", objURL);
    });
  });

// Make the art image draggable
const art = document.getElementById('draggable-art');
let isDragging = false;
let offset = { x: 0, y: 0 };

// Get the constraint rectangle from the SVG
const constraintRect = document.querySelector('#constraint-rect');
const rectX = parseFloat(constraintRect.getAttribute('x'));
const rectY = parseFloat(constraintRect.getAttribute('y'));
const rectWidth = parseFloat(constraintRect.getAttribute('width'));
const rectHeight = parseFloat(constraintRect.getAttribute('height'));

// Get info panel elements
const verticalDistanceSpan = document.getElementById('vertical-distance');
const horizontalDistanceSpan = document.getElementById('horizontal-distance');
const verticalDistanceInSpan = document.getElementById('vertical-distance-in');
const horizontalDistanceInSpan = document.getElementById('horizontal-distance-in');

// Store original dimensions of the background image
let bgOriginalWidth = 0;
let bgOriginalHeight = 0;
let bgRatio = 0;
const bgImg = new window.Image();
bgImg.src = 'img/mockup1.webp';
bgImg.onload = function() {
  bgOriginalWidth = bgImg.naturalWidth;
  bgOriginalHeight = bgImg.naturalHeight;
  console.log('Background image original size:', bgOriginalWidth, 'x', bgOriginalHeight);
  const svgElement = document.querySelector('svg');
  bgRatio = bgOriginalWidth / svgElement.clientWidth;
  console.log('Background image ratio:', bgRatio);
};

function updateInfoPanel() {
  const artBox = art.getBBox();
  const boxTop = rectY;
  const boxCenterX = rectX + rectWidth / 2;
  const artTop = parseFloat(art.getAttribute('y'));
  const artCenterX = parseFloat(art.getAttribute('x')) + artBox.width / 2;
  const verticalDistance = Math.round((artTop - boxTop) * bgRatio);
  const horizontalDistance = Math.round((artCenterX - boxCenterX) * bgRatio);
  verticalDistanceSpan.textContent = verticalDistance;
  horizontalDistanceSpan.textContent = horizontalDistance;
  // Calculate inches (pixels / 72)
  verticalDistanceInSpan.textContent = (verticalDistance / 72).toFixed(2);
  horizontalDistanceInSpan.textContent = (horizontalDistance / 72).toFixed(2);
}

art.addEventListener('mousedown', (e) => {
  isDragging = true;
  const svg = art.ownerSVGElement;
  const pt = svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  const cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
  offset.x = cursorpt.x - parseFloat(art.getAttribute('x'));
  offset.y = cursorpt.y - parseFloat(art.getAttribute('y'));
  updateInfoPanel();
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const svg = art.ownerSVGElement;
  const pt = svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  const cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
  // Use rendered size for clamping
  const bbox = art.getBBox();
  const minX = rectX;
  const minY = rectY;
  const maxX = rectX + rectWidth - bbox.width;
  const maxY = rectY + rectHeight - bbox.height;
  let newX = cursorpt.x - offset.x;
  let newY = cursorpt.y - offset.y;
  // Clamp to rectangle
  newX = Math.max(minX, Math.min(maxX, newX));
  newY = Math.max(minY, Math.min(maxY, newY));
  art.setAttribute('x', newX);
  art.setAttribute('y', newY);
  updateInfoPanel();
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  updateInfoPanel();
});

// Initial update
window.addEventListener('DOMContentLoaded', updateInfoPanel);

// Dynamically set the height of the art image based on its natural aspect ratio
const artImg = new window.Image();
artImg.src = art.getAttribute('href');
artImg.onload = function() {
  const width = parseFloat(art.getAttribute('width'));
  const aspect = artImg.naturalWidth / artImg.naturalHeight;
  // height = width / aspect
  const height = width / aspect;
  art.setAttribute('height', height);
};


