// Variables from SalesForce

// Mockup Images
let frontMapImage =
  "https://tds-website.s3.us-east-2.amazonaws.com/client-websites/realthread/mockup-testing/5026/front-72.jpg";
let backMapImage =
  "https://tds-website.s3.us-east-2.amazonaws.com/client-websites/realthread/mockup-testing/5026/back-72.jpg";
let frontOverlayImage =
  "https://tds-website.s3.us-east-2.amazonaws.com/client-websites/realthread/mockup-testing/5026/front-72.png";
let backOverlayImage =
  "https://tds-website.s3.us-east-2.amazonaws.com/client-websites/realthread/mockup-testing/5026/back-72.png";
let blankColor = "#2e146b";

// Placements

// Front Art
const isFront = true;
let frontArtImage =
  "https://tds-website.s3.us-east-2.amazonaws.com/client-websites/realthread/mockup-testing/art/front-72.png";
let frontBoc = 2;
let frontOffset = 2;

// Front Bounding Box
let frontBoundingBox = {
  topLeft: { x: 516, y: 272 },
  bottomRight: { x: 1122, y: 1300 },
};

// Back
const isBack = true;
let backArtImage =
  "https://tds-website.s3.us-east-2.amazonaws.com/client-websites/realthread/mockup-testing/art/back-new.png";
let backBoc = 2;
let backOffset = 0;

// Back Bounding Box
let backBoundingBox = {
  topLeft: { x: 533, y: 218 },
  bottomRight: { x: 1111, y: 1300 },
};

// Left Sleeve
const isLeftSleeve = true;
let leftSleeveArtImage =
  "https://tds-website.s3.us-east-2.amazonaws.com/client-websites/realthread/mockup-testing/art/front-72.png";
let leftSleeveFrontBoc = 2.6;
let leftSleeveFrontOffset = .6;
let leftSleeveFrontRotation = -10;
let leftSleeveBackBoc = 2.5;
let leftSleeveBackOffset = -.6;
let leftSleeveBackRotation = 20;

// Left Sleeve Bounding Box
let leftSleeveBoundingBox = {
  topLeft: { x: 1136, y: 351 },
  bottomRight: { x: 1393, y: 711 },
};

// Left Sleeve Bounding Box (Back)
let leftSleeveBackBoundingBox = {
  topLeft: { x: 309, y: 365 },
  bottomRight: { x: 500, y: 718 },
};

// Right Sleeve
const isRightSleeve = false;

// Tag
const isTag = false;

// Image PPI
const imagePPI = 72;

