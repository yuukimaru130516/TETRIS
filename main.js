'use strict';

/*--------------------------------------------
　定数
-------------------------------------------*/

// キャンバスの要素を取得する
const can = document.getElementById('main');
const con = can.getContext('2d');

const BLOCK_SIZE = 30;
// テトリミノのサイズ
const TETORI_SIZE = 4;
// フィールドサイズ
const FIELD_COL = 10;
const FIELD_ROW = 20;
// スクリーンサイズ
const SCREEN_W = FIELD_COL * BLOCK_SIZE;
const SCREEN_H = FIELD_ROW * BLOCK_SIZE;

const GAME_SPEED = 300;

const START_X = FIELD_COL/2 - TETORI_SIZE/2;
const START_Y = 0;

const FONT = "40px 'MS ゴシック'";

// 音声ファイル
const lineDelete = new Audio("music/lineDelete.mp3");
const slide = new Audio("music/slide.mp3");


// canvas 回り
can.width  = SCREEN_W;
can.height = SCREEN_H;  
can.style.border = '4px solid black';

// テトリミノの座標
let tetri_x = START_X;
let tetri_y = START_Y;

// ゲームオーバーフラグ
let over = false;

// 消したライン数
let linec = 0;
let score = 0;


const TETORI_TYPES = [
  [],
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
  ],
  [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
  ],
  [
    [0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0]
  ],
  [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
  ],
  [
    [0, 0, 0, 0],
    [1, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
  ],
  [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0]
  ]
]

const TETRO_COLORS = [
  "",
  "#6CF",
  "#F92",
  "#66F",
  "#C5C",
  "#FD2",
  "#F44",
  "#5B5"

];

// テトリミノ本体
let tetro;
let tetro_t;

tetro_t = Math.floor(Math.random() * (TETORI_TYPES.length - 1) ) + 1;
tetro = TETORI_TYPES[tetro_t];

// フィールド本体
let field = [];
// フィールドの初期化(二次元配列の初期化)
for(let y=0; y<FIELD_ROW; y++){
  field[y] = [];
  for(let x=0; x<FIELD_COL; x++){
    field[y][x] = 0;
  }
}

// 描画関数
function drawAll()
{
  // キャンバスをクリアする
  con.clearRect(0, 0, SCREEN_W, SCREEN_H);
  for(let y=0; y<FIELD_ROW; y++){
    for(let x=0; x<FIELD_COL; x++){
      if( field[y][x] )
      {
        drawBlock(x,y,field[y][x]);
      }
    }
  }
  for(let y=0; y<TETORI_SIZE; y++){
    for(let x=0; x<TETORI_SIZE; x++){
      if( tetro[y][x] )
      {
        drawBlock(tetri_x + x, tetri_y + y,tetro_t);  
      }
    }
  }

  if(over){
    var s = "GAME OVER";
    con.font = FONT;
    let w = con.measureText(s).width;
    let x = SCREEN_W/2 - w/2;
    let y = SCREEN_H/2 - 20;
    con.lineWidhth = 4;
    con.strokeText(s,x,y);
    con.fillStyle = 'white';
    con.fillText =(s,x,y);
  }
}

// ブロックを描画する関数
function drawBlock(x,y,c)
{
  let px = x * BLOCK_SIZE; 
  let py = y * BLOCK_SIZE;
  con.fillStyle = TETRO_COLORS[c];
  con.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
  con.strokeStyle = 'Black';
  con.strokeRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
}

// ブロックの衝突判定
function checkMove(mx, my, ntetro)
{
  if(ntetro == undefined) ntetro = tetro;
  for(let y=0; y<TETORI_SIZE; y++){
    for(let x=0; x<TETORI_SIZE; x++){
      if( tetro[y][x] )
        {
          let nx = tetri_x + mx + x;
          let ny = tetri_y + my + y;
          if( ny<0 || nx<0 || ny>= FIELD_ROW || nx>=FIELD_COL || field[ny][nx] ){
            return false;
          }
        }
    }
  }
  return true;
}

// ブロックの回転
function rotate()
{
  let ntetro = [];
  for(let y=0; y<TETORI_SIZE; y++){
    ntetro[y] = [];
    for(let x=0; x<TETORI_SIZE; x++){
      ntetro[y][x] = tetro[TETORI_SIZE-1-x][y];
    }
  }
  return ntetro;
}

// ブロックの落下処理
function dropTetro()
{
  if(checkMove(0, 1)) {
    tetri_y ++;
  }else{
    fixTetro();
    checkLine();
    tetro_t = Math.floor(Math.random() * (TETORI_TYPES.length - 1) ) + 1;
    tetro = TETORI_TYPES[tetro_t];
    tetri_x = START_X;
    tetri_y = START_Y;
    if(!checkMove(0,0)){
      over = true;
    }
  }
  drawAll();
}

// ブロックの固定
function fixTetro()
{
  for(let y=0; y<TETORI_SIZE; y++){
    for(let x=0; x<TETORI_SIZE; x++){
      if(tetro[y][x]){
        field[tetri_y + y][tetri_x + x] = tetro_t;
      }
    }
  }
}


// ラインが揃ったかチェックして消す
function checkLine()
{

  for (let y=0; y<FIELD_ROW; y++){
    let flag = true;
    for(let x=0; x<FIELD_COL; x++){
      if( !field[y][x] ){
        flag = false;
        break;
      }
    }
  if(flag){
    linec++;
    score = linec * 100;
    for(let ny=y; ny>0; ny--){
      for(let nx=0; nx<FIELD_COL; nx++){
        field[ny][nx] = field[ny-1][nx];
        lineDelete.play();
      }
    }
  }
}
}
drawAll();
setInterval(dropTetro, GAME_SPEED);

// キーボードイベント処理
document.onkeydown = function(e)
{
  if(over){
    return;
  }
  switch(e.keyCode)
  {
    case 37:
      if( checkMove(-1, 0) ){
        tetri_x--;
      }
      break;
    case 39:
      if(checkMove(1, 0)){
        tetri_x++;
      }
      break;
    case 40:
      while(checkMove(0, 1)){
        slide.pause();
        slide.play();
        tetri_y++;
      }
      break;
    case 32:
      let ntetro = rotate();
      if(checkMove(0, 0, ntetro)) 
      tetro = ntetro;
      break;
  }
  drawAll();
}


