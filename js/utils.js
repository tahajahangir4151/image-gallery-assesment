function showNotification(msg, type = "info", timeout = 3000) {
  try {
    const existing = document.querySelector(".app-notification-container");
    let container = existing;
    if (!container) {
      container = document.createElement("div");
      container.className = "app-notification-container";
      Object.assign(container.style, {
        position: "fixed",
        right: "20px",
        top: "20px",
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        pointerEvents: "none",
      });
      document.body.appendChild(container);
    }
  } catch (error) {
    console.log(error);
  }
}
