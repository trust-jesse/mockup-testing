// Variables from SalesForce

// Mockup Images
const frontMapImage = "https://tds-website.s3.us-east-2.amazonaws.com/client-websites/realthread/mockup-testing/5026/front-map.avif";
const backMapImage = "https://tds-website.s3.us-east-2.amazonaws.com/client-websites/realthread/mockup-testing/5026/back-map.avif";
const frontOverlayImage = "https://tds-website.s3.us-east-2.amazonaws.com/client-websites/realthread/mockup-testing/5026/front-overlay.avif";
const backOverlayImage = "https://tds-website.s3.us-east-2.amazonaws.com/client-websites/realthread/mockup-testing/5026/back-overlay.avif";

// Placements

// Front Art
const isFront = true;
const frontArtImage = "https://tds-website.s3.us-east-2.amazonaws.com/client-websites/realthread/mockup-testing/art/front.png";
let frontBoc = 2.5;
let frontOffset = 2.5;

// Front Bounding Box
let frontBoundingBox = {
  topLeft: { x: 125, y: 70 },
  bottomRight: { x: 275, y: 270 }
};

// Back
const isBack = false;
const backArtImage = "https://tds-website.s3.us-east-2.amazonaws.com/client-websites/realthread/mockup-testing/art/back.png";
let backBoc = 3.5;
let backOffset = 0;
let backBoundingBox = {
  topLeft: { x: 125, y: 70 },
  bottomRight: { x: 275, y: 270 }
};

// Left Sleeve
const isLeftSleeve = false;

// Right Sleeve
const isRightSleeve = false;

// Tag
const isTag = false;

// Image PPI
const imagePPI = 60;

// fetch(url)
//   .then((response) => response.blob())
//   .then((blob) => {
//     const objURL = URL.createObjectURL(blob);

//     feImages.forEach((feImage) => {
//       feImage.setAttribute("href", objURL);
//     });
//   });

// Utility to set up a mockup canvas (front or back)
function setupMockupCanvas(canvas) {
  const art = canvas.querySelector('image[id^="draggable-art-"]');
  const constraintRect = canvas.querySelector('rect[id^="constraint-rect-"]');
  let isDragging = false;
  let offset = { x: 0, y: 0 };

  // Get constraint rect values
  const rectX = parseFloat(constraintRect.getAttribute('x'));
  const rectY = parseFloat(constraintRect.getAttribute('y'));
  const rectWidth = parseFloat(constraintRect.getAttribute('width'));
  const rectHeight = parseFloat(constraintRect.getAttribute('height'));

  // Store original dimensions of the background image
  let bgOriginalWidth = 0;
  let bgOriginalHeight = 0;
  let bgRatio = 1;
  const bgImg = new window.Image();
  const bgHref = canvas.querySelector('image:not([id])').getAttribute('href');
  bgImg.src = bgHref;
  bgImg.onload = function() {
    bgOriginalWidth = bgImg.naturalWidth;
    bgOriginalHeight = bgImg.naturalHeight;
    const svgElement = canvas;
    bgRatio = bgOriginalWidth / svgElement.clientWidth;

    // Now scale the art image using its own pixel dimensions
    const artImg = new window.Image();
    artImg.src = art.getAttribute('href');
    artImg.onload = function() {
      // Use the art image's own pixel dimensions
      const originalArtWidth = artImg.naturalWidth;
      const originalArtHeight = artImg.naturalHeight;

      // Scale by bgRatio
      const scaledWidth = originalArtWidth / bgRatio;
      const scaledHeight = originalArtHeight / bgRatio;
      art.setAttribute('width', scaledWidth);
      art.setAttribute('height', scaledHeight);

      // Set initial position for front art image using frontBoc and frontOffset
      if (canvas.dataset.canvas === 'front') {
        // Y: frontBoc is in inches, convert to px in SVG coordinates
        const artY = rectY + (frontBoc * imagePPI) / bgRatio;
        art.setAttribute('y', artY);
        // X: frontOffset is in inches, convert to px, offset from box center
        const boxCenterX = rectX + rectWidth / 2;
        const artWidth = parseFloat(art.getAttribute('width'));
        const artX = boxCenterX - artWidth / 2 + (frontOffset * imagePPI) / bgRatio;
        art.setAttribute('x', artX);
      }
      // Set initial position for back art image using backBoc and backOffset
      if (canvas.dataset.canvas === 'back') {
        // Y: backBoc is in inches, convert to px in SVG coordinates
        const artY = rectY + (backBoc * imagePPI) / bgRatio;
        art.setAttribute('y', artY);
        // X: backOffset is in inches, convert to px, offset from box center
        const boxCenterX = rectX + rectWidth / 2;
        const artWidth = parseFloat(art.getAttribute('width'));
        const artX = boxCenterX - artWidth / 2 + (backOffset * imagePPI) / bgRatio;
        art.setAttribute('x', artX);
      }
    };
  };

  function updateInfoPanel() {
    const artBox = art.getBBox();
    const boxTop = rectY;
    const boxCenterX = rectX + rectWidth / 2;
    const artTop = parseFloat(art.getAttribute('y'));
    const artCenterX = parseFloat(art.getAttribute('x')) + artBox.width / 2;
    const verticalDistance = Math.round((artTop - boxTop) * bgRatio);
    const horizontalDistance = Math.round((artCenterX - boxCenterX) * bgRatio);
    // Only update the info panel if this is the front canvas
    if (canvas.dataset.canvas === 'front') {
      // document.getElementById('vertical-distance-in').textContent = (verticalDistance / imagePPI).toFixed(2);
      // document.getElementById('horizontal-distance-in').textContent = (horizontalDistance / imagePPI).toFixed(2);
      // Update sidebar boc and offset for front (input values)
      const bocInches = ((artTop - boxTop) * bgRatio) / imagePPI;
      const offsetInches = ((artCenterX - boxCenterX) * bgRatio) / imagePPI;
      document.getElementById('var-frontBoc').value = bocInches.toFixed(2);
      document.getElementById('var-frontOffset').value = offsetInches.toFixed(2);
    }
    if (canvas.dataset.canvas === 'back') {
      // Update sidebar boc and offset for back (input values)
      const bocInches = ((artTop - boxTop) * bgRatio) / imagePPI;
      const offsetInches = ((artCenterX - boxCenterX) * bgRatio) / imagePPI;
      document.getElementById('var-backBoc').value = bocInches.toFixed(2);
      document.getElementById('var-backOffset').value = offsetInches.toFixed(2);
    }
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
    const bbox = art.getBBox();
    const minX = rectX;
    const minY = rectY;
    const maxX = rectX + rectWidth - bbox.width;
    const maxY = rectY + rectHeight - bbox.height;
    let newX = cursorpt.x - offset.x;
    let newY = cursorpt.y - offset.y;
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
}

// Fetch and set object URLs for front and back map images
function fetchAndSetMockupImages() {
  // Helper to fetch and set all elements with a given data-img-type
  function fetchAndSet(url, selector) {
    return fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const objURL = URL.createObjectURL(blob);
        document.querySelectorAll(selector).forEach(el => {
          el.setAttribute('href', objURL);
        });
      });
  }
  // Fetch and set for front
  const frontPromise = fetchAndSet(frontMapImage, '[data-img-type="front-map"]');
  // Fetch and set for back
  const backPromise = fetchAndSet(backMapImage, '[data-img-type="back-map"]');
  // Wait for both to finish
  return Promise.all([frontPromise, backPromise]);
}