// Utility to set up a mockup canvas (front or back)
function setupMockupCanvas(canvas) {
  const art = canvas.querySelector('image[id^="draggable-art-"]');
  // Don't cache constraintRect or its values; always read live
let isDragging = false;
let offset = { x: 0, y: 0 };

// Store original dimensions of the background image
let bgOriginalWidth = 0;
let bgOriginalHeight = 0;
  let bgRatio = 1;

  // Helper to size and position art after both bg and art images are loaded
  function sizeAndPositionArt(bgRatio, artImg) {
    const originalArtWidth = artImg.naturalWidth;
    const originalArtHeight = artImg.naturalHeight;
    // Calculate svgToPx ratio (SVG units to rendered pixels)
    const svgRect = canvas.getBoundingClientRect();
    let svgToPx = 1;
    if (canvas.viewBox && canvas.viewBox.baseVal) {
      svgToPx = svgRect.width / canvas.viewBox.baseVal.width;
    } else if (canvas.hasAttribute("width")) {
      svgToPx = svgRect.width / parseFloat(canvas.getAttribute("width"));
    }
    // Original scaling: scale art by bgRatio
    const scaledWidth = originalArtWidth / bgRatio;
    const scaledHeight = originalArtHeight / bgRatio;
    // Now, convert scaled SVG units to match rendered pixel size
    const artWidthSvgUnits = scaledWidth / svgToPx;
    const artHeightSvgUnits = scaledHeight / svgToPx;
    art.setAttribute("width", artWidthSvgUnits);
    art.setAttribute("height", artHeightSvgUnits);
    // Always get constraint rect live
    const constraintRect = canvas.querySelector('rect[id^="constraint-rect-"]');
    const rectX = parseFloat(constraintRect.getAttribute("x"));
    const rectY = parseFloat(constraintRect.getAttribute("y"));
    const rectWidth = parseFloat(constraintRect.getAttribute("width"));
    const rectHeight = parseFloat(constraintRect.getAttribute("height"));
    // Set initial position for front art image using frontBoc and frontOffset
    if (canvas.dataset.canvas === "front") {
      const artY = rectY + (frontBoc * imagePPI) / bgRatio;
      art.setAttribute("y", artY);
      const boxCenterX = rectX + rectWidth / 2;
      const artX =
        boxCenterX - artWidthSvgUnits / 2 + (frontOffset * imagePPI) / bgRatio;
      art.setAttribute("x", artX);
      // Update sidebar with art dimensions in inches
      const widthInches = (originalArtWidth / imagePPI).toFixed(2);
      const heightInches = (originalArtHeight / imagePPI).toFixed(2);
      const dimsElem = document.getElementById("var-frontArtDims");
      if (dimsElem)
        dimsElem.textContent = `${widthInches} in × ${heightInches} in`;
      // --- LOGGING: SVG artboard and bounding box pixel dimensions ---
      // Log SVG artboard rendered pixel dimensions
      const svgRect = canvas.getBoundingClientRect();
      // Log bounding box rendered pixel dimensions
      if (constraintRect) {
        // SVG units
        const bboxSvgWidth = rectWidth;
        const bboxSvgHeight = rectHeight;
        // Convert SVG units to rendered pixels
        // Get SVG viewBox and scale
        let svgToPx = 1;
        if (canvas.viewBox && canvas.viewBox.baseVal) {
          svgToPx = svgRect.width / canvas.viewBox.baseVal.width;
        } else if (canvas.hasAttribute("width")) {
          svgToPx = svgRect.width / parseFloat(canvas.getAttribute("width"));
        }
        const bboxPxWidth = bboxSvgWidth * svgToPx;
        const bboxPxHeight = bboxSvgHeight * svgToPx;
      }
      // --- END LOGGING ---
    }
    if (canvas.dataset.canvas === "back") {
      const artY = rectY + (backBoc * imagePPI) / bgRatio;
      art.setAttribute("y", artY);
      const boxCenterX = rectX + rectWidth / 2;
      const artX =
        boxCenterX - artWidthSvgUnits / 2 + (backOffset * imagePPI) / bgRatio;
      art.setAttribute("x", artX);
      // Update sidebar with art dimensions in inches
      const widthInches = (originalArtWidth / imagePPI).toFixed(2);
      const heightInches = (originalArtHeight / imagePPI).toFixed(2);
      const dimsElem = document.getElementById("var-backArtDims");
      if (dimsElem)
        dimsElem.textContent = `${widthInches} in × ${heightInches} in`;
    }
    // Add left sleeve art to the front mockup
    if (canvas.dataset.canvas === "front" && isLeftSleeve) {
      // Create or select the left sleeve art image element
      let leftSleeveArt = canvas.querySelector('image[id="draggable-art-leftsleeve"]');
      if (!leftSleeveArt) {
        leftSleeveArt = document.createElementNS("http://www.w3.org/2000/svg", "image");
        leftSleeveArt.setAttribute("id", "draggable-art-leftsleeve");
        leftSleeveArt.setAttribute("href", leftSleeveArtImage);
        leftSleeveArt.setAttribute("data-img-type", "leftsleeve-art");
        // Insert after the main art image for correct stacking
        const mainArt = canvas.querySelector('image[id^="draggable-art-"]');
        if (mainArt && mainArt.nextSibling) {
          canvas.insertBefore(leftSleeveArt, mainArt.nextSibling);
        } else {
          canvas.appendChild(leftSleeveArt);
        }
      }
      // Load the left sleeve art image to get its natural size
      const leftSleeveImg = new window.Image();
      leftSleeveImg.src = leftSleeveArtImage;
      leftSleeveImg.onload = function () {
        const originalArtWidth = leftSleeveImg.naturalWidth;
        const originalArtHeight = leftSleeveImg.naturalHeight;
        // Use front bgRatio for scaling
        const feMap = canvas.querySelector('feImage[data-img-type$="map"]');
        const bgImg = new window.Image();
        bgImg.src = feMap ? feMap.getAttribute("href") : "";
        bgImg.onload = function () {
          const bgOriginalWidth = bgImg.naturalWidth;
          const renderedWidth = svgRect.width;
          const bgRatio = bgOriginalWidth / renderedWidth;
          // Calculate svgToPx ratio (SVG units to rendered pixels)
          let svgToPx = 1;
          if (canvas.viewBox && canvas.viewBox.baseVal) {
            svgToPx = svgRect.width / canvas.viewBox.baseVal.width;
          } else if (canvas.hasAttribute("width")) {
            svgToPx = svgRect.width / parseFloat(canvas.getAttribute("width"));
          }
          // Scale and convert to SVG units
          const scaledWidth = originalArtWidth / bgRatio;
          const scaledHeight = originalArtHeight / bgRatio;
          const artWidthSvgUnits = scaledWidth / svgToPx;
          const artHeightSvgUnits = scaledHeight / svgToPx;
          leftSleeveArt.setAttribute("width", artWidthSvgUnits);
          leftSleeveArt.setAttribute("height", artHeightSvgUnits);
          // Place using leftSleeveFrontBoc, leftSleeveFrontOffset, leftSleeveFrontRotation
          const boc = leftSleeveFrontBoc;
          const offset = leftSleeveFrontOffset;
          const rotation = leftSleeveFrontRotation;
          // Use left sleeve bounding box for now
          const constraintRect = canvas.querySelector('#constraint-rect-leftsleeve');
          const rectX = parseFloat(constraintRect.getAttribute("x"));
          const rectY = parseFloat(constraintRect.getAttribute("y"));
          const rectWidth = parseFloat(constraintRect.getAttribute("width"));
          // Vertical position
          const artY = rectY + (boc * imagePPI) / bgRatio;
          leftSleeveArt.setAttribute("y", artY);
          // Horizontal position (centered, then offset)
          const boxCenterX = rectX + rectWidth / 2;
          const artX = boxCenterX - artWidthSvgUnits / 2 + (offset * imagePPI) / bgRatio;
          leftSleeveArt.setAttribute("x", artX);
          // Apply rotation around the center of the art
          const cx = artX + artWidthSvgUnits / 2;
          const cy = artY + artHeightSvgUnits / 2;
          leftSleeveArt.setAttribute("transform", `rotate(${rotation},${cx},${cy})`);
        };
      };
    }
    // Add left sleeve art to the back mockup
    if (canvas.dataset.canvas === "back" && isLeftSleeve) {
      // Create or select the left sleeve art image element
      let leftSleeveArt = canvas.querySelector('image[id="draggable-art-leftsleeve-back"]');
      if (!leftSleeveArt) {
        leftSleeveArt = document.createElementNS("http://www.w3.org/2000/svg", "image");
        leftSleeveArt.setAttribute("id", "draggable-art-leftsleeve-back");
        leftSleeveArt.setAttribute("href", leftSleeveArtImage);
        leftSleeveArt.setAttribute("data-img-type", "leftsleeve-art-back");
        // Insert after the main art image for correct stacking
        const mainArt = canvas.querySelector('image[id^="draggable-art-"]');
        if (mainArt && mainArt.nextSibling) {
          canvas.insertBefore(leftSleeveArt, mainArt.nextSibling);
        } else {
          canvas.appendChild(leftSleeveArt);
        }
      }
      // Load the left sleeve art image to get its natural size
      const leftSleeveImg = new window.Image();
      leftSleeveImg.src = leftSleeveArtImage;
      leftSleeveImg.onload = function () {
        const originalArtWidth = leftSleeveImg.naturalWidth;
        const originalArtHeight = leftSleeveImg.naturalHeight;
        // Use back bgRatio for scaling
        const feMap = canvas.querySelector('feImage[data-img-type$="map"]');
        const bgImg = new window.Image();
        bgImg.src = feMap ? feMap.getAttribute("href") : "";
        bgImg.onload = function () {
          const bgOriginalWidth = bgImg.naturalWidth;
          const renderedWidth = svgRect.width;
          const bgRatio = bgOriginalWidth / renderedWidth;
          // Calculate svgToPx ratio (SVG units to rendered pixels)
          let svgToPx = 1;
          if (canvas.viewBox && canvas.viewBox.baseVal) {
            svgToPx = svgRect.width / canvas.viewBox.baseVal.width;
          } else if (canvas.hasAttribute("width")) {
            svgToPx = svgRect.width / parseFloat(canvas.getAttribute("width"));
          }
          // Scale and convert to SVG units
          const scaledWidth = originalArtWidth / bgRatio;
          const scaledHeight = originalArtHeight / bgRatio;
          const artWidthSvgUnits = scaledWidth / svgToPx;
          const artHeightSvgUnits = scaledHeight / svgToPx;
          leftSleeveArt.setAttribute("width", artWidthSvgUnits);
          leftSleeveArt.setAttribute("height", artHeightSvgUnits);
          // Place using leftSleeveBackBoc, leftSleeveBackOffset, leftSleeveBackRotation
          const boc = leftSleeveBackBoc;
          const offset = leftSleeveBackOffset;
          const rotation = leftSleeveBackRotation;
          // Use left sleeve bounding box for now
          const constraintRect = canvas.querySelector('#constraint-rect-leftsleeve');
          const rectX = parseFloat(constraintRect.getAttribute("x"));
          const rectY = parseFloat(constraintRect.getAttribute("y"));
          const rectWidth = parseFloat(constraintRect.getAttribute("width"));
          // Vertical position
          const artY = rectY + (boc * imagePPI) / bgRatio;
          leftSleeveArt.setAttribute("y", artY);
          // Horizontal position (centered, then offset)
          const boxCenterX = rectX + rectWidth / 2;
          const artX = boxCenterX - artWidthSvgUnits / 2 + (offset * imagePPI) / bgRatio;
          leftSleeveArt.setAttribute("x", artX);
          // Apply rotation around the center of the art
          const cx = artX + artWidthSvgUnits / 2;
          const cy = artY + artHeightSvgUnits / 2;
          leftSleeveArt.setAttribute("transform", `rotate(${rotation},${cx},${cy})`);
        };
      };
      // Add drag event listeners for left sleeve art (back)
      let isDraggingLeftSleeveBack = false;
      let offsetLeftSleeveBack = { x: 0, y: 0 };
      leftSleeveArt.addEventListener("mousedown", (e) => {
        isDraggingLeftSleeveBack = true;
        const svg = leftSleeveArt.ownerSVGElement;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
        offsetLeftSleeveBack.x = cursorpt.x - parseFloat(leftSleeveArt.getAttribute("x"));
        offsetLeftSleeveBack.y = cursorpt.y - parseFloat(leftSleeveArt.getAttribute("y"));
        e.stopPropagation();
      });
      document.addEventListener("mousemove", (e) => {
        if (!isDraggingLeftSleeveBack) return;
        const svg = leftSleeveArt.ownerSVGElement;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
        let newX = cursorpt.x - offsetLeftSleeveBack.x;
        let newY = cursorpt.y - offsetLeftSleeveBack.y;
        leftSleeveArt.setAttribute("x", newX);
        leftSleeveArt.setAttribute("y", newY);
        // Update rotation center
        const artWidth = parseFloat(leftSleeveArt.getAttribute("width"));
        const artHeight = parseFloat(leftSleeveArt.getAttribute("height"));
        const cx = newX + artWidth / 2;
        const cy = newY + artHeight / 2;
        leftSleeveArt.setAttribute("transform", `rotate(${rotation},${cx},${cy})`);
      });
      document.addEventListener("mouseup", () => {
        isDraggingLeftSleeveBack = false;
      });
    }
    // --- Left Sleeve Drag State ---
    let isDraggingLeftSleeve = false;
    let offsetLeftSleeve = { x: 0, y: 0 };

    // Add drag event listeners for left sleeve art
    if (canvas.dataset.canvas === "front" && isLeftSleeve) {
      let leftSleeveArt = canvas.querySelector('image[id="draggable-art-leftsleeve"]');
      if (leftSleeveArt) {
        leftSleeveArt.addEventListener("mousedown", (e) => {
          isDraggingLeftSleeve = true;
          const svg = leftSleeveArt.ownerSVGElement;
          const pt = svg.createSVGPoint();
          pt.x = e.clientX;
          pt.y = e.clientY;
          const cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
          offsetLeftSleeve.x = cursorpt.x - parseFloat(leftSleeveArt.getAttribute("x"));
          offsetLeftSleeve.y = cursorpt.y - parseFloat(leftSleeveArt.getAttribute("y"));
          e.stopPropagation();
        });
        document.addEventListener("mousemove", (e) => {
          if (!isDraggingLeftSleeve) return;
          const svg = leftSleeveArt.ownerSVGElement;
          const pt = svg.createSVGPoint();
          pt.x = e.clientX;
          pt.y = e.clientY;
          const cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
          // Constrain to bounding box if needed (optional)
          let newX = cursorpt.x - offsetLeftSleeve.x;
          let newY = cursorpt.y - offsetLeftSleeve.y;
          leftSleeveArt.setAttribute("x", newX);
          leftSleeveArt.setAttribute("y", newY);
          // Update rotation center
          const artWidth = parseFloat(leftSleeveArt.getAttribute("width"));
          const artHeight = parseFloat(leftSleeveArt.getAttribute("height"));
          const cx = newX + artWidth / 2;
          const cy = newY + artHeight / 2;
          leftSleeveArt.setAttribute("transform", `rotate(${leftSleeveFrontRotation},${cx},${cy})`);
        });
        document.addEventListener("mouseup", () => {
          isDraggingLeftSleeve = false;
        });
      }
    }
    // --- Left Sleeve Controls (to be added in HTML) ---
    // Add listeners for left sleeve controls
    const bocInput = document.getElementById("var-leftSleeveBoc");
    const offsetInput = document.getElementById("var-leftSleeveOffset");
    const rotationInput = document.getElementById("var-leftSleeveRotation");
    if (bocInput) {
      bocInput.value = leftSleeveFrontBoc;
      bocInput.addEventListener("input", function () {
        leftSleeveFrontBoc = parseFloat(bocInput.value) || 0;
        // Re-render art
        document.querySelectorAll(".mockup-canvas").forEach(setupMockupCanvas);
      });
    }
    if (offsetInput) {
      offsetInput.value = leftSleeveFrontOffset;
      offsetInput.addEventListener("input", function () {
        leftSleeveFrontOffset = parseFloat(offsetInput.value) || 0;
        document.querySelectorAll(".mockup-canvas").forEach(setupMockupCanvas);
      });
    }
    if (rotationInput) {
      rotationInput.value = leftSleeveFrontRotation;
      rotationInput.addEventListener("input", function () {
        leftSleeveFrontRotation = parseFloat(rotationInput.value) || 0;
        document.querySelectorAll(".mockup-canvas").forEach(setupMockupCanvas);
      });
    }
  }

  // Load background image to get bgRatio
const bgImg = new window.Image();
  // Use the feImage for the map as the source
  const feMap = canvas.querySelector('feImage[data-img-type$="map"]');
  const bgHref = feMap ? feMap.getAttribute("href") : undefined;
  if (!bgHref) return;
  bgImg.src = bgHref;
  bgImg.onload = function () {
  bgOriginalWidth = bgImg.naturalWidth;
  bgOriginalHeight = bgImg.naturalHeight;
    const svgElement = canvas;
    const renderedWidth = svgElement.getBoundingClientRect().width;
    bgRatio = bgOriginalWidth / renderedWidth;
    const svgWidthInInches = (renderedWidth * bgRatio) / imagePPI;
    // Now load the art image and size/position after it loads
    const artImg = new window.Image();
    artImg.src = art.getAttribute("href");
    if (artImg.complete) {
      sizeAndPositionArt(bgRatio, artImg);
    } else {
      artImg.onload = function () {
        sizeAndPositionArt(bgRatio, artImg);
      };
    }
};

function updateInfoPanel() {
    // Always get constraint rect live
    const constraintRect = canvas.querySelector('rect[id^="constraint-rect-"]');
    const rectX = parseFloat(constraintRect.getAttribute("x"));
    const rectY = parseFloat(constraintRect.getAttribute("y"));
    const rectWidth = parseFloat(constraintRect.getAttribute("width"));
    const rectHeight = parseFloat(constraintRect.getAttribute("height"));
  const artBox = art.getBBox();
  const boxTop = rectY;
  const boxCenterX = rectX + rectWidth / 2;
    const artTop = parseFloat(art.getAttribute("y"));
    const artCenterX = parseFloat(art.getAttribute("x")) + artBox.width / 2;
  const verticalDistance = Math.round((artTop - boxTop) * bgRatio);
  const horizontalDistance = Math.round((artCenterX - boxCenterX) * bgRatio);
    // Only update the info panel if this is the front canvas
    if (canvas.dataset.canvas === "front") {
      // document.getElementById('vertical-distance-in').textContent = (verticalDistance / imagePPI).toFixed(2);
      // document.getElementById('horizontal-distance-in').textContent = (horizontalDistance / imagePPI).toFixed(2);
      // Update sidebar boc and offset for front (input values)
      const bocInches = ((artTop - boxTop) * bgRatio) / imagePPI;
      const offsetInches = ((artCenterX - boxCenterX) * bgRatio) / imagePPI;
      document.getElementById("var-frontBoc").value = bocInches.toFixed(2);
      document.getElementById("var-frontOffset").value =
        offsetInches.toFixed(2);
    }
    if (canvas.dataset.canvas === "back") {
      // Update sidebar boc and offset for back (input values)
      const bocInches = ((artTop - boxTop) * bgRatio) / imagePPI;
      const offsetInches = ((artCenterX - boxCenterX) * bgRatio) / imagePPI;
      document.getElementById("var-backBoc").value = bocInches.toFixed(2);
      document.getElementById("var-backOffset").value = offsetInches.toFixed(2);
    }
}

  art.addEventListener("mousedown", (e) => {
  isDragging = true;
    // Always get constraint rect live
    const constraintRect = canvas.querySelector('rect[id^="constraint-rect-"]');
    const rectX = parseFloat(constraintRect.getAttribute("x"));
    const rectY = parseFloat(constraintRect.getAttribute("y"));
  const svg = art.ownerSVGElement;
  const pt = svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  const cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
    offset.x = cursorpt.x - parseFloat(art.getAttribute("x"));
    offset.y = cursorpt.y - parseFloat(art.getAttribute("y"));
  updateInfoPanel();
});

  document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
    // Always get constraint rect live
    const constraintRect = canvas.querySelector('rect[id^="constraint-rect-"]');
    const rectX = parseFloat(constraintRect.getAttribute("x"));
    const rectY = parseFloat(constraintRect.getAttribute("y"));
    const rectWidth = parseFloat(constraintRect.getAttribute("width"));
    const rectHeight = parseFloat(constraintRect.getAttribute("height"));
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
    art.setAttribute("x", newX);
    art.setAttribute("y", newY);
  updateInfoPanel();
});

  document.addEventListener("mouseup", () => {
  isDragging = false;
  updateInfoPanel();
});

