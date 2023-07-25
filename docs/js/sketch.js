let segmentation_results;
let mosaicSize = 15;
let mosaicSizeSlider;
let video;
let pg;
let gotSegmentation;
let downloadButton; // ダウンロードボタンを格納する変数


function setup() {
 




  pixelDensity(1);
  let p5canvas = createCanvas(375, 375);
  p5canvas.parent('#canvas');

  video = createCapture(VIDEO);
  video.hide();

  pg = createGraphics(375, 375);
  pg.noStroke();

  /* スライダーの作成
  mosaicSizeSlider = createSlider(20, 30, 20); // 初期値20、範囲20から30まで(動作の軽量化)
  mosaicSizeSlider.position(100, 550); // スライダーの位置を設定
  mosaicSizeSlider.style('width', '180px'); // スライダーの幅を設定*/

  // ダウンロードボタンの作成
  downloadButton = createButton('Download');
  downloadButton.parent('#DLbutton');
  

  downloadButton.mousePressed(downloadSnapshot); // ボタンが押されたときの動作を設定
  downloadButton.style('border', 'none'); // ボタンの枠線を削除
  downloadButton.style('outline', 'none'); // ボタンのアウトラインを削除
  downloadButton.style('color', 'transparent'); // ボタンの角を丸くする
  downloadButton.style('text-shadow', '0 0 0 transparent'); // テキストのシャドウを削除
  downloadButton.style('background-color', 'transparent'); // 背景色を削除
 

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
  image(video, 0, 0, video.width, video.height); // Draw the video
  image(pg, 0, 0, pg.width, pg.height); // Draw the mosaic on top of the video
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