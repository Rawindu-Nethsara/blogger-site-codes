  //////////  STORY LINE, (SYNOPSYS)
(function () {
  const maxWords = 62; // change limit here
  const container = document.getElementById("story");
  const text = container.innerText.trim();
  const words = text.split(/\s+/);

  if (words.length > maxWords) {
    const visibleText = words.slice(0, maxWords).join(" ");
    const hiddenText = words.slice(maxWords).join(" ");

    container.innerHTML = `
      ${visibleText} <span class="toggle-btn" onclick="showMore(this)">see more</span>
      <span class="hidden-text">${hiddenText} <span class="toggle-btn" onclick="showLess(this)">show less</span></span>
    `;
  }
})();

function showMore(el) {
  const hiddenPart = el.parentNode.querySelector(".hidden-text");
  hiddenPart.style.display = "inline";
  el.style.display = "none"; // hide "see more"
}

function showLess(el) {
  const hiddenPart = el.parentNode;
  const seeMoreBtn = hiddenPart.parentNode.querySelector(".toggle-btn");
  hiddenPart.style.display = "none";
  seeMoreBtn.style.display = "inline"; // show "see more" again
}
