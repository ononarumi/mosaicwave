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

  // カメラからのピクセルデータをロード
  video.loadPixels();

  let drawWidthRatio = drawWidth / video.width;
  let drawHeightRatio = drawHeight / video.height;

  let adjustedMosaicSize = mosaicSize * Math.max(drawWidthRatio, drawHeightRatio);

  for (let y = 0; y < drawHeight; y += adjustedMosaicSize) {
    for (let x = 0; x < drawWidth; x += adjustedMosaicSize) {

      // モザイクの左上のピクセルの色を取得
      let index = (Math.floor(x / drawWidthRatio) + Math.floor(y / drawHeightRatio) * video.width) * 4;
      let r = video.pixels[index];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];

      // モザイクを作成するために、オリジナルの色情報を使用
      for (let j = 0; j < adjustedMosaicSize; j++) {
        for (let i = 0; i < adjustedMosaicSize; i++) {
          let mosaicIndex = ((Math.floor((x + i) / drawWidthRatio)) + Math.floor((y + j) / drawHeightRatio) * video.width) * 4;
          if (results[mosaicIndex / 4] == 0) { // selfie
            pg.fill(r, g, b);
            pg.rect(x, y, adjustedMosaicSize, adjustedMosaicSize);
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

// drawWidth and drawHeight are defined in the global scope
let drawWidth, drawHeight;

function draw() {
  background(245); //背景をライトグレーに設定
  if (video.loadedmetadata && video.width > 0 && video.height > 0) {
    //ビデオの幅と高さが0より大きい場合

    video.loadPixels();
  
    let videoRatio;
    let canvasRatio = width / height;

    // Check if device is in portrait mode
    if (window.orientation === 90 || window.orientation === -90) {
      videoRatio = video.height / video.width; // This is flipped compared to landscape mode
    } else {
      videoRatio = video.width / video.height;
    }

    //描画するサイズを計算
    if (canvasRatio > videoRatio) {
      // Canvas is taller than video, fit width
      drawWidth = width;
      drawHeight = width * videoRatio;
    } else {
      // Canvas is wider than video, fit height
      drawHeight = height;
      drawWidth = height / videoRatio;
    }

    if (pg.width !== drawWidth || pg.height !== drawHeight) {
      // pgの幅と高さがdrawWidthとdrawHeightと異なる場合
      pg = createGraphics(drawWidth, drawHeight);
      pg.noStroke();
    }

    // 描画する位置を計算
    let startX = (width - drawWidth) / 2;
    let startY = (height - drawHeight) / 2;

    image(video, startX, startY, drawWidth, drawHeight); //イメージを描画
    image(pg, startX, startY, drawWidth, drawHeight); 

    // デバック出力
    console.log(`video.width: ${video.width}, video.height: ${video.height}`);
    console.log(`drawWidth: ${drawWidth}, drawHeight: ${drawHeight}`);
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

  let webcamRatio = element_webcam.clientHeight / element_webcam.clientWidth;
  let newHeight, newWidth;

  if (window.orientation === 90 || window.orientation === -90) {
    // In portrait mode, width should be smaller
    newHeight = Math.min(element_webcam.clientHeight, element_webcam.clientWidth * webcamRatio);
    newWidth = newHeight / webcamRatio;
  } else {
    // In landscape mode, width should be larger
    newWidth = Math.min(element_webcam.clientWidth, element_webcam.clientHeight * webcamRatio);
    newHeight = newWidth * webcamRatio;
  }

  resizeCanvas(newWidth, newHeight);//webcamのサイズに合わせる
}

