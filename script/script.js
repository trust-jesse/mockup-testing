// Variables from SalesForce

// Mockup Images
const frontMapImage =
  "https://tds-website.s3.us-east-2.amazonaws.com/client-websites/realthread/mockup-testing/5026/front-72.jpg";
const backMapImage =
  "https://tds-website.s3.us-east-2.amazonaws.com/client-websites/realthread/mockup-testing/5026/back-72.jpg";
const frontOverlayImage =
  "https://tds-website.s3.us-east-2.amazonaws.com/client-websites/realthread/mockup-testing/5026/front-72.png";
const backOverlayImage =
  "https://tds-website.s3.us-east-2.amazonaws.com/client-websites/realthread/mockup-testing/5026/back-72.png";
let blankColor = "#2e146b";

// Placements

// Front Art
const isFront = true;
const frontArtImage =
  "https://tds-website.s3.us-east-2.amazonaws.com/client-websites/realthread/mockup-testing/art/front-72.png";
let frontBoc = 2;
let frontOffset = 2;

// Front Bounding Box
let frontBoundingBox = {
  topLeft: { x: 516, y: 272 },
  bottomRight: { x: 1122, y: 1300 },
};
// let frontBoundingBox = {
//   topLeft: { x: 680, y: 400 },
//   bottomRight: { x: 1400, y: 1500 }
// };

// Back
const isBack = false;
const backArtImage =
  "https://tds-website.s3.us-east-2.amazonaws.com/client-websites/realthread/mockup-testing/art/back-new.png";
let backBoc = 2;
let backOffset = 0;

// Back Bounding Box
let backBoundingBox = {
  topLeft: { x: 533, y: 218 },
  bottomRight: { x: 1111, y: 1300 },
};
// let backBoundingBox = {
//   topLeft: { x: 125, y: 70 },
//   bottomRight: { x: 275, y: 270 }
// };

// Left Sleeve
const isLeftSleeve = false;

// Right Sleeve
const isRightSleeve = false;

// Tag
const isTag = false;

// Image PPI
const imagePPI = 72;

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
    // Diagnostic logging for art and background sizes
    if (canvas.dataset.canvas === "front" || canvas.dataset.canvas === "back") {
      // Background image
      const bgImgElem = canvas.querySelector('feImage[data-img-type$="map"]');
      const bgNaturalWidth = bgImg.naturalWidth;
      const bgNaturalHeight = bgImg.naturalHeight;
      // Art image
      const artNaturalWidth = artImg.naturalWidth;
      const artNaturalHeight = artImg.naturalHeight;
      // Rendered SVG/canvas
      const svgRect = canvas.getBoundingClientRect();
      // Rendered art image
      const artRenderedWidth = scaledWidth;
      const artRenderedHeight = scaledHeight;
      console.log(`[DIAG][${canvas.dataset.canvas}] BG image natural: ${bgNaturalWidth}x${bgNaturalHeight}px, Art image natural: ${artNaturalWidth}x${artNaturalHeight}px`);
      console.log(`[DIAG][${canvas.dataset.canvas}] SVG rendered: ${svgRect.width}x${svgRect.height}px, Art rendered: ${artRenderedWidth}x${artRenderedHeight}px`);
      // Log ratio between raw and rendered pixels
      const bgWidthRatio = bgNaturalWidth / svgRect.width;
      const bgHeightRatio = bgNaturalHeight / svgRect.height;
      const artWidthRatio = artNaturalWidth / artRenderedWidth;
      const artHeightRatio = artNaturalHeight / artRenderedHeight;
      console.log(`[DIAG][${canvas.dataset.canvas}] BG width ratio (raw/rendered): ${bgWidthRatio.toFixed(3)}, height ratio: ${bgHeightRatio.toFixed(3)}`);
      console.log(`[DIAG][${canvas.dataset.canvas}] Art width ratio (raw/rendered): ${artWidthRatio.toFixed(3)}, height ratio: ${artHeightRatio.toFixed(3)}`);
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
