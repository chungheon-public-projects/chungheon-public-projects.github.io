function setStyles(){
  var e = document.getElementsByClassName("path");
  for(var c of e){
    console.log("entered");
    c.style.transition = "0.4s";
    c.style.paddingTop = "25px";
    c.style.paddingBottom = "25px";
  }
  showDivs(aboutIndex);
}

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  var e = document.getElementsByClassName("path");
  if (document.documentElement.scrollTop > 50) {
    for(var c of e){
      c.style.paddingTop = "15px";
      c.style.paddingBottom = "15px";
    }
  } else {
    for(var c of e){
      c.style.paddingTop = "25px";
      c.style.paddingBottom = "25px";
    }
  }
}

var aboutIndex = 0;

function plusDivs(n) {
  showDivs(aboutIndex += n );
}

function showDivs(n) {
  var imgs = ["./resources/about1.png", "./resources/about1_small.png", "./resources/img_mountains.jpg","./resources/img_forest.jpg"]
  var x = document.getElementsByClassName("aboutme");
  if(n < 0){
    n += imgs.length;
  }
  for(var e of x){
    e.style.backgroundImage = "url("+ imgs[n % imgs.length] + ")";
  }
  this.aboutIndex = n;
}

function imgDrag(event){
  event.preventDefault();
}

