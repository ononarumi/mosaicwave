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

  for (let y = 0; y < video.height; y += mosaicSize) {
    for (let x = 0; x < video.width; x += mosaicSize) {

      // モザイクの左上のピクセルの色を取得
      let index = (x + y * video.width) * 4;
      let r = video.pixels[index];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];

      // モザイクを作成するために、オリジナルの色情報を使用
      for (let j = 0; j < mosaicSize; j++) {
        for (let i = 0; i < mosaicSize; i++) {
          let mosaicIndex = ((x + i) + (y + j) * video.width) * 4;
          if (results[mosaicIndex / 4] == 0) { // selfie
            pg.fill(r, g, b);
            pg.rect(x, y, mosaicSize, mosaicSize);
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
  background(245); //背景をライトグレーに設定
  if (video.loadedmetadata && video.width > 0 && video.height > 0) {
    //ビデオの幅と高さが0より大きい場合

    if (pg.width !== video.width || pg.height !== video.height) {
      // pgの幅と高さがvideoの幅と高さと異なる場合
      pg = createGraphics(video.width, video.height);
      pg.noStroke();
    }

    video.loadPixels();
  
    let videoRatio = video.width / video.height;
    let canvasRatio = width / height;
  
    let drawWidth, drawHeight;

    //描画するサイズを計算
    if (canvasRatio > videoRatio) {
      // Canvas is wider than video, fit height
      drawHeight = height;
      drawWidth = height * videoRatio;
    } else {
      // Canvas is taller than video, fit width
      drawWidth = width;
      drawHeight = width / videoRatio;
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

   var element_webcam = document.getElementById('webcam'); // webcamのidを取得
  // webcamのサイズに合わせる
  let aspectRatio = element_webcam.videoWidth / element_webcam.videoHeight;
  resizeCanvas(element_webcam.clientHeight * aspectRatio, element_webcam.clientHeight);
}