// Initial update
  window.addEventListener("DOMContentLoaded", updateInfoPanel);
}

// Fetch and set object URLs for front and back map images
function fetchAndSetMockupImages() {
  // Helper to fetch and set all elements with a given data-img-type
  function fetchAndSet(url, selector) {
    return fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const objURL = URL.createObjectURL(blob);
        document.querySelectorAll(selector).forEach((el) => {
          el.setAttribute("href", objURL);
        });
      });
  }
  // Fetch and set for front
  const frontPromise = fetchAndSet(
    frontMapImage,
    '[data-img-type="front-map"]'
  );
  // Fetch and set for back
  const backPromise = fetchAndSet(backMapImage, '[data-img-type="back-map"]');
  // Wait for both to finish
  return Promise.all([frontPromise, backPromise]);
}

// Function to update image URL and refresh canvases
function updateImage(imageType, newUrl) {
  if (!newUrl || newUrl.trim() === '') {
    alert('Please enter a valid URL');
    return;
  }

  const trimmedUrl = newUrl.trim();

  // Update the global variable
  switch (imageType) {
    case 'frontArt':
      frontArtImage = trimmedUrl;
      break;
    case 'backArt':
      backArtImage = trimmedUrl;
      break;
    case 'leftSleeveArt':
      leftSleeveArtImage = trimmedUrl;
      break;
    case 'frontMap':
      frontMapImage = trimmedUrl;
      break;
    case 'backMap':
      backMapImage = trimmedUrl;
      break;
    case 'frontOverlay':
      frontOverlayImage = trimmedUrl;
      break;
    case 'backOverlay':
      backOverlayImage = trimmedUrl;
      break;
    default:
      console.error('Unknown image type:', imageType);
      return;
  }

  // Update the image elements based on type
  if (imageType === 'leftSleeveArt') {
    // Update left sleeve art elements by their specific IDs
    const leftSleeveFront = document.getElementById('draggable-art-leftsleeve');
    const leftSleeveBack = document.getElementById('draggable-art-leftsleeve-back');
    
    if (leftSleeveFront) {
      leftSleeveFront.setAttribute("href", trimmedUrl);
    }
    if (leftSleeveBack) {
      leftSleeveBack.setAttribute("href", trimmedUrl);
    }
  } else if (imageType === 'frontArt' || imageType === 'backArt') {
    // Update main art elements by data-img-type
    const artType = imageType.replace('Art', '').toLowerCase();
    const artElements = document.querySelectorAll(`[data-img-type="${artType}-art"]`);
    artElements.forEach(element => {
      element.setAttribute("href", trimmedUrl);
    });
  } else if (imageType === 'frontMap' || imageType === 'backMap') {
    // Update map elements by data-img-type
    const mapType = imageType.replace('Map', '').toLowerCase();
    const mapElements = document.querySelectorAll(`[data-img-type="${mapType}-map"]`);
    mapElements.forEach(element => {
      element.setAttribute("href", trimmedUrl);
    });
  } else if (imageType === 'frontOverlay' || imageType === 'backOverlay') {
    // Update overlay elements by data-img-type
    const overlayType = imageType.replace('Overlay', '').toLowerCase();
    const overlayElements = document.querySelectorAll(`[data-img-type="${overlayType}-overlay"]`);
    overlayElements.forEach(element => {
      element.setAttribute("href", trimmedUrl);
    });
  }

  // Update the sidebar link
  const linkElement = document.getElementById(`var-${imageType}`);
  if (linkElement) {
    linkElement.href = trimmedUrl;
    linkElement.textContent = "link";
  }

  // Clear the input field
  const inputElement = document.getElementById(`var-${imageType}Input`);
  if (inputElement) {
    inputElement.value = '';
  }

  // Refresh all canvases after a short delay to ensure the new image is loaded
  setTimeout(() => {
    document.querySelectorAll(".mockup-canvas").forEach(setupMockupCanvas);
  }, 100);

  console.log(`Updated ${imageType} image to:`, trimmedUrl);
}

