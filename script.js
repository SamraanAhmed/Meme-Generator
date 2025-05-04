document.getElementById('generateMeme').addEventListener('click', generateMeme);
document.getElementById('downloadMeme').addEventListener('click', downloadMeme);
document
  .getElementById('increaseTopTextSize')
  .addEventListener('click', () => adjustTextSize('top', 5));
document
  .getElementById('decreaseTopTextSize')
  .addEventListener('click', () => adjustTextSize('top', -5));
document
  .getElementById('increaseBottomTextSize')
  .addEventListener('click', () => adjustTextSize('bottom', 5));
document
  .getElementById('decreaseBottomTextSize')
  .addEventListener('click', () => adjustTextSize('bottom', -5));
document
  .getElementById('increaseImageScale')
  .addEventListener('click', () => adjustImageScale(0.1));
document
  .getElementById('decreaseImageScale')
  .addEventListener('click', () => adjustImageScale(-0.1));
document
  .getElementById('topTextUp')
  .addEventListener('click', () => adjustTextPosition('top', 0, -10));
document
  .getElementById('topTextDown')
  .addEventListener('click', () => adjustTextPosition('top', 0, 10));
document
  .getElementById('topTextLeft')
  .addEventListener('click', () => adjustTextPosition('top', -10, 0));
document
  .getElementById('topTextRight')
  .addEventListener('click', () => adjustTextPosition('top', 10, 0));
document
  .getElementById('bottomTextUp')
  .addEventListener('click', () => adjustTextPosition('bottom', 0, -10));
document
  .getElementById('bottomTextDown')
  .addEventListener('click', () => adjustTextPosition('bottom', 0, 10));
document
  .getElementById('bottomTextLeft')
  .addEventListener('click', () => adjustTextPosition('bottom', -10, 0));
document
  .getElementById('bottomTextRight')
  .addEventListener('click', () => adjustTextPosition('bottom', 10, 0));

// Default canvas dimensions
let CANVAS_WIDTH = 300;
let CANVAS_HEIGHT = 300;

// Text position and size variables
let topTextPos = { x: 150, y: 50 };
let bottomTextPos = { x: 150, y: 250 }; // Adjusted initial y to ensure visibility
let topTextSize = 40;
let bottomTextSize = 40;
let imageScale = 1.0; // Image scaling factor
let draggingText = null;

function generateMeme() {
  const topText = document.getElementById('topText').value.toUpperCase() || '';
  const bottomText =
    document.getElementById('bottomText').value.toUpperCase() || '';
  const inputTopTextSize = parseInt(
    document.getElementById('topTextSize').value
  );
  const inputBottomTextSize = parseInt(
    document.getElementById('bottomTextSize').value
  );
  const imageUpload = document.getElementById('imageUpload');
  const canvasSize = parseInt(document.getElementById('canvasSize').value);
  const canvas = document.getElementById('memeCanvas');
  const ctx = canvas.getContext('2d');

  // Update canvas dimensions only if size changed
  if (CANVAS_WIDTH !== canvasSize) {
    CANVAS_WIDTH = canvasSize;
    CANVAS_HEIGHT = canvasSize;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Adjust text positions proportionally for new canvas size
    const scale = canvasSize / (CANVAS_WIDTH || 300); // Avoid division by zero
    topTextPos.x = Math.max(0, Math.min(CANVAS_WIDTH, topTextPos.x * scale));
    topTextPos.y = Math.max(
      0,
      Math.min(CANVAS_HEIGHT - topTextSize - 20, topTextPos.y * scale)
    );
    bottomTextPos.x = Math.max(
      0,
      Math.min(CANVAS_WIDTH, bottomTextPos.x * scale)
    );
    bottomTextPos.y = Math.max(
      bottomTextSize + 10,
      Math.min(CANVAS_HEIGHT - 20, bottomTextPos.y * scale)
    );
  } else {
    // Ensure text positions are within bounds on initial render
    topTextPos.y = Math.max(
      0,
      Math.min(CANVAS_HEIGHT - topTextSize - 20, topTextPos.y)
    );
    bottomTextPos.y = Math.max(
      bottomTextSize + 10,
      Math.min(CANVAS_HEIGHT - 20, bottomTextPos.y)
    );
  }

  // Sync input fields with current sizes
  topTextSize = inputTopTextSize;
  bottomTextSize = inputBottomTextSize;
  document.getElementById('topTextSize').value = topTextSize;
  document.getElementById('bottomTextSize').value = bottomTextSize;
  document.getElementById(
    'imageScaleDisplay'
  ).textContent = `${imageScale.toFixed(1)}x`;

  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate the base scaling factor to fit the image within the canvas
      let baseScale = Math.min(
        CANVAS_WIDTH / img.width,
        CANVAS_HEIGHT / img.height
      );
      let scaledWidth = img.width * baseScale * imageScale;
      let scaledHeight = img.height * baseScale * imageScale;
      let x = CANVAS_WIDTH / 2 - scaledWidth / 2;
      let y = CANVAS_HEIGHT / 2 - scaledHeight / 2;

      // Draw the image
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

      // Draw top text if it exists
      if (topText) {
        ctx.font = `${topTextSize}px Impact`;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.textAlign = 'center';
        ctx.fillText(topText, topTextPos.x, topTextPos.y);
        ctx.strokeText(topText, topTextPos.x, topTextPos.y);
      }

      // Draw bottom text if it exists
      if (bottomText) {
        ctx.font = `${bottomTextSize}px Impact`;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.textAlign = 'center';
        ctx.fillText(bottomText, bottomTextPos.x, bottomTextPos.y);
        ctx.strokeText(bottomText, bottomTextPos.x, bottomTextPos.y);
      }
    };
    img.src = event.target.result;
  };
  if (imageUpload.files[0]) {
    reader.readAsDataURL(imageUpload.files[0]);
  } else {
    // Draw text on a blank canvas if no image is uploaded
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (topText) {
      ctx.font = `${topTextSize}px Impact`;
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 3;
      ctx.textAlign = 'center';
      ctx.fillText(topText, topTextPos.x, topTextPos.y);
      ctx.strokeText(topText, topTextPos.x, topTextPos.y);
    }

    if (bottomText) {
      ctx.font = `${bottomTextSize}px Impact`;
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 3;
      ctx.textAlign = 'center';
      ctx.fillText(bottomText, bottomTextPos.x, bottomTextPos.y);
      ctx.strokeText(bottomText, bottomTextPos.x, bottomTextPos.y);
    }
  }
}

