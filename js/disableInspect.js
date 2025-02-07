// Disable right-click
document.addEventListener("contextmenu", (event) => event.preventDefault());

// Prevent DevTools (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
document.addEventListener("keydown", (event) => {
  if (
    event.keyCode == 123 || // F12
    (event.ctrlKey &&
      event.shiftKey &&
      (event.keyCode == 73 || event.keyCode == 74)) || // Ctrl+Shift+I or Ctrl+Shift+J
    (event.ctrlKey && event.keyCode == 85)
  ) {
    // Ctrl+U
    event.preventDefault();
  }
});
