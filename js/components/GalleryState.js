class GalleryState {
  constructor() {
    this.images = this.loadImages();
    this.currentFilter = "all";
    this.favorites = this.loadFavorites();
    this.currentImageIndex = 0;
    this.pendingUpload = null;
    this.storageAvailable = true;
    this.sessionImages = [];
  }

  //   For Load Images from Local Storage
  loadImages() {
    try {
      const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.IMAGES);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.length > 0 ? parsed : CONFIG.DEFAULT_IMAGES;
      }
      return CONFIG.DEFAULT_IMAGES;
    } catch (error) {
      console.log("Could not load images from storage", error);
      return CONFIG.DEFAULT_IMAGES;
    }
  }

  //   FOr SaveImage in localStorage
  saveImages() {
    try {
      localStorage.setItem(
        CONFIG.STORAGE_KEYS.IMAGES,
        JSON.stringify(this.images)
      );
      return true;
    } catch (error) {
      if (error.name === "QuotaExceededError") {
        this.storageAvailable = false;
        document.getElementById("storageWarning").classList.add("show");
        showNotification(
          "Storage quota exceeded. Using session storage.",
          "warning"
        );
      }
      return false;
    }
  }

  //   For Load Favurite Image from Local Storage
  loadFavorites() {
    try {
      return JSON.parse(
        localStorage.getItem(CONFIG.STORAGE_KEYS.FAVORITES) || "[]"
      );
    } catch (e) {
      return [];
    }
  }

  //   For set favourites in localStorage
  saveFavorites() {
    try {
      localStorage.setItem(
        CONFIG.STORAGE_KEYS.FAVORITES,
        JSON.stringify(this.favorites)
      );
    } catch (e) {
      console.warn("Could not save favorites");
    }
  }

  //   For add new Image in Image state
  addImage(imageData) {
    const newImage = {
      id: Date.now(),
      ...imageData,
      isCustom: true,
      dateAdded: new Date().toISOString(),
    };

    this.images.unshift(newImage);

    if (this.storageAvailable) {
      this.saveImages();
    } else {
      this.sessionImages.push(newImage);
    }

    return newImage;
  }

  //   For Delete Image
  deleteImage(imageId) {
    const imageToDelete = this.images.find((img) => img.id === imageId);

    if (!imageToDelete || !imageToDelete.isCustom) {
      showNotification("Cannot delete default gallery images", "error");
      return false;
    }

    this.images = this.images.filter((img) => img.id !== imageId);
    this.favorites = this.favorites.filter((id) => id !== imageId);
    this.sessionImages = this.sessionImages.filter((img) => img.id !== imageId);

    if (this.storageAvailable) {
      this.saveImages();
    }
    this.saveFavorites();

    showNotification("Image deleted successfully", "success");
    return true;
  }

  toggleFavorite(imageId) {
    const index = this.favorites.indexOf(imageId);
    if (index > -1) {
      this.favorites.splice(index, 1);
    } else {
      this.favorites.push(imageId);
    }
    this.saveFavorites();
  }

  isFavorite(imageId) {
    return this.favorites.includes(imageId);
  }

  getFilteredImages() {
    if (this.currentFilter === "all") {
      return this.images;
    }
    return this.images.filter((img) => img.category === this.currentFilter);
  }

  getFavoriteImages() {
    return this.images.filter((img) => this.favorites.includes(img.id));
  }
}