window.addEventListener('DOMContentLoaded', () => {
  // Fetch and set the mockup images, then set art images and set up canvases
  fetchAndSetMockupImages().then(() => {
    // Set art images (these can use direct URLs, no need for fetch)
    const frontArt = document.querySelector('[data-img-type="front-art"]');
    if (frontArt) frontArt.setAttribute('href', frontArtImage);
    const backArt = document.querySelector('[data-img-type="back-art"]');
    if (backArt) backArt.setAttribute('href', backArtImage);
    // Set up both canvases
    document.querySelectorAll('.mockup-canvas').forEach(setupMockupCanvas);

    // Update sidebar variable values
    document.getElementById('var-frontMapImage').textContent = frontMapImage;
    document.getElementById('var-frontOverlayImage').textContent = frontOverlayImage;
    document.getElementById('var-frontArtImage').textContent = frontArtImage;
    document.getElementById('var-frontBoc').textContent = frontBoc;
    document.getElementById('var-frontOffset').textContent = frontOffset;
    document.getElementById('var-backMapImage').textContent = backMapImage;
    document.getElementById('var-backOverlayImage').textContent = backOverlayImage;
    document.getElementById('var-backArtImage').textContent = backArtImage;
    document.getElementById('var-backBoc').textContent = backBoc;
    document.getElementById('var-backOffset').textContent = backOffset;
    document.getElementById('var-imagePPI').textContent = imagePPI;

    // Set initial values for editable inputs
    document.getElementById('var-frontBoc').value = frontBoc;
    document.getElementById('var-frontOffset').value = frontOffset;
    document.getElementById('var-backBoc').value = backBoc;
    document.getElementById('var-backOffset').value = backOffset;

    // Add listeners to update art position when inputs change
    document.getElementById('var-frontBoc').addEventListener('input', function() {
      updateArtPositionFromInputs('front');
    });
    document.getElementById('var-frontOffset').addEventListener('input', function() {
      updateArtPositionFromInputs('front');
    });
    document.getElementById('var-backBoc').addEventListener('input', function() {
      updateArtPositionFromInputs('back');
    });
    document.getElementById('var-backOffset').addEventListener('input', function() {
      updateArtPositionFromInputs('back');
    });
  });
});

function updateArtPositionFromInputs(which) {
  // which: 'front' or 'back'
  const canvas = document.querySelector(`.mockup-canvas[data-canvas="${which}"]`);
  const art = canvas.querySelector('image[id^="draggable-art-"]');
  const constraintRect = canvas.querySelector('rect[id^="constraint-rect-"]');
  const rectX = parseFloat(constraintRect.getAttribute('x'));
  const rectY = parseFloat(constraintRect.getAttribute('y'));
  const rectWidth = parseFloat(constraintRect.getAttribute('width'));
  // Get bgRatio
  const bgImg = new window.Image();
  const bgHref = canvas.querySelector('image:not([id])').getAttribute('href');
  bgImg.src = bgHref;
  bgImg.onload = function() {
    const bgOriginalWidth = bgImg.naturalWidth;
    const svgElement = canvas;
    const bgRatio = bgOriginalWidth / svgElement.clientWidth;
    // Get art width
    const artWidth = parseFloat(art.getAttribute('width'));
    // Get values from inputs
    const boc = parseFloat(document.getElementById(`var-${which}Boc`).value) || 0;
    const offset = parseFloat(document.getElementById(`var-${which}Offset`).value) || 0;
    // Calculate new positions
    const artY = rectY + (boc * imagePPI) / bgRatio;
    const boxCenterX = rectX + rectWidth / 2;
    const artX = boxCenterX - artWidth / 2 + (offset * imagePPI) / bgRatio;
    art.setAttribute('y', artY);
    art.setAttribute('x', artX);
    // Optionally, update the info panel
    // (re-run updateInfoPanel if needed)
    if (typeof updateInfoPanel === 'function') updateInfoPanel();
  };
}


