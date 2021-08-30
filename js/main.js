$(function(){

 //1. グローバル関数
 let canvas_mouse_event = false; //スイッチ [ true=線を引く, false=線は引かない ]  ＊＊＊
 let oldX = 0; //１つ前の座標を代入するための変数
 let oldY = 0; //１つ前の座標を代入するための変数
 let bold_line =10; //ラインの太さをここで指定
 
const color = document.getElementById("color"); //ラインの色をここで指定
const can = document.getElementById("drawarea"); //CanvasElement
const ctx = can.getContext("2d"); //描画するための準備！ 

//編集枚数カウント
let  pages = 1;

//TouchEvent用
let ongoingTouches = [];

//Worksエリア Canvas用

//2.イベント

// ページ読み込み時の対応
window.onload = function(){
    //ローカルストレージを全部削除
    localStorage.clear();
}

// 3. MainCnavasエリア マウス操作

/// A. mouse Action ///
//mousedown
    $(can).on("mousedown", function(e){
        console.log(`mousedown`);
        oldY = e.offsetY;
        oldX = e.offsetX;
        canvas_mouse_event=true;
    });


//mousemove：フラグがTrueだったら描く ※e：イベント引数取得
$(can).on("mousemove", function(e){
    // console.log(e.offsetX);
    if(canvas_mouse_event==true){
        const px = e.offsetX;
        const py = e.offsetY;
        ctx.strokeStyle = color.value;
        ctx.lineWidth = bold_line;
        ctx.beginPath();
        ctx.lineJoin= "round";
        ctx.lineCap = "round";
        ctx.moveTo(oldX, oldY);
        ctx.lineTo(px, py);
        ctx.stroke();
        oldX = px;
        oldY = py;
    }
});


//mouseout:マウスがCanvasを離れたらイベントをFalse
$(can).on("mouseout",function(){
    canvas_mouse_event = false;
});


//mouseup：フラグをfalse
$(can).on("mouseup",function(){
    canvas_mouse_event = false;
});



/// B. Touch Action ///
//touchstart iPad用
can.addEventListener("touchstart",handleStart, false);
    // preventDefault(e);
    // console.log(`touchstart`);
    // const rect = event.target.getBoundingClientRect();
    // oldX = (event.touches[0].clientX - window.pageXOffset - rect.left);
    // oldY = (event.touches[0].clientY - window.pageYOffset - rect.top);
    // // oldY = e.offsetY;
    // // oldX = e.offsetX;
    // canvas_mouse_event=true;

//touchend：フラグをfalse
can.addEventListener("touchend", handleEnd, false);
// $(can).on("touchend",function(e){
//     preventDefault(e);
//     canvas_mouse_event = false;
// });

//touchmove：フラグがTrueだったら描く ※e：イベント引数取得
can.addEventListener("touchmove", handleMove, false);
// $(can).on("touchmove", function(e){
//     preventDefault(e);
//     // console.log(e.offsetX);
//     if(canvas_mouse_event==true){
//         const px = e.offsetX;
//         const py = e.offsetY;
//         ctx.strokeStyle = color.value;
//         ctx.lineWidth = bold_line;
//         ctx.beginPath();
//         ctx.lineJoin= "round";
//         ctx.lineCap = "round";
//         ctx.moveTo(oldX, oldY);
//         ctx.lineTo(px, py);
//         ctx.stroke();
//         oldX = px;
//         oldY = py;
//     }
// });
// Touch Cancel
can.addEventListener("touchcancel", handleCancel, false);

  
    //あをクリックしたら
    
    // $("#a").click(function (e) { 
    //     const image = new Image();
    //     const path= "img/1.png";
    //     image.addEventListener("load",function(){
    //         ctx.drawImage(image, 0, 0);
    //     })
    //     image.src = path; 
    //     console.log(`click`);
        
    // });

//4. 編集メニュー
//消しゴムボタン
    $("#erasor").click(function () { 
        color.value = "#ffffff";
        bold_line = 10;
    });
//えんぴつボタン
 $("#pencil").click(function () { 
     bold_line = 10;     
 });

 //ブラシボタン
 $("#brush").click(function () { 
     bold_line = 25;
 });


 //5.Navigation  エリア
    // 消すボタン
    $("#clearbtn").click(function (e) { 
        clearCanvas();
    });
    
    //保存ボタンをクリックした時のAction
    $("#savebtn").click(function (e) { 
        // // worksエリアに書き込む
        // drawInWorks();
        // //LocalStorageに保存
        const base64 = can.toDataURL();
        window.localStorage.setItem("savekey" + pages, base64);
        //Localデータを表示
        getWorksImage();
        //pageインクリメント
        if (pages < 4){
            pages++;
        } else {
            pages = 1;
        }
        //currentのクラスを移動させる
        updateCurrentClass();
        updatePageNum();
        //画面を初期化する
        clearCanvas();
    });
    
    // //よびだすボタン
    // $("#openbtn").click(function (e) { 
    //     //ローカルStorage読み込む
    //     const localData = window.localStorage.getItem("savekey1");
    //     const image = document.createElement('img');
    //     image.src = localData;
    //     document.getElementById("works5").appendChild(image);
        
    //     });
        
// かみしばいボタン
    $("#finishbtn").click(function (e) { 
        window.open('slideshow.html')         
    });
            
            

// 6. worksエリアの編集
$("#works1").click(function () { 
    editWorks(1);
});
$("#works2").click(function () { 
    editWorks(2);
});
$("#works3").click(function () { 
    editWorks(3);
});
$("#works4").click(function () { 
    editWorks(4);
});


// 関数
// worksエリアに書き込む
function drawInWorks(){
    // ページのworksエリアを取得する
    const currentp = "works" + pages;
    const works = document.getElementById(currentp); //CanvasElement
    const worksctx = works.getContext("2d"); //描画するための準備！ 
    //該当ページに画像を描く
    worksctx.drawImage(can,0,0);    
}

//Worksエリアの編集
function editWorks(page){
    const currentp = "worksimg" + page;
    const works = document.getElementById(currentp); //CanvasElement
    //メインエリアで編集できるようにする
    ctx.drawImage(works,0,0);
    //ページ数を上書き保存する
    pages = page;    
    updatePageNum();
    updateCurrentClass();
}

//Worksエリアに表示する
function getWorksImage() {
    const currentp = `worksimg${pages}`;
    //ローカルStorage読み込む
    const localData = window.localStorage.getItem("savekey" + pages);
    const image = document.getElementById(currentp);
    const src = localData;
    image.setAttribute('src',src);
    // const image = document.createElement('img');
    // image.src = localData;
    // document.getElementById("works"+pages).appendChild(image);       
    //ローカルストレージの画像に差し替える
    }

//currentクラスの付け替えをする
function updateCurrentClass(){
  $('li').removeClass("current");
  const currentl = document.getElementById(`works${pages}`);
  currentl.classList.add('current');
 }

//何枚目を編集しているか表示する 
function updatePageNum(){
    const pagenum = document.getElementById("editpagenum");
    pagenum.innerText = `${pages}まいめ`;
}

//画面を初期化する
function clearCanvas(){
    ctx.beginPath();
    ctx.clearRect(0, 0, can.width, can.height);  
}

//TouchEventの関数

function handleStart(evt) {
    evt.preventDefault();
    console.log("touchstart.");
    canvas_mouse_event=true;
    oldX = evt.clientX - c.getBoundingClientRect().left;
    oldY = evt.clientY - c.getBoundingClientRect().top;
    console.log(`oldX, oldY:${oldX},${oldY}`);
    // let touches = evt.changedTouches;
  
    // for (let i = 0; i < touches.length; i++) {
    //   console.log("touchstart:" + i + "...");
    //   ongoingTouches.push(copyTouch(touches[i]));
    //   let color = colorForTouch(touches[i]);
    //   ctx.beginPath();
    //   ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false);  // a circle at the start
    //   ctx.fillStyle = color;
    //   ctx.fill();
    //   console.log("touchstart:" + i + ".");

    // }
  }
  
  function handleMove(evt) {
    evt.preventDefault();
    let touches = evt.changedTouches;
    
    if(canvas_mouse_event == true){
        const px = evt.clientX - c.getBoundingClientRect().left;
        const py = evt.clientY - c.getBoundingClientRect().top;
        console.log(px,py);
        ctx.strokeStyle = color.value;
        ctx.lineWidth = bold_line;
        ctx.beginPath();
        ctx.lineJoin= "round";
        ctx.lineCap = "round";
        ctx.moveTo(oldX, oldY);
        ctx.lineTo(px, py);
        ctx.stroke();
        oldX = px;
        oldY = py;


        // for (let i = 0; i < touches.length; i++) {
        // let color = colorForTouch(touches[i]);
        // let idx = ongoingTouchIndexById(touches[i].identifier);
    
        // if (idx >= 0) {
        //     console.log("continuing touch "+idx);
        //     ctx.beginPath();
        //     console.log("ctx.moveTo(" + ongoingTouches[idx].pageX + ", " + ongoingTouches[idx].pageY + ");");
        //     ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
        //     console.log("ctx.lineTo(" + touches[i].pageX + ", " + touches[i].pageY + ");");
        //     ctx.lineTo(touches[i].pageX, touches[i].pageY);
        //     ctx.lineWidth = 4;
        //     ctx.strokeStyle = color;
        //     ctx.stroke();
    
        //     ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
        //     console.log(".");
        // } else {
        //     console.log("can't figure out which touch to continue");
        // }
        // }
  }
}
  
  function handleEnd(evt) {
    evt.preventDefault();
    console.log("touchend");
    let touches = evt.changedTouches;
  
    for (let i = 0; i < touches.length; i++) {
      let color = colorForTouch(touches[i]);
      let idx = ongoingTouchIndexById(touches[i].identifier);
  
      if (idx >= 0) {
        ctx.lineWidth = 4;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
        ctx.lineTo(touches[i].pageX, touches[i].pageY);
        ctx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8);  // and a square at the end
        ongoingTouches.splice(idx, 1);  // remove it; we're done
      } else {
        console.log("can't figure out which touch to end");
      }
    }
  }
  
  function handleCancel(evt) {
    evt.preventDefault();
    console.log("touchcancel.");
    let touches = evt.changedTouches;
  
    for (var i = 0; i < touches.length; i++) {
      let idx = ongoingTouchIndexById(touches[i].identifier);
      ongoingTouches.splice(idx, 1);  // remove it; we're done
    }
  }
  
  
  // Prevent scrolling when touching the canvas
document.body.addEventListener("touchstart", function (e) {
    if (e.target == can) {
      e.preventDefault();
    }
  }, false);
  document.body.addEventListener("touchend", function (e) {
    if (e.target == can) {
      e.preventDefault();
    }
  }, false);
  document.body.addEventListener("touchmove", function (e) {
    if (e.target == can) {
      e.preventDefault();
    }
  }, false);






})

