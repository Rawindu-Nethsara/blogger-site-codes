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