window.addEventListener("DOMContentLoaded", () => {
  // Fetch and set the mockup images, then set art images and set up canvases
  fetchAndSetMockupImages().then(() => {
    // Set art images (these can use direct URLs, no need for fetch)
    const frontArt = document.querySelector('[data-img-type="front-art"]');
    if (frontArt) frontArt.setAttribute("href", frontArtImage);
    const backArt = document.querySelector('[data-img-type="back-art"]');
    if (backArt) backArt.setAttribute("href", backArtImage);
    // Set up both canvases
    document.querySelectorAll(".mockup-canvas").forEach(setupMockupCanvas);

    // Update sidebar variable values
    const frontMapElem = document.getElementById("var-frontMapImage");
    if (frontMapElem) {
      frontMapElem.href = frontMapImage;
      frontMapElem.textContent = "link";
    }
    const frontOverlayElem = document.getElementById("var-frontOverlayImage");
    if (frontOverlayElem) {
      frontOverlayElem.href = frontOverlayImage;
      frontOverlayElem.textContent = "link";
    }
    const frontArtElem = document.getElementById("var-frontArtImage");
    if (frontArtElem) {
      frontArtElem.href = frontArtImage;
      frontArtElem.textContent = "link";
    }
    const backMapElem = document.getElementById("var-backMapImage");
    if (backMapElem) {
      backMapElem.href = backMapImage;
      backMapElem.textContent = "link";
    }
    const backOverlayElem = document.getElementById("var-backOverlayImage");
    if (backOverlayElem) {
      backOverlayElem.href = backOverlayImage;
      backOverlayElem.textContent = "link";
    }
    const backArtElem = document.getElementById("var-backArtImage");
    if (backArtElem) {
      backArtElem.href = backArtImage;
      backArtElem.textContent = "link";
    }
    const leftSleeveArtElem = document.getElementById("var-leftSleeveArtImage");
    if (leftSleeveArtElem) {
      leftSleeveArtElem.href = leftSleeveArtImage;
      leftSleeveArtElem.textContent = "link";
    }
    document.getElementById("var-frontBoc").textContent = frontBoc;
    document.getElementById("var-frontOffset").textContent = frontOffset;
    document.getElementById("var-backBoc").textContent = backBoc;
    document.getElementById("var-backOffset").textContent = backOffset;
    document.getElementById("var-imagePPI").textContent = imagePPI;

    // Set initial values for editable inputs
    document.getElementById("var-frontBoc").value = frontBoc;
    document.getElementById("var-frontOffset").value = frontOffset;
    document.getElementById("var-backBoc").value = backBoc;
    document.getElementById("var-backOffset").value = backOffset;

    // Add listeners to update art position when inputs change
    document
      .getElementById("var-frontBoc")
      .addEventListener("input", function () {
        updateArtPositionFromInputs("front");
      });
    document
      .getElementById("var-frontOffset")
      .addEventListener("input", function () {
        updateArtPositionFromInputs("front");
      });
    document
      .getElementById("var-backBoc")
      .addEventListener("input", function () {
        updateArtPositionFromInputs("back");
      });
    document
      .getElementById("var-backOffset")
      .addEventListener("input", function () {
        updateArtPositionFromInputs("back");
      });

    // Add listeners for art image URL updates
    const frontArtUpdateBtn = document.getElementById("var-frontArtImageUpdate");
    const backArtUpdateBtn = document.getElementById("var-backArtImageUpdate");
    const leftSleeveArtUpdateBtn = document.getElementById("var-leftSleeveArtImageUpdate");

    if (frontArtUpdateBtn) {
      frontArtUpdateBtn.addEventListener("click", function () {
        const newUrl = document.getElementById("var-frontArtImageInput").value;
        updateImage("frontArt", newUrl);
      });
    }

    if (backArtUpdateBtn) {
      backArtUpdateBtn.addEventListener("click", function () {
        const newUrl = document.getElementById("var-backArtImageInput").value;
        updateImage("backArt", newUrl);
      });
    }

    if (leftSleeveArtUpdateBtn) {
      leftSleeveArtUpdateBtn.addEventListener("click", function () {
        const newUrl = document.getElementById("var-leftSleeveArtImageInput").value;
        updateImage("leftSleeveArt", newUrl);
      });
    }

    // Add listeners for map image URL updates
    const frontMapUpdateBtn = document.getElementById("var-frontMapImageUpdate");
    const backMapUpdateBtn = document.getElementById("var-backMapImageUpdate");

    if (frontMapUpdateBtn) {
      frontMapUpdateBtn.addEventListener("click", function () {
        const newUrl = document.getElementById("var-frontMapImageInput").value;
        updateImage("frontMap", newUrl);
      });
    }

    if (backMapUpdateBtn) {
      backMapUpdateBtn.addEventListener("click", function () {
        const newUrl = document.getElementById("var-backMapImageInput").value;
        updateImage("backMap", newUrl);
      });
    }

    // Add listeners for overlay image URL updates
    const frontOverlayUpdateBtn = document.getElementById("var-frontOverlayImageUpdate");
    const backOverlayUpdateBtn = document.getElementById("var-backOverlayImageUpdate");

    if (frontOverlayUpdateBtn) {
      frontOverlayUpdateBtn.addEventListener("click", function () {
        const newUrl = document.getElementById("var-frontOverlayImageInput").value;
        updateImage("frontOverlay", newUrl);
      });
    }

    if (backOverlayUpdateBtn) {
      backOverlayUpdateBtn.addEventListener("click", function () {
        const newUrl = document.getElementById("var-backOverlayImageInput").value;
        updateImage("backOverlay", newUrl);
      });
    }

    // Add Enter key support for the input fields
    const frontArtInput = document.getElementById("var-frontArtImageInput");
    const backArtInput = document.getElementById("var-backArtImageInput");
    const leftSleeveArtInput = document.getElementById("var-leftSleeveArtImageInput");
    const frontMapInput = document.getElementById("var-frontMapImageInput");
    const backMapInput = document.getElementById("var-backMapImageInput");
    const frontOverlayInput = document.getElementById("var-frontOverlayImageInput");
    const backOverlayInput = document.getElementById("var-backOverlayImageInput");

    if (frontArtInput) {
      frontArtInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          updateImage("frontArt", this.value);
        }
      });
    }

    if (backArtInput) {
      backArtInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          updateImage("backArt", this.value);
        }
      });
    }

    if (leftSleeveArtInput) {
      leftSleeveArtInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          updateImage("leftSleeveArt", this.value);
        }
      });
    }

    if (frontMapInput) {
      frontMapInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          updateImage("frontMap", this.value);
        }
      });
    }

    if (backMapInput) {
      backMapInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          updateImage("backMap", this.value);
        }
      });
    }

    if (frontOverlayInput) {
      frontOverlayInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          updateImage("frontOverlay", this.value);
        }
      });
    }

    if (backOverlayInput) {
      backOverlayInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          updateImage("backOverlay", this.value);
        }
      });
    }

    // Set overlay images
    document
      .querySelectorAll('[data-img-type="front-overlay"]')
      .forEach((el) => {
        el.setAttribute("href", frontOverlayImage);
      });
    document
      .querySelectorAll('[data-img-type="back-overlay"]')
      .forEach((el) => {
        el.setAttribute("href", backOverlayImage);
      });

    // Set blank color backgrounds and filter flood-color on load
    const frontBg = document.getElementById("front-blank-bg");
    const backBg = document.getElementById("back-blank-bg");
    if (frontBg) frontBg.setAttribute("fill", blankColor);
    if (backBg) backBg.setAttribute("fill", blankColor);
    document
      .querySelectorAll(
        "filter#conform-front feFlood, filter#conform-back feFlood"
      )
      .forEach((flood) => {
        flood.setAttribute("flood-color", blankColor);
      });

    // Set color picker and hex display to blankColor on load
    const blankColorInput = document.getElementById("var-blankColor");
    const blankColorHex = document.getElementById("var-blankColorHex");
    if (blankColorInput) {
      blankColorInput.value = blankColor;
      blankColorInput.addEventListener("input", function () {
        blankColor = blankColorInput.value;
        if (frontBg) frontBg.setAttribute("fill", blankColor);
        if (backBg) backBg.setAttribute("fill", blankColor);
        document
          .querySelectorAll(
            "filter#conform-front feFlood, filter#conform-back feFlood"
          )
          .forEach((flood) => {
            flood.setAttribute("flood-color", blankColor);
          });
        if (blankColorHex) blankColorHex.textContent = blankColor;
      });
    }
    if (blankColorHex) {
      blankColorHex.textContent = blankColor;
    }

    // Helper to update bounding box rect from inputs (for front or back)
    function setupBoundingBoxInputs(
      prefix,
      boundingBoxVar,
      rectId,
      canvasSelector
    ) {
      const x1Input = document.getElementById(`var-${prefix}BoundingBox-x1`);
      const y1Input = document.getElementById(`var-${prefix}BoundingBox-y1`);
      const x2Input = document.getElementById(`var-${prefix}BoundingBox-x2`);
      const y2Input = document.getElementById(`var-${prefix}BoundingBox-y2`);
      if (x1Input && y1Input && x2Input && y2Input) {
        x1Input.value = boundingBoxVar.topLeft.x;
        y1Input.value = boundingBoxVar.topLeft.y;
        x2Input.value = boundingBoxVar.bottomRight.x;
        y2Input.value = boundingBoxVar.bottomRight.y;
        function updateBoundingBoxFromInputs() {
          boundingBoxVar.topLeft.x = parseInt(x1Input.value, 10) || 0;
          boundingBoxVar.topLeft.y = parseInt(y1Input.value, 10) || 0;
          boundingBoxVar.bottomRight.x = parseInt(x2Input.value, 10) || 0;
          boundingBoxVar.bottomRight.y = parseInt(y2Input.value, 10) || 0;
          const rect = document.getElementById(rectId);
          const canvas = document.querySelector(canvasSelector);
          // Calculate bgRatio for this canvas
          let bgRatio = 1;
          if (canvas) {
            const feMap = canvas.querySelector('feImage[data-img-type$="map"]');
            const bgHref = feMap ? feMap.getAttribute("href") : undefined;
            if (bgHref) {
              const bgImg = new window.Image();
              bgImg.src = bgHref;
              bgImg.onload = function () {
                const bgOriginalWidth = bgImg.naturalWidth;
                const svgElement = canvas;
                const renderedWidth = svgElement.getBoundingClientRect().width;
                bgRatio = bgOriginalWidth / renderedWidth;
                const svgWidthInInches = (renderedWidth * bgRatio) / imagePPI;
                // Apply values divided by bgRatio
                const x = boundingBoxVar.topLeft.x / bgRatio;
                const y = boundingBoxVar.topLeft.y / bgRatio;
                const width =
                  (boundingBoxVar.bottomRight.x - boundingBoxVar.topLeft.x) /
                  bgRatio;
                const height =
                  (boundingBoxVar.bottomRight.y - boundingBoxVar.topLeft.y) /
                  bgRatio;
                if (rect) {
                  rect.setAttribute("x", x);
                  rect.setAttribute("y", y);
                  rect.setAttribute("width", width);
                  rect.setAttribute("height", height);
                }
                // Update sidebar with live bounding box dimensions
                const dimsElem = document.getElementById(
                  `var-${prefix}BoundingBoxDims`
                );
                if (dimsElem) {
                  // Calculate rendered pixel width and height
                  let svgToPx = 1;
                  const svgRect = canvas.getBoundingClientRect();
                  if (canvas.viewBox && canvas.viewBox.baseVal) {
                    svgToPx = svgRect.width / canvas.viewBox.baseVal.width;
                  } else if (canvas.hasAttribute("width")) {
                    svgToPx = svgRect.width / parseFloat(canvas.getAttribute("width"));
                  }
                  const bboxPxWidth = width * svgToPx;
                  const bboxPxHeight = height * svgToPx;
                  // Calculate inches from rendered pixels, bgRatio, and imagePPI
                  // renderedPixels * bgRatio = original image pixels, then / imagePPI = inches
                  const widthInches = ((bboxPxWidth * bgRatio) / imagePPI).toFixed(2);
                  const heightInches = ((bboxPxHeight * bgRatio) / imagePPI).toFixed(2);
                  dimsElem.textContent = `w: ${Math.round(bboxPxWidth)}px × h: ${Math.round(bboxPxHeight)}px (${widthInches} in × ${heightInches} in)`;
                }
              };
            }
          }
        }
        x1Input.addEventListener("input", updateBoundingBoxFromInputs);
        y1Input.addEventListener("input", updateBoundingBoxFromInputs);
        x2Input.addEventListener("input", updateBoundingBoxFromInputs);
        y2Input.addEventListener("input", updateBoundingBoxFromInputs);
        // Initial update
        updateBoundingBoxFromInputs();
      }
    }

    // Set up for front
    setupBoundingBoxInputs(
      "front",
      frontBoundingBox,
      "constraint-rect-front",
      '.mockup-canvas[data-canvas="front"]'
    );
    // Set up for back
    setupBoundingBoxInputs(
      "back",
      backBoundingBox,
      "constraint-rect-back",
      '.mockup-canvas[data-canvas="back"]'
    );

    // --- Left Sleeve Bounding Box Controls ---
    const x1Input = document.getElementById("var-leftSleeveBoundingBox-x1");
    const y1Input = document.getElementById("var-leftSleeveBoundingBox-y1");
    const x2Input = document.getElementById("var-leftSleeveBoundingBox-x2");
    const y2Input = document.getElementById("var-leftSleeveBoundingBox-y2");
    if (x1Input && y1Input && x2Input && y2Input) {
      x1Input.value = leftSleeveBoundingBox.topLeft.x;
      y1Input.value = leftSleeveBoundingBox.topLeft.y;
      x2Input.value = leftSleeveBoundingBox.bottomRight.x;
      y2Input.value = leftSleeveBoundingBox.bottomRight.y;
      function updateLeftSleeveBoundingBoxFromInputs() {
        leftSleeveBoundingBox.topLeft.x = parseInt(x1Input.value, 10) || 0;
        leftSleeveBoundingBox.topLeft.y = parseInt(y1Input.value, 10) || 0;
        leftSleeveBoundingBox.bottomRight.x = parseInt(x2Input.value, 10) || 0;
        leftSleeveBoundingBox.bottomRight.y = parseInt(y2Input.value, 10) || 0;
        // Update the SVG rect for left sleeve bounding box if present
        const rect = document.getElementById("constraint-rect-leftsleeve");
        const canvas = document.querySelector('.mockup-canvas[data-canvas="front"]');
        // Calculate bgRatio for this canvas
        let bgRatio = 1;
        if (canvas) {
          const feMap = canvas.querySelector('feImage[data-img-type$="map"]');
          const bgHref = feMap ? feMap.getAttribute("href") : undefined;
          if (bgHref) {
            const bgImg = new window.Image();
            bgImg.src = bgHref;
            bgImg.onload = function () {
              const bgOriginalWidth = bgImg.naturalWidth;
              const svgElement = canvas;
              const renderedWidth = svgElement.getBoundingClientRect().width;
              bgRatio = bgOriginalWidth / renderedWidth;
              // Apply values divided by bgRatio
              const x = leftSleeveBoundingBox.topLeft.x / bgRatio;
              const y = leftSleeveBoundingBox.topLeft.y / bgRatio;
              const width = (leftSleeveBoundingBox.bottomRight.x - leftSleeveBoundingBox.topLeft.x) / bgRatio;
              const height = (leftSleeveBoundingBox.bottomRight.y - leftSleeveBoundingBox.topLeft.y) / bgRatio;
              if (rect) {
                rect.setAttribute("x", x);
                rect.setAttribute("y", y);
                rect.setAttribute("width", width);
                rect.setAttribute("height", height);
              }
              // Re-render art
              document.querySelectorAll(".mockup-canvas").forEach(setupMockupCanvas);
            };
          }
        }
      }
      x1Input.addEventListener("input", updateLeftSleeveBoundingBoxFromInputs);
      y1Input.addEventListener("input", updateLeftSleeveBoundingBoxFromInputs);
      x2Input.addEventListener("input", updateLeftSleeveBoundingBoxFromInputs);
      y2Input.addEventListener("input", updateLeftSleeveBoundingBoxFromInputs);
      // Initial update
      updateLeftSleeveBoundingBoxFromInputs();
    }
    // --- Back Left Sleeve Bounding Box Controls ---
    const bx1Input = document.getElementById("var-leftSleeveBackBoundingBox-x1");
    const by1Input = document.getElementById("var-leftSleeveBackBoundingBox-y1");
    const bx2Input = document.getElementById("var-leftSleeveBackBoundingBox-x2");
    const by2Input = document.getElementById("var-leftSleeveBackBoundingBox-y2");
    if (bx1Input && by1Input && bx2Input && by2Input) {
      bx1Input.value = leftSleeveBackBoundingBox.topLeft.x;
      by1Input.value = leftSleeveBackBoundingBox.topLeft.y;
      bx2Input.value = leftSleeveBackBoundingBox.bottomRight.x;
      by2Input.value = leftSleeveBackBoundingBox.bottomRight.y;
      function updateLeftSleeveBackBoundingBoxFromInputs() {
        leftSleeveBackBoundingBox.topLeft.x = parseInt(bx1Input.value, 10) || 0;
        leftSleeveBackBoundingBox.topLeft.y = parseInt(by1Input.value, 10) || 0;
        leftSleeveBackBoundingBox.bottomRight.x = parseInt(bx2Input.value, 10) || 0;
        leftSleeveBackBoundingBox.bottomRight.y = parseInt(by2Input.value, 10) || 0;
        // Update the SVG rect for back left sleeve bounding box if present
        const rect = document.querySelector('.mockup-canvas[data-canvas="back"] #constraint-rect-leftsleeve');
        const canvas = document.querySelector('.mockup-canvas[data-canvas="back"]');
        // Calculate bgRatio for this canvas
        let bgRatio = 1;
        if (canvas) {
          const feMap = canvas.querySelector('feImage[data-img-type$="map"]');
          const bgHref = feMap ? feMap.getAttribute("href") : undefined;
          if (bgHref) {
            const bgImg = new window.Image();
            bgImg.src = bgHref;
            bgImg.onload = function () {
              const bgOriginalWidth = bgImg.naturalWidth;
              const svgElement = canvas;
              const renderedWidth = svgElement.getBoundingClientRect().width;
              bgRatio = bgOriginalWidth / renderedWidth;
              // Apply values divided by bgRatio
              const x = leftSleeveBackBoundingBox.topLeft.x / bgRatio;
              const y = leftSleeveBackBoundingBox.topLeft.y / bgRatio;
              const width = (leftSleeveBackBoundingBox.bottomRight.x - leftSleeveBackBoundingBox.topLeft.x) / bgRatio;
              const height = (leftSleeveBackBoundingBox.bottomRight.y - leftSleeveBackBoundingBox.topLeft.y) / bgRatio;
              if (rect) {
                rect.setAttribute("x", x);
                rect.setAttribute("y", y);
                rect.setAttribute("width", width);
                rect.setAttribute("height", height);
              }
              // Re-render art
              const backCanvas = document.querySelector('.mockup-canvas[data-canvas="back"]');
              if (backCanvas) setupMockupCanvas(backCanvas);
            };
          }
        }
      }
      bx1Input.addEventListener("input", updateLeftSleeveBackBoundingBoxFromInputs);
      by1Input.addEventListener("input", updateLeftSleeveBackBoundingBoxFromInputs);
      bx2Input.addEventListener("input", updateLeftSleeveBackBoundingBoxFromInputs);
      by2Input.addEventListener("input", updateLeftSleeveBackBoundingBoxFromInputs);
      // Initial update
      updateLeftSleeveBackBoundingBoxFromInputs();
    }
    // --- Left Sleeve Controls (to be added in HTML) ---
    // Add listeners for left sleeve controls
    const bocInput = document.getElementById("var-leftSleeveBoc");
    const offsetInput = document.getElementById("var-leftSleeveOffset");
    const rotationInput = document.getElementById("var-leftSleeveRotation");
    if (bocInput) {
      bocInput.value = leftSleeveFrontBoc;
      bocInput.addEventListener("input", function () {
        leftSleeveFrontBoc = parseFloat(bocInput.value) || 0;
        // Re-render art
        document.querySelectorAll(".mockup-canvas").forEach(setupMockupCanvas);
      });
    }
    if (offsetInput) {
      offsetInput.value = leftSleeveFrontOffset;
      offsetInput.addEventListener("input", function () {
        leftSleeveFrontOffset = parseFloat(offsetInput.value) || 0;
        document.querySelectorAll(".mockup-canvas").forEach(setupMockupCanvas);
      });
    }
    if (rotationInput) {
      rotationInput.value = leftSleeveFrontRotation;
      rotationInput.addEventListener("input", function () {
        leftSleeveFrontRotation = parseFloat(rotationInput.value) || 0;
        document.querySelectorAll(".mockup-canvas").forEach(setupMockupCanvas);
      });
    }
    // --- Back Left Sleeve Controls ---
    const backBocInput = document.getElementById("var-leftSleeveBackBoc");
    const backOffsetInput = document.getElementById("var-leftSleeveBackOffset");
    const backRotationInput = document.getElementById("var-leftSleeveBackRotation");
    if (backBocInput) {
      backBocInput.value = leftSleeveBackBoc;
      backBocInput.addEventListener("input", function () {
        leftSleeveBackBoc = parseFloat(backBocInput.value) || 0;
        // Only re-render the back canvas
        const backCanvas = document.querySelector('.mockup-canvas[data-canvas="back"]');
        if (backCanvas) setupMockupCanvas(backCanvas);
      });
    }
    if (backOffsetInput) {
      backOffsetInput.value = leftSleeveBackOffset;
      backOffsetInput.addEventListener("input", function () {
        leftSleeveBackOffset = parseFloat(backOffsetInput.value) || 0;
        const backCanvas = document.querySelector('.mockup-canvas[data-canvas="back"]');
        if (backCanvas) setupMockupCanvas(backCanvas);
      });
    }
    if (backRotationInput) {
      backRotationInput.value = leftSleeveBackRotation;
      backRotationInput.addEventListener("input", function () {
        leftSleeveBackRotation = parseFloat(backRotationInput.value) || 0;
        const backCanvas = document.querySelector('.mockup-canvas[data-canvas="back"]');
        if (backCanvas) setupMockupCanvas(backCanvas);
      });
    }
  });
});

