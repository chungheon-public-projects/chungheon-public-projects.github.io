function setStyles() {
  var e = document.getElementsByClassName("path");
  for (var c of e) {
    c.style.transition = "0.4s";
    c.style.paddingTop = "25px";
    c.style.paddingBottom = "25px";
  }
  var navBar = document.getElementById("navbar");
  navBar.style.background = "rgba(0, 0, 0, 0)";

  addAnim();
}

function scrollToWeb(){
  document.getElementById("projects").scrollIntoView();
}

window.onscroll = function () { scrollFunction() };

function scrollFunction() {
  var header = document.getElementById("about");
  var navBar = document.getElementById("navbar");

  // use greater than or equal to be sure.
  if (document.documentElement.scrollTop > header.scrollHeight - 50) {
    navBar.style.background = "rgba(0, 0, 0, 0.5)";
  }else{
    navBar.style.background = "rgba(0, 0, 0, 0)";
  }

  var element = document.getElementsByClassName("path");

  if (document.documentElement.scrollTop > 50) {
    for (var c of element) {
      c.style.paddingTop = "15px";
      c.style.paddingBottom = "15px";
    }
  } else {
    for (var c of element) {
      c.style.paddingTop = "25px";
      c.style.paddingBottom = "25px";
    }
  }
}

function addAnim() {
  var e = document.getElementById("about");
  var msg = document.getElementById("msg");
  msg.onmouseenter = function () {
    e.style.background = "black";
  }

  msg.onmouseleave = function () {
    e.style.background = "url(./resources/about_bg.jpg)";
    e.style.backgroundRepeat = "no-repeat";
    e.style.backgroundPosition = "center";
    e.style.backgroundSize = "cover";
  }

}
