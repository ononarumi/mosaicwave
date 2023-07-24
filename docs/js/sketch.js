let segmentation_results;
let mosaicSize = 15;
let mosaicSizeSlider;
let video;
let pg;
let gotSegmentation;
let downloadButton; // ダウンロードボタンを格納する変数


function setup() {
 



  pixelDensity(1);
  let p5canvas = createCanvas(400, 400);
  p5canvas.parent('#canvas');

  video = createCapture(VIDEO, function() {
    // Create pg in the video's loadedmetadata event
    pg = createGraphics(video.width, video.height);
    pg.noStroke();
  });
  video.hide();

  pg = createGraphics(video.width, video.height);
pg.noStroke();

  /* スライダーの作成
  mosaicSizeSlider = createSlider(20, 30, 20); // 初期値20、範囲20から30まで(動作の軽量化)
  mosaicSizeSlider.position(100, 550); // スライダーの位置を設定
  mosaicSizeSlider.style('width', '180px'); // スライダーの幅を設定*/

  // ダウンロードボタンの作成
  downloadButton = createButton('Download');
  downloadButton.position(145, 650); // ボタンの位置を設定
  downloadButton.mousePressed(downloadSnapshot); // ボタンが押されたときの動作を設定

  // ボタンにスタイルを適用
downloadButton.style('background-color', 'transparent');
downloadButton.style('color', 'transparent');
downloadButton.style('border', 'none');
downloadButton.style('padding-right', '20px');
downloadButton.style('padding-bottom', '15px');
downloadButton.style('display', 'inline-block');
downloadButton.style('cursor', 'pointer');
downloadButton.style('transition-duration', '0.4s');
downloadButton.style('background-image', 'url(./images/capturebutton.png)');
downloadButton.style('background-size', 'cover');


gotSegmentation = function (results) {
  pg.clear();

  // Calculate the video's drawing size
  let videoRatio = video.width / video.height;
  let canvasRatio = width / height;
  let drawWidth, drawHeight;
  if (videoRatio > canvasRatio) {
    drawHeight = height;
    drawWidth = height * videoRatio;
  } else {
    drawWidth = width;
    drawHeight = width / videoRatio;
  }

  // Calculate the scale factor between the video's original size and its drawing size
  let scaleX = drawWidth / video.width;
  let scaleY = drawHeight / video.height;

  // Load the video's pixel data
  video.loadPixels();

  for (let y = 0; y < video.height; y += mosaicSize) {
    for (let x = 0; x < video.width; x += mosaicSize) {

      // Get the color of the top-left pixel of the mosaic
      let index = (x + y * video.width) * 4;
      let r = video.pixels[index];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];

      // Create a mosaic using the original color information
      for (let j = 0; j < mosaicSize; j++) {
        for (let i = 0; i < mosaicSize; i++) {
          let mosaicIndex = ((x + i) + (y + j) * video.width) * 4;
          if (results[mosaicIndex / 4] == 0) { // selfie
            pg.fill(r, g, b);
            // Scale the coordinates and size of the mosaic rectangle
            pg.rect(x * scaleX, y * scaleY, mosaicSize * scaleX, mosaicSize * scaleY);
          } else { // background
            // Do nothing
          }
        }
      }
    }
  }
}


adjustCanvas();
}

function draw() {
  background(0); // Fill background with black color

  if (video.loadedmetadata && video.width > 0 && video.height > 0) {
    // Only proceed if video is loaded and has a valid size

    if (pg.width !== video.width || pg.height !== video.height) {
      // Resize pg if its size doesn't match the video's size
      pg = createGraphics(video.width, video.height);
      pg.noStroke();
    }

    video.loadPixels();
  
    // Calculate the video's drawing size
    let videoRatio = video.width / video.height;
    let canvasRatio = width / height;
    let drawWidth, drawHeight;
    if (videoRatio > canvasRatio) {
      drawHeight = height;
      drawWidth = height * videoRatio;
    } else {
      drawWidth = width;
      drawHeight = width / videoRatio;
    }

    // Calculate upper-left corner position to center the video
    let startX = (width - drawWidth) / 2;
    let startY = (height - drawHeight) / 2;

    image(video, startX, startY, drawWidth, drawHeight); // Draw the video fit to canvas while maintaining aspect ratio
    image(pg, startX, startY, drawWidth, drawHeight); // Draw the mosaic fit to canvas while maintaining aspect ratio
  }
}
// スナップショットをダウンロードする関数
function downloadSnapshot() {
  saveCanvas('mosaic', 'png');
}


function windowResized() {
  adjustCanvas();//canvasのサイズを調整
}


function adjustCanvas() {

  var element_webcam = document.getElementById('webcam');//webcamのidを取得
  resizeCanvas(element_webcam.clientWidth, element_webcam.clientHeight);//webcamのサイズに合わせる
}