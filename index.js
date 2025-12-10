// 進度條與倒數計時動畫邏輯（真實秒數同步版）

var delay = 60000; // 初始時間（毫秒）
var endTime = null; // 結束時刻（毫秒時間戳）
var timerInterval = null;

// 音效
var audioRemind = null;
var audioEnd = null;
function newAudio(file){
  var node = new Audio();
  node.src = file;
  node.loop = false;
  node.load();
  document.body.appendChild(node);
  return node;
}

// 預設顏色和結構
function updateTimer() {
  var now = Date.now();
  var remaining = Math.max(0, endTime - now);
  var percent = remaining / delay;

  // 數字倒數
  $('#timer').text(Math.ceil(remaining / 1000));

  // 進度條長度與顏色切換
  var $bar = $('#timer-bar');
  var color;
  if (percent > 0.5) color = '#4caf50';
  else if (percent > 0.2) color = '#ffeb3b';
  else if (percent > 0.1) color = '#ff9800';
  else color = '#f44336';
  $bar.css('width', (percent * 100) + '%').css('background', color);

  // 爆炸 emoji 及隱藏進度條底色
  if (remaining <= 0) {
    $('#explosion').show();
    $('#timer-bar-bg').hide();
    clearInterval(timerInterval);
    timerInterval = null;
    if (audioEnd) audioEnd.play();
  } else {
    $('#explosion').hide();
    $('#timer-bar-bg').show();
    // 20秒以下提醒音
    if (remaining <= 20000 && audioRemind && !audioRemind.isPlaying) {
      audioRemind.play();
      audioRemind.isPlaying = true;
    }
    if (remaining > 20000 && audioRemind) {
      audioRemind.pause();
      audioRemind.currentTime = 0;
      audioRemind.isPlaying = false;
    }
  }
}

// 倒數開始
function startTimer() {
  clearInterval(timerInterval);
  endTime = Date.now() + delay;
  updateTimer();
  timerInterval = setInterval(updateTimer, 100);
}

// 按鈕功能
function adjust(it, v){
  if (timerInterval) clearInterval(timerInterval);
  if (typeof v !== 'undefined') {
    delay = v * 1000;
  } else {
    delay = delay + it * 1000;
    if (delay <= 0) delay = 0;
  }
  $('#timer').text(Math.ceil(delay / 1000));
  $('#timer-bar').css('width', '100%');
  $('#timer-bar-bg').show();
  $('#explosion').hide();
}
function reset() {
  if (timerInterval) clearInterval(timerInterval);
  delay = 60000;
  $('#timer').text(Math.ceil(delay / 1000));
  $('#timer-bar').css('width', '100%');
  $('#timer-bar-bg').show();
  $('#explosion').hide();
}

function toggle() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    $('#toggle').text("RUN");
    $('#timer-bar-bg').show();
    $('#explosion').hide();
    if (audioRemind) {
      audioRemind.pause();
      audioRemind.currentTime = 0;
      audioRemind.isPlaying = false;
    }
  } else {
    $('#toggle').text("STOP");
    startTimer();
  }
}

function show(){
  $('.fbtn').css('opacity', ($('.fbtn').css('opacity') === '1') ? '0.1' : '1.0');
}

// 首次載入
window.onload = function(){
  audioRemind = newAudio('audio/smb_warning.mp3');
  audioEnd = newAudio('audio/smb_mariodie.mp3');
  $('#timer').text(Math.ceil(delay / 1000));
  $('#timer-bar').css('width', '100%');
  $('#explosion').hide();
};

window.onresize = function(){
  // 版型自適應，已用 flex 置中，不再需要字型 JS resize
};
