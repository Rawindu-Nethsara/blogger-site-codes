  
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
