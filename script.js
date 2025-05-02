document.getElementById('generateMeme').addEventListener('click', generateMeme);
document.getElementById('downloadMeme').addEventListener('click', downloadMeme);

const CANVAS_WIDTH = 300; // Set your desired canvas width
const CANVAS_HEIGHT = 300; // Set your desired canvas height

function generateMeme() {
  const topText = document.getElementById('topText').value.toUpperCase();
  const bottomText = document.getElementById('bottomText').value.toUpperCase();
  const imageUpload = document.getElementById('imageUpload');
  const canvas = document.getElementById('memeCanvas');
  const ctx = canvas.getContext('2d');

  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      // Set canvas dimensions
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate the scaling factor to fit the image within the canvas
      let scale = Math.min(
        CANVAS_WIDTH / img.width,
        CANVAS_HEIGHT / img.height
      );
      let x = CANVAS_WIDTH / 2 - (img.width / 2) * scale;
      let y = CANVAS_HEIGHT / 2 - (img.height / 2) * scale;

      // Draw the image on the canvas with the calculated scale
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      ctx.font = '40px Impact';
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 3;
      ctx.textAlign = 'center';

      // Draw the top text
      ctx.fillText(topText, canvas.width / 2, 50);
      ctx.strokeText(topText, canvas.width / 2, 50);

      // Draw the bottom text
      ctx.fillText(bottomText, canvas.width / 2, canvas.height - 20);
      ctx.strokeText(bottomText, canvas.width / 2, canvas.height - 20);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(imageUpload.files[0]);
}

function downloadMeme() {
  const canvas = document.getElementById('memeCanvas');
  const link = document.createElement('a');
  link.download = 'meme.png';
  link.href = canvas.toDataURL();
  link.click();
}
