// Slideshow用のJS
$(function(){

// グローバル定数
const next = document.getElementById("next");
const prev = document.getElementById("prev");
const close = document.getElementById("closebtn");


const ul = document.getElementById('slides-inner');
const slides = ul.children;
let currentIndex = 0;

// 1.イベント処理

// LocalStorageから枚数分持ってくる
   for (let i = 1; i<5; i++){
        let currentp = `worksimg${i}`;
        let localData = window.localStorage.getItem(`savekey${i}`);
        const image =  document.getElementById(currentp);
        const src = localData;
        image.setAttribute('src',src);
    }
    updateButtons();

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



// 3. 関数
// ボタンの表示非表示を計算する
function updateButtons(){
    prev.classList.remove('hidden');
    next.classList.remove('hidden');
    close.classList.add('hidden');

    if(currentIndex === 0 ){
        prev.classList.add('hidden');
    }
    if(currentIndex === slides.length -1){
        next.classList.add('hidden');
        close.classList.remove('hidden');
    }
}

function moveSlides() {
    const slideWidth = slides[0].getBoundingClientRect().width;
    ul.style.transform = `translateX(${-1 * slideWidth * currentIndex}px)`;
    updateButtons();
  }


})