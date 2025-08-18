  ////////////TAABS FOR WATCH AND SUBTITLE
  function showContent(evt, contentId) {
    var i, contents, buttons;

    contents = document.getElementsByClassName("sectionBox");
    for (i = 0; i < contents.length; i++) {
      contents[i].style.display = "none";
    }

    buttons = document.getElementsByClassName("switchBtn");
    for (i = 0; i < buttons.length; i++) {
      buttons[i].className = buttons[i].className.replace(" active", "");
    }

    document.getElementById(contentId).style.display = "block";
    evt.currentTarget.className += " active";
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("defaultOpen").click();
  });
