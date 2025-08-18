/////trailer-video.
const popup = document.getElementById("trailerPopup");
const frame = document.getElementById("trailerFrame");
function openPopup(){popup.style.display="flex";}
function closePopup(){popup.style.display="none"; frame.src=frame.src;}
popup.onclick = closePopup;
