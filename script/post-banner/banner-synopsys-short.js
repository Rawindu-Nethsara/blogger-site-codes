////////// BANNER SYNOPSYS SHORT FOR 
  document.addEventListener("DOMContentLoaded", function () {
    const maxWords = 34;
    document.querySelectorAll("p7").forEach(el => {
      const words = el.textContent.trim().split(/\s+/);
      if (words.length > maxWords) {
        el.textContent = words.slice(0, maxWords).join(" ") + "...";
      }
    });
  });
