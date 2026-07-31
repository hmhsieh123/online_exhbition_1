
/* ===== 圖片路徑執行期還原：避免原始 JS 直接列出所有作品網址 ===== */
var _secureImageMap="WyJpbWFnZXMvMTR5bXNwbGxvcjdpM3V1d25yLnN2ZyIsImltYWdlcy9jZzBhNjR0N3gxcDM5NTZxaDQuc3ZnIiwiaW1hZ2VzL2RjY2szcmtzMjg5eGF6dHlxdS5zdmciLCJpbWFnZXMvN2I5eHRlMDhrYms1aDYyZjY5LnN2ZyIsImltYWdlcy9wNDhxNXQ3dXB3ZGxlNzRya3guc3ZnIl0=";
function decodeImageMap(){
    try {
        return JSON.parse(decodeURIComponent(escape(atob(_secureImageMap))));
    } catch(e) {
        return JSON.parse(atob(_secureImageMap));
    }
}
var secureImagePaths=decodeImageMap();

function getArtworkImagePath(index){
    if(index<0 || index>=secureImagePaths.length)return "";
    return secureImagePaths[index];
}

(function(){
var artworks=[
{title:"慈悲觀音",description:"墨韻之間・觀自在心",imageKey:0,year:"2026",license:"僅供本展覽線上瀏覽"},
{title:"禪心自在",description:"心無罣礙・自在清明",imageKey:1,year:"2026",license:"僅供本展覽線上瀏覽"},
{title:"蓮華世界",description:"一花一世界・一葉一如來",imageKey:2,year:"2026",license:"僅供本展覽線上瀏覽"},
{title:"般若智慧",description:"觀照自心・明心見性",imageKey:3,year:"2026",license:"僅供本展覽線上瀏覽"},
{title:"法音長住",description:"妙法清音・廣利群生",imageKey:4,year:"2026",license:"僅供本展覽線上瀏覽"}
];
var slides=document.querySelectorAll('.slide');
var artNumber=document.getElementById('artNumber');
var artTitle=document.getElementById('artTitle');
var artDescription=document.getElementById('artDescription');
var dotsContainer=document.getElementById('dots');
var prevButton=document.getElementById('prevButton');
var nextButton=document.getElementById('nextButton');
var lightbox=document.getElementById('lightbox');
var lightboxImage=document.getElementById('lightboxImage');
var lightboxZoomStage=document.getElementById('lightboxZoomStage');
var lightboxTitle=document.getElementById('lightboxTitle');
var lightboxNumber=document.getElementById('lightboxNumber');
var lightboxAuthor=document.getElementById('lightboxAuthor');
var lightboxName=document.getElementById('lightboxName');
var lightboxYear=document.getElementById('lightboxYear');
var lightboxDescription=document.getElementById('lightboxDescription');
var lightboxLicense=document.getElementById('lightboxLicense');
var lightboxInfo=document.getElementById('lightboxInfo');
var lightboxClose=document.getElementById('lightboxClose');
var lightboxPrev=document.getElementById('lightboxPrev');
var lightboxNext=document.getElementById('lightboxNext');
var slider=document.getElementById('slider');
var authorModal=document.getElementById('authorModal');
var authorOpen=document.getElementById('authorOpen');
var authorClose=document.getElementById('authorClose');
var exhibitionTags=document.getElementById('exhibitionTags');
var tagButtons=exhibitionTags?exhibitionTags.getElementsByTagName('button'):[];
var lightboxZoom=1;
var lightboxPanX=0,lightboxPanY=0;
var lightboxDragging=false,lightboxDragStartX=0,lightboxDragStartY=0,lightboxDragOriginX=0,lightboxDragOriginY=0;
var currentIndex=0,autoplay=null,lightboxAnimating=false,touchStartX=0,touchCurrentX=0,dragging=false;
function normalizeIndex(i){return (i+artworks.length)%artworks.length;}
function hasClass(el,n){return (' '+el.className+' ').indexOf(' '+n+' ')!==-1;}

function setSlideImage(slide,index){
    var img=slide.getElementsByTagName('img')[0];
    if(!img)return;
    img.alt=artworks[index].title;
    var path=getArtworkImagePath(index);
    if(path && img.getAttribute('src')!==path){
        img.setAttribute('src',path);
    }
}

function updateTags(){
var i,idx;
for(i=0;i<tagButtons.length;i++){
idx=parseInt(tagButtons[i].getAttribute('data-index'),10);
tagButtons[i].className=idx===currentIndex?'exhibition-tag active':'exhibition-tag';
}
}
function updateDots(){var dots=dotsContainer.getElementsByTagName('button'),i;for(i=0;i<dots.length;i++){dots[i].className=i===currentIndex?'dot active':'dot';}}


function applyLazyArtworkLoading(){
    var total=artworks.length;
    var prev=(currentIndex-1+total)%total;
    var next=(currentIndex+1)%total;

    for(var i=0;i<slides.length;i++){
        var img=slides[i].getElementsByTagName('img')[0];
        if(!img)continue;

        if(i===currentIndex || i===prev || i===next){
            setSlideImage(slides[i],i);
        }else{
            img.removeAttribute('src');
        }
    }
}


function updateSlider(){
    applyLazyArtworkLoading();

    var i;
    var p=normalizeIndex(currentIndex-1);
    var n=normalizeIndex(currentIndex+1);
    var fp=normalizeIndex(currentIndex-2);
    var fn=normalizeIndex(currentIndex+2);

    for(i=0;i<slides.length;i++){
        slides[i].setAttribute('data-artwork-index',i);

        if(i===currentIndex){
            slides[i].className='slide active';
        }else if(i===p){
            slides[i].className='slide prev';
        }else if(i===n){
            slides[i].className='slide next';
        }else if(i===fp){
            slides[i].className='slide far-prev';
        }else if(i===fn){
            slides[i].className='slide far-next';
        }else{
            slides[i].className='slide hidden';
        }
    }

    artNumber.innerHTML='作品 '+('0'+(currentIndex+1)).slice(-2)+' / '+('0'+artworks.length).slice(-2);
    artTitle.innerHTML=artworks[currentIndex].title;
    artDescription.innerHTML=artworks[currentIndex].description;
    updateDots();
    updateTags();
}
function nextSlide(){currentIndex=normalizeIndex(currentIndex+1);updateSlider();}
function previousSlide(){currentIndex=normalizeIndex(currentIndex-1);updateSlider();}
function resetAutoplay(){if(autoplay)clearInterval(autoplay);if(!hasClass(lightbox,'show')&&!hasClass(authorModal,'show'))autoplay=setInterval(nextSlide,3000);}
function makeDot(index){var dot=document.createElement('button');dot.className='dot';dot.setAttribute('aria-label','切換至第 '+(index+1)+' 幅作品');dot.onclick=function(){currentIndex=index;updateSlider();resetAutoplay();};dotsContainer.appendChild(dot);}
function updateLightboxInfoLayout(){
if(!lightboxInfo||!lightboxImage||!lightboxNext)return;

var imageRect=lightboxImage.getBoundingClientRect();
var arrowRect=lightboxNext.getBoundingClientRect();
var viewportW=window.innerWidth||document.documentElement.clientWidth;
var viewportH=window.innerHeight||document.documentElement.clientHeight;

/* 面板盡量靠近大圖：優先放在右箭頭右側 2px */
var left=Math.round(arrowRect.right+2);

/* 上緣仍與向右箭頭下緣切齊 */
var top=Math.round(arrowRect.bottom);

/* 下緣仍與大圖下緣切齊 */
var bottom=Math.round(viewportH-imageRect.bottom);

/* 寬度縮為原本約一半 */
var panelWidth=310;

/* 空間不足時，仍盡量貼近大圖 */
if(left+panelWidth+6>viewportW){
left=Math.max(Math.round(imageRect.right+2),viewportW-panelWidth-6);
}

if(top<0)top=0;
if(bottom<0)bottom=0;

lightboxInfo.style.left=left+'px';
lightboxInfo.style.right='auto';
lightboxInfo.style.top=top+'px';
lightboxInfo.style.bottom=bottom+'px';
lightboxInfo.style.width=panelWidth+'px';
lightboxInfo.style.height='auto';
lightboxInfo.style.overflowY='auto';
}

function updateLightboxInfo(){
var a=artworks[currentIndex];
lightboxNumber.innerHTML='作品 '+('0'+(currentIndex+1)).slice(-2)+' / '+('0'+artworks.length).slice(-2);
lightboxAuthor.innerHTML='作者姓名';
lightboxName.innerHTML=a.title;
lightboxYear.innerHTML=a.year||'—';
lightboxDescription.innerHTML=a.description||'—';
lightboxLicense.innerHTML=a.license||'—';
setTimeout(updateLightboxInfoLayout,20);
}
function applyLightboxZoom(){
if(!lightboxZoomStage)return;
var transform='translate('+lightboxPanX+'px,'+lightboxPanY+'px) scale('+lightboxZoom+')';
lightboxZoomStage.style.webkitTransform=transform;
lightboxZoomStage.style.transform=transform;

if(lightboxZoom>1){
lightboxZoomStage.style.cursor=lightboxDragging?'grabbing':'grab';
}else{
lightboxZoomStage.style.cursor='zoom-in';
}
}

function resetLightboxZoom(){
lightboxZoom=1;
lightboxPanX=0;
lightboxPanY=0;
lightboxDragging=false;
applyLightboxZoom();
}

function handleLightboxWheel(e){
e=e||window.event;
if(!hasClass(lightbox,'show'))return;

var delta=0;
if(typeof e.deltaY==='number'){
delta=e.deltaY;
}else if(typeof e.wheelDelta==='number'){
delta=-e.wheelDelta;
}else if(typeof e.detail==='number'){
delta=e.detail;
}

if(delta<0){
lightboxZoom+=0.1;
}else if(delta>0){
lightboxZoom-=0.1;
}

if(lightboxZoom<1)lightboxZoom=1;
if(lightboxZoom>3)lightboxZoom=3;
if(lightboxZoom===1){lightboxPanX=0;lightboxPanY=0;}

applyLightboxZoom();

if(e.preventDefault)e.preventDefault();
e.returnValue=false;
return false;
}

function startLightboxDrag(e){
if(lightboxZoom<=1)return;
e=e||window.event;
lightboxDragging=true;
lightboxDragStartX=e.clientX;
lightboxDragStartY=e.clientY;
lightboxDragOriginX=lightboxPanX;
lightboxDragOriginY=lightboxPanY;
applyLightboxZoom();

if(e.preventDefault)e.preventDefault();
e.returnValue=false;
}

function moveLightboxDrag(e){
if(!lightboxDragging)return;
e=e||window.event;

lightboxPanX=lightboxDragOriginX+(e.clientX-lightboxDragStartX);
lightboxPanY=lightboxDragOriginY+(e.clientY-lightboxDragStartY);
applyLightboxZoom();

if(e.preventDefault)e.preventDefault();
e.returnValue=false;
}

function endLightboxDrag(){
if(!lightboxDragging)return;
lightboxDragging=false;
applyLightboxZoom();
}

/* 觸控拖曳 */
function startLightboxTouchDrag(e){
if(lightboxZoom<=1||!e.touches||e.touches.length!==1)return;
lightboxDragging=true;
lightboxDragStartX=e.touches[0].clientX;
lightboxDragStartY=e.touches[0].clientY;
lightboxDragOriginX=lightboxPanX;
lightboxDragOriginY=lightboxPanY;
applyLightboxZoom();
}

function moveLightboxTouchDrag(e){
if(!lightboxDragging||!e.touches||e.touches.length!==1)return;
lightboxPanX=lightboxDragOriginX+(e.touches[0].clientX-lightboxDragStartX);
lightboxPanY=lightboxDragOriginY+(e.touches[0].clientY-lightboxDragStartY);
applyLightboxZoom();

if(e.preventDefault)e.preventDefault();
}

function openLightbox(){
    resetLightboxZoom();

    var imagePath=getArtworkImagePath(currentIndex);
    if(!imagePath)return;

    lightbox.className='lightbox show';
    document.body.className='no-scroll';

    lightboxTitle.innerHTML=artworks[currentIndex].title;
    if(typeof updateLightboxInfo==='function')updateLightboxInfo();

    lightboxImage.alt=artworks[currentIndex].title;
    lightboxImage.src=imagePath;

    if(autoplay)clearInterval(autoplay);

    if(typeof updateLightboxInfoLayout==='function'){
        setTimeout(updateLightboxInfoLayout,50);
    }
}
function closeLightbox(){resetLightboxZoom();lightbox.className='lightbox';document.body.className='';resetAutoplay();}
function updateLightboxImage(){
  resetLightboxZoom();
  lightboxTitle.innerHTML=artworks[currentIndex].title;
  if(typeof updateLightboxInfo==="function")updateLightboxInfo();

  var imagePath=getArtworkImagePath(currentIndex);
  if(imagePath){
    lightboxImage.alt=artworks[currentIndex].title;
    lightboxImage.src=imagePath;
  }

  updateSlider();

  if(typeof alignLightboxInfoToArrowAndImage==="function"){
    setTimeout(alignLightboxInfoToArrowAndImage,50);
  }
}
function animateLightboxChange(direction){var d;if(lightboxAnimating)return;lightboxAnimating=true;d=direction==='next'?-10:10;lightboxImage.style.webkitTransition='-webkit-transform .15s ease, opacity .15s ease';lightboxImage.style.transition='transform .15s ease, opacity .15s ease';lightboxImage.style.webkitTransform='translateX('+d+'px)';lightboxImage.style.transform='translateX('+d+'px)';lightboxImage.style.opacity='0';setTimeout(function(){currentIndex=direction==='next'?normalizeIndex(currentIndex+1):normalizeIndex(currentIndex-1);updateLightboxImage();lightboxImage.style.webkitTransition='none';lightboxImage.style.transition='none';lightboxImage.style.webkitTransform='translateX('+(-d)+'px)';lightboxImage.style.transform='translateX('+(-d)+'px)';setTimeout(function(){lightboxImage.style.webkitTransition='-webkit-transform .2s ease, opacity .2s ease';lightboxImage.style.transition='transform .2s ease, opacity .2s ease';lightboxImage.style.webkitTransform='translateX(0)';lightboxImage.style.transform='translateX(0)';lightboxImage.style.opacity='1';setTimeout(function(){lightboxAnimating=false;},220);},20);},150);}
function openAuthor(){authorModal.className='author-modal show';document.body.className='no-scroll';if(autoplay)clearInterval(autoplay);}
function closeAuthor(){authorModal.className='author-modal';document.body.className='';resetAutoplay();}
var i;for(i=0;i<artworks.length;i++)makeDot(i);
for(i=0;i<slides.length;i++){
    slides[i].onclick=function(e){
        e=e||window.event;
        var target=parseInt(this.getAttribute('data-artwork-index'),10);

        if(target!==currentIndex){
            currentIndex=target;
            updateSlider();
            resetAutoplay();
            return;
        }

        openLightbox();

        if(e.stopPropagation)e.stopPropagation();
        e.cancelBubble=true;
    };
}
prevButton.onclick=function(){previousSlide();resetAutoplay();};nextButton.onclick=function(){nextSlide();resetAutoplay();};
lightboxClose.onclick=closeLightbox;lightboxNext.onclick=function(e){if(e&&e.stopPropagation)e.stopPropagation();animateLightboxChange('next');};lightboxPrev.onclick=function(e){if(e&&e.stopPropagation)e.stopPropagation();animateLightboxChange('prev');};lightbox.onclick=function(e){e=e||window.event;if(e.target===lightbox)closeLightbox();};
authorOpen.onclick=openAuthor;authorClose.onclick=closeAuthor;authorModal.onclick=function(e){e=e||window.event;if(e.target===authorModal)closeAuthor();};
lightboxImage.ontouchstart=function(e){if(!hasClass(lightbox,'show'))return;touchStartX=e.touches[0].clientX;touchCurrentX=touchStartX;dragging=true;lightboxImage.style.webkitTransition='none';lightboxImage.style.transition='none';};
lightboxImage.ontouchmove=function(e){var m;if(!dragging)return;touchCurrentX=e.touches[0].clientX;m=touchCurrentX-touchStartX;if(m>18)m=18;if(m<-18)m=-18;lightboxImage.style.webkitTransform='translateX('+m+'px)';lightboxImage.style.transform='translateX('+m+'px)';};
lightboxImage.ontouchend=function(){var diff;if(!dragging)return;dragging=false;diff=touchCurrentX-touchStartX;lightboxImage.style.webkitTransition='-webkit-transform .18s ease';lightboxImage.style.transition='transform .18s ease';lightboxImage.style.webkitTransform='translateX(0)';lightboxImage.style.transform='translateX(0)';if(Math.abs(diff)>45){if(diff<0)animateLightboxChange('next');else animateLightboxChange('prev');}};
document.onkeydown=function(e){e=e||window.event;if(hasClass(authorModal,'show')){if(e.keyCode===27)closeAuthor();return;}if(hasClass(lightbox,'show')){if(e.keyCode===27)closeLightbox();else if(e.keyCode===39)animateLightboxChange('next');else if(e.keyCode===37)animateLightboxChange('prev');return;}if(e.keyCode===39){nextSlide();resetAutoplay();}else if(e.keyCode===37){previousSlide();resetAutoplay();}};
document.oncontextmenu=function(e){e=e||window.event;var t=e.target||e.srcElement;if(t&&t.tagName&&t.tagName.toLowerCase()==='img')return false;};
var imgs=document.getElementsByTagName('img');for(i=0;i<imgs.length;i++){imgs[i].setAttribute('draggable','false');imgs[i].ondragstart=function(){return false;};}
slider.onmouseenter=function(){if(autoplay)clearInterval(autoplay);};slider.onmouseleave=function(){resetAutoplay();};
for(i=0;i<tagButtons.length;i++){
tagButtons[i].onclick=function(){
currentIndex=parseInt(this.getAttribute('data-index'),10);
updateSlider();
resetAutoplay();
};
}
lightboxImage.onload=updateLightboxInfoLayout;
if(window.addEventListener){
window.addEventListener('resize',function(){setTimeout(updateLightboxInfoLayout,60);},false);
}else{
window.attachEvent('onresize',function(){setTimeout(updateLightboxInfoLayout,60);});
}
if(lightbox){
if(lightbox.addEventListener){
lightbox.addEventListener('wheel',handleLightboxWheel,{passive:false});
lightbox.addEventListener('mousewheel',handleLightboxWheel,false);
lightbox.addEventListener('DOMMouseScroll',handleLightboxWheel,false);
}else{
lightbox.attachEvent('onmousewheel',handleLightboxWheel);
}
}

if(lightboxZoomStage){
if(lightboxZoomStage.addEventListener){
lightboxZoomStage.addEventListener('mousedown',startLightboxDrag,false);
lightboxZoomStage.addEventListener('touchstart',startLightboxTouchDrag,false);
lightboxZoomStage.addEventListener('touchmove',moveLightboxTouchDrag,false);
lightboxZoomStage.addEventListener('touchend',endLightboxDrag,false);
}else{
lightboxZoomStage.attachEvent('onmousedown',startLightboxDrag);
}
}

if(document.addEventListener){
document.addEventListener('mousemove',moveLightboxDrag,false);
document.addEventListener('mouseup',endLightboxDrag,false);
}else{
document.attachEvent('onmousemove',moveLightboxDrag);
document.attachEvent('onmouseup',endLightboxDrag);
}

updateSlider();resetAutoplay();

/* ===== 一般下載操作阻擋（僅增加門檻，非真正安全機制） ===== */
document.addEventListener('contextmenu',function(e){
    var t=e.target||e.srcElement;
    if(t && t.tagName && t.tagName.toLowerCase()==='img'){
        e.preventDefault();
    }
},false);

document.addEventListener('dragstart',function(e){
    var t=e.target||e.srcElement;
    if(t && t.tagName && t.tagName.toLowerCase()==='img'){
        e.preventDefault();
    }
},false);

})();
