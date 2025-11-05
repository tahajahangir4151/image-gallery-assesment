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
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".filter-btn").forEach((b) => {
          b.classList.remove("active");
          const target = e.currentTarget || btn;
          target.classList.add("active");
          this.state.currentFilter = target.dataset.category || "all";
          this.renderer.renderGallery();
          this.attachGalleryItemListeners();
        });
      });
    });

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

    document.addEventListener("click", (e) => {
      const delBtn = e.target.closest && e.target.closest(".delete-btn");
      if (delBtn) {
        e.stopPropagation();
        const imageId = parseInt(delBtn.dataset.id);
        if (Number.isNaN(imageId)) return;
        if (!confirm("Are you sure you want to delete this image?")) return;
        const deleted = this.state.deleteImage(imageId);
        if (deleted) {
          this.renderer.renderGallery();
          this.renderer.updateFavoritesCount();
          this.attachGalleryItemListeners();
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

    this.uploadModal = document.getElementById("uploadModal");
    this.uploadPreview = document.getElementById("uploadPreview");
    this.uploadTitle = document.getElementById("uploadTitle");
    this.uploadCategory = document.getElementById("uploadCategory");
    this.saveUploadBtn = document.getElementById("saveUpload");
    this.cancelUploadBtn = document.getElementById("cancelUpload");
    this.uploadCloseBtn = document.querySelector(".upload-close");

    if (this.uploadCloseBtn)
      this.uploadCloseBtn.addEventListener("click", () =>
        this.closeUploadModal()
      );
    if (this.cancelUploadBtn)
      this.cancelUploadBtn.addEventListener("click", () =>
        this.closeUploadModal()
      );
    if (this.saveUploadBtn)
      this.saveUploadBtn.addEventListener("click", () => this.saveUpload());

    const imageUpload = document.getElementById("imageUpload");
    if (imageUpload) {
      imageUpload.addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
          const dataUrl = ev.target.result;
          if (this.uploadPreview) this.uploadPreview.src = dataUrl;
          if (this.uploadTitle)
            this.uploadTitle.value = file.name.replace(/\.[^/.]+$/, "");
          if (this.uploadCategory) this.uploadCategory.value = "custom";
          this._pendingUploadDataUrl = dataUrl;
          this.openUploadModal();
        };
        reader.readAsDataURL(file);
        e.target.value = "";
      });
    }
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

  openUploadModal() {
    if (!this.uploadModal) return;
    this.uploadModal.classList.remove("hidden");
  }

  closeUploadModal() {
    if (!this.uploadModal) return;
    this.uploadModal.classList.add("hidden");
    this._pendingUploadDataUrl = null;
    if (this.uploadPreview) {
      this.uploadPreview.src = "";
      this.uploadPreview.style.transform = "";
    }
    if (this.uploadTitle) this.uploadTitle.value = "";
    if (this.uploadCategory) this.uploadCategory.value = "custom";
  }

  saveUpload() {
    if (!this._pendingUploadDataUrl) return;
    const title = this.uploadTitle ? this.uploadTitle.value.trim() : "Untitled";
    const category = this.uploadCategory ? this.uploadCategory.value : "custom";
    this.state.addImage({
      title: title || "Untitled",
      category,
      url: this._pendingUploadDataUrl,
    });
    this.renderer.renderGallery();
    this.renderer.updateFavoritesCount();
    this.attachGalleryItemListeners();
    this.closeUploadModal();
    showNotification &&
      typeof showNotification === "function" &&
      showNotification("Image uploaded", "success");
  }
}