function adjustTextSize(text, delta) {
  if (text === 'top') {
    topTextSize = Math.max(10, Math.min(100, topTextSize + delta));
    document.getElementById('topTextSize').value = topTextSize;
  } else if (text === 'bottom') {
    bottomTextSize = Math.max(10, Math.min(100, bottomTextSize + delta));
    document.getElementById('bottomTextSize').value = bottomTextSize;
  }
  generateMeme();
}

function adjustImageScale(delta) {
  imageScale = Math.max(0.5, Math.min(2.0, imageScale + delta));
  document.getElementById(
    'imageScaleDisplay'
  ).textContent = `${imageScale.toFixed(1)}x`;
  generateMeme();
}

function adjustTextPosition(text, dx, dy) {
  if (text === 'top') {
    topTextPos.x = Math.max(0, Math.min(CANVAS_WIDTH, topTextPos.x + dx));
    topTextPos.y = Math.max(
      0,
      Math.min(CANVAS_HEIGHT - topTextSize - 20, topTextPos.y + dy)
    );
  } else if (text === 'bottom') {
    bottomTextPos.x = Math.max(0, Math.min(CANVAS_WIDTH, bottomTextPos.x + dx));
    bottomTextPos.y = Math.max(
      bottomTextSize + 10,
      Math.min(CANVAS_HEIGHT - 20, bottomTextPos.y + dy)
    );
  }
  generateMeme();
}

// Drag-and-drop text positioning
const canvas = document.getElementById('memeCanvas');
canvas.addEventListener('mousedown', startDragging);
canvas.addEventListener('mousemove', drag);
canvas.addEventListener('mouseup', stopDragging);
canvas.addEventListener('mouseleave', stopDragging);

function startDragging(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Check if click is near top text
  if (Math.abs(x - topTextPos.x) < 50 && Math.abs(y - topTextPos.y) < 20) {
    draggingText = 'top';
  }
  // Check if click is near bottom text
  else if (
    Math.abs(x - bottomTextPos.x) < 50 &&
    Math.abs(y - bottomTextPos.y) < 20
  ) {
    draggingText = 'bottom';
  }
}

function drag(e) {
  if (draggingText) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (draggingText === 'top') {
      topTextPos.x = Math.max(0, Math.min(CANVAS_WIDTH, x));
      topTextPos.y = Math.max(0, Math.min(CANVAS_HEIGHT - topTextSize - 20, y));
    } else if (draggingText === 'bottom') {
      bottomTextPos.x = Math.max(0, Math.min(CANVAS_WIDTH, x));
      bottomTextPos.y = Math.max(
        bottomTextSize + 10,
        Math.min(CANVAS_HEIGHT - 20, y)
      );
    }
    generateMeme(); // Redraw canvas
  }
}

function stopDragging() {
  draggingText = null;
}

function downloadMeme() {
  const canvas = document.getElementById('memeCanvas');
  const link = document.createElement('a');
  link.download = 'meme.png';
  link.href = canvas.toDataURL();
  link.click();
}
