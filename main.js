function setStyles(){
  var e = document.getElementsByClassName("path");
  for(var c of e){
    c.style.transition = "0.4s";
    c.style.paddingTop = "25px";
    c.style.paddingBottom = "25px";
  }
  addAnim();
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

function allowDrag(ev) {
  ev.preventDefault();
}

function addAnim(){
  var elements = document.getElementsByClassName("msg");
  for(var e of elements){
    e.onmouseenter = function(){
      e.classList.add('msganim');
    }
    e.onmouseleave = function(){
      e.classList.remove('msganim');
    }
  }
}
