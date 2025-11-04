class GalleryRenderer {
  constructor(state) {
    this.state = state;
    this.galleryGrid = document.getElementById("galleryGrid");
    this.favoritesGrid = document.getElementById("favoritesGrid");
  }

  createGalleryItem(image) {
    const item = document.createElement("div");
    item.className = "gallery-item";
    item.dataset.id = image.id;

    item.innerHTML = `
<div class="gallery-item-image-wrapper">
 <img src="${image.url}" alt="${image.title}" loading="lazy">
            </div><div class="gallery-item-overlay">
    <div class="gallery-item-title">${image.title}</div>
    <div class="gallery-item-category">${this.getCategoryIcon(
      image.category
    )} ${image.category}</div>
 </div>
  <div class="item-actions">
     <button class="favorite-btn ${
       this.state.isFavorite(image.id) ? "favorited" : ""
     }" data-id="${image.id}">
        <span class="heart-icon">♥</span>
    </button>
    ${
      image.isCustom
        ? `<button class="delete-btn" data-id="${image.id}">🗑</button>`
        : ""
    }
            </div>
        `;

    return item;
  }

  getCategoryIcon(category) {
    const icons = {
      nature: "🌲",
      city: "🏙️",
      people: "👥",
      custom: "⭐",
    };
    return icons[category] || "📷";
  }

  renderGallery() {
    const images = this.state.getFilteredImages();
    this.galleryGrid.innerHTML = "";

    if (images.length === 0) {
      this.galleryGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: white;">
                    <div style="font-size: 60px; margin-bottom: 20px;">📷</div>
                    <h3 style="margin-bottom: 10px;">No images found</h3>
                    <p style="opacity: 0.8;">Upload your first image to get started</p>
                </div>
            `;
      return;
    }

    images.forEach((image, index) => {
      const item = this.createGalleryItem(image);
      item.style.animationDelay = `${index * 0.05}s`;
      this.galleryGrid.appendChild(item);
    });
  }

  renderFavorites() {
    const favorites = this.state.getFavoriteImages();
    this.favoritesGrid.innerHTML = "";

    if (favorites.length === 0) {
      this.favoritesGrid.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: #999;">
                    <div style="font-size: 50px; margin-bottom: 15px;">💔</div>
                    <p>No favorites yet</p>
                    <p style="font-size: 12px; margin-top: 10px; opacity: 0.7;">
                        Click the heart icon on images to add them here
                    </p>
                </div>
            `;
      return;
    }

    favorites.forEach((image, index) => {
      const item = document.createElement("div");
      item.className = "favorite-item";
      item.dataset.id = image.id;
      item.style.animationDelay = `${index * 0.1}s`;
      item.innerHTML = `<img src="${image.url}" alt="${image.title}">`;
      this.favoritesGrid.appendChild(item);
    });
  }

  updateFavoritesCount() {
    const count = Array.isArray(this.state.favorites)
      ? this.state.favorites.length
      : 0;
    const countElement = document.querySelector(".favorites-count");
    if (!countElement) return;
    countElement.textContent = count;

    countElement.style.animation = "none";
    setTimeout(() => {
      countElement.style.animation = "pulse 0.5s ease";
    }, 10);
  }
}
