// Slideshow用のJS
$(function(){

// グローバル定数
const next = document.getElementById("next");
const prev = document.getElementById("prev");
const close = document.getElementById("closebtn");
const save = document.getElementById("saveimg");

const ul = document.getElementById('slides-inner');
const slides = ul.children;
let currentIndex = 0;
// 画像保存用
let saveimg = [];

// 1.イベント処理

// LocalStorageから枚数分持ってくる
   for (let i = 1; i<5; i++){
        let currentp = `worksimg${i}`;
        let localData = window.localStorage.getItem(`savekey${i}`);
        const image =  document.getElementById(currentp);
        const src = localData;
        image.setAttribute('src',src);
        //保存用のデータ配列に入れる
        saveimg.push(localData);
    }
    updateButtons();
    console.log(saveimg);

// WIndow Resizeの時の処理
window.addEventListener('resize',()=>{
    moveSlides();
});


// 2. ボタン操作

// Nextをクリックした時に画像を動かす
next.addEventListener('click',()=>{
    currentIndex ++;
    moveSlides();
})

//Prevをクリックしたとき画面を元に戻す
prev.addEventListener('click',()=>{
    currentIndex --;
    moveSlides();
})

//おしまいボタンを押すと画面を閉じる
close.addEventListener('click',()=>{
    window.close();
})

// ほぞんボタンを押す
save.addEventListener('click',()=>{
    downloadImages(saveimg);
})


// 3. 関数
// ボタンの表示非表示を計算する
function updateButtons(){
    prev.classList.remove('hidden');
    next.classList.remove('hidden');
    close.classList.add('hidden');
    save.classList.add('hidden');
    

    if(currentIndex === 0 ){
        prev.classList.add('hidden');
    }
    if(currentIndex === slides.length -1){
        next.classList.add('hidden');
        close.classList.remove('hidden');
        save.classList.remove('hidden');
    }
}

//スライドの移動

function moveSlides() {
    const slideWidth = slides[0].getBoundingClientRect().width;
    ul.style.transform = `translateX(${-1 * slideWidth * currentIndex}px)`;
    updateButtons();
  }

//ダウンロード処理
function downloadImages(saveimg) {
    let zip = new JSZip();
     for(let i = 0; i<saveimg.length; i++){
        zip.file('img'+[i]+'.png',saveimg[i].split(',')[1],{base64:true});
    }  
    zip.generateAsync({type: 'blob'})
        .then(function(content){
          saveAs(content, 'images.zip');
        });


    }



   


})