function updateArtPositionFromInputs(which) {
  // which: 'front' or 'back'
  const canvas = document.querySelector(
    `.mockup-canvas[data-canvas="${which}"]`
  );
  const art = canvas.querySelector('image[id^="draggable-art-"]');
  const constraintRect = canvas.querySelector('rect[id^="constraint-rect-"]');
  const rectX = parseFloat(constraintRect.getAttribute("x"));
  const rectY = parseFloat(constraintRect.getAttribute("y"));
  const rectWidth = parseFloat(constraintRect.getAttribute("width"));
  // Get bgRatio
  const bgImg = new window.Image();
  const bgHref = canvas.querySelector("image:not([id])").getAttribute("href");
  bgImg.src = bgHref;
  bgImg.onload = function () {
    const bgOriginalWidth = bgImg.naturalWidth;
    const svgElement = canvas;
    const renderedWidth = svgElement.getBoundingClientRect().width;
    const bgRatio = bgOriginalWidth / renderedWidth;
    const svgWidthInInches = (renderedWidth * bgRatio) / imagePPI;
    // Get art width
    const artWidth = parseFloat(art.getAttribute("width"));
    // Get values from inputs
    const boc =
      parseFloat(document.getElementById(`var-${which}Boc`).value) || 0;
    const offset =
      parseFloat(document.getElementById(`var-${which}Offset`).value) || 0;
    // Calculate new positions
    const artY = rectY + (boc * imagePPI) / bgRatio;
    const boxCenterX = rectX + rectWidth / 2;
    const artX = boxCenterX - artWidth / 2 + (offset * imagePPI) / bgRatio;
    art.setAttribute("y", artY);
    art.setAttribute("x", artX);
    // Optionally, update the info panel
    // (re-run updateInfoPanel if needed)
    if (typeof updateInfoPanel === "function") updateInfoPanel();
  };
}
