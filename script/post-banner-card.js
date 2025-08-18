   /* BANNER JS CODE  */
  
  ////////// TRAILER VIDEO
const popup = document.getElementById("trailerPopup");
const frame = document.getElementById("trailerFrame");

function openPopup() {
  popup.style.display = "flex";
}
function closePopup() {
  popup.style.display = "none";
  // Stop video by resetting src
  frame.src = frame.src;
}
popup.onclick = closePopup;
  
  ///////////////// MAIN TITLE ADD
  
  document.addEventListener("DOMContentLoaded", function () {
    const originalTitle = document.querySelector("h1.pTtl.aTtl.sml.itm span");
    const targetTitle = document.querySelector("#customTitle");

    if (originalTitle && targetTitle) {
      targetTitle.textContent = originalTitle.textContent.trim();
    } else {
      console.warn("Title not found:", {
        originalTitleExists: !!originalTitle,
        targetTitleExists: !!targetTitle
      });
    }
  });
  
  //////// SAVE BUTTON ADD
document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll(".myListBtn").forEach(function(btn) {
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      const postContainer = btn.closest("article, .post, .entry, .item");
      const label = postContainer ? postContainer.querySelector(".tIc") : null;
      if (label) {
        label.click();
      }
    });
  });
});
  
////////// BANNER SYNOPSYS SHORT FOR (...)
  document.addEventListener("DOMContentLoaded", function () {
    const maxWords = 34;
    document.querySelectorAll("p7").forEach(el => {
      const words = el.textContent.trim().split(/\s+/);
      if (words.length > maxWords) {
        el.textContent = words.slice(0, maxWords).join(" ") + "...";
      }
    });
  });
