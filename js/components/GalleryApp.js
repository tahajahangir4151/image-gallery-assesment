class GalleryApp {
  constructor() {
    this.state = new GalleryState();
    this.renderer = new GalleryRenderer(this.state);
    this.init();
  }

  init() {
    setTimeout(() => {
      this.renderer.renderGallery();
      this.renderer.updateFavoritesCount();
      const panel = document.getElementById("favoritesPanel");
      if (panel) panel.classList.remove("active");

      this.attachEventListeners();
      this.attachGalleryItemListeners();
    }, 100);
  }

  attachEventListeners() {
    const favToggle = document.getElementById("favoritesToggle");
    if (favToggle) {
      favToggle.addEventListener("click", () => {
        const panel = document.getElementById("favoritesPanel");
        if (!panel) return;
        panel.classList.toggle("active");
        this.renderer.renderFavorites();
        this.attachFavoriteItemListeners();
      });
    }

    const closeFav = document.querySelector(".close-favorites");
    if (closeFav) {
      closeFav.addEventListener("click", () => {
        const panel = document.getElementById("favoritesPanel");
        if (panel) panel.classList.remove("active");
      });
    }

    document.addEventListener("click", (e) => {
      const favBtn = e.target.closest && e.target.closest(".favorite-btn");
      if (favBtn) {
        e.stopPropagation();
        const imageId = parseInt(favBtn.dataset.id);
        if (Number.isNaN(imageId)) return;
        this.state.toggleFavorite(imageId);
        favBtn.classList.toggle("favorited");
        this.renderer.updateFavoritesCount();
        const panel = document.getElementById("favoritesPanel");
        if (panel && panel.classList.contains("active")) {
          this.renderer.renderFavorites();
          this.attachFavoriteItemListeners();
        }
      }
    });
  }

  attachGalleryItemListeners() {
    document.querySelectorAll(".gallery-item").forEach((item) => {
      const img = item.querySelector("img");
      if (img) {
        img.addEventListener("click", () => {
          const imageId = parseInt(item.dataset.id);
          if (this.modal && typeof this.modal.open === "function") {
            this.modal.open(imageId);
          }
        });
      }
    });
  }

  attachFavoriteItemListeners() {
    document.querySelectorAll(".favorite-item").forEach((item) => {
      item.addEventListener("click", () => {
        const imageId = parseInt(item.dataset.id);
        const panel = document.getElementById("favoritesPanel");
        if (panel) panel.classList.remove("active");
        if (this.modal && typeof this.modal.open === "function") {
          this.modal.open(imageId);
        }
      });
    });
  }
}
