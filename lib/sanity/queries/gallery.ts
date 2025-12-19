// Tüm aktif gallery'leri getir
export const activeGalleryQuery = `
  *[_type == "gallery" && isActive == true] | order(order asc) {
    _id,
    _type,
    title,
    description,
    category,
    mediaItems[] {
      _type,
      _key,
      // Image items
      image,
      alt,
      caption,
      // Video items
      video,
      poster,
      // External link items
      url,
      platform,
      title,
      description,
      thumbnail
    },
    order,
    isActive,
    tags,
    date,
    _createdAt,
    _updatedAt
  }
`;

// Kategoriye göre gallery'ler
export const galleryByCategoryQuery = `
  *[_type == "gallery" && isActive == true && category == $category] | order(order asc) {
    _id,
    _type,
    title,
    description,
    category,
    mediaItems[] {
      _type,
      _key,
      image,
      alt,
      caption,
      video,
      poster,
      url,
      platform,
      title,
      description,
      thumbnail
    },
    order,
    isActive,
    tags,
    date,
    _createdAt,
    _updatedAt
  }
`;

// Tüm gallery'leri getir (admin için)
export const allGalleryQuery = `
  *[_type == "gallery"] | order(order asc) {
    _id,
    _type,
    title,
    description,
    category,
    mediaItems[] {
      _type,
      _key,
      image,
      alt,
      caption,
      video,
      poster,
      url,
      platform,
      title,
      description,
      thumbnail
    },
    order,
    isActive,
    tags,
    date,
    _createdAt,
    _updatedAt
  }
`;

// Gallery arama
export const searchGalleryQuery = `
  *[_type == "gallery" && isActive == true && (
    title match $query + "*" ||
    description match $query + "*" ||
    tags[] match $query + "*"
  )] | order(order asc) {
    _id,
    _type,
    title,
    description,
    category,
    mediaItems[] {
      _type,
      _key,
      image,
      alt,
      caption,
      video,
      poster,
      url,
      platform,
      title,
      description,
      thumbnail
    },
    order,
    isActive,
    tags,
    date,
    _createdAt,
    _updatedAt
  }
`;

// Tek bir gallery getir
export const singleGalleryQuery = `
  *[_type == "gallery" && _id == $id] {
    _id,
    _type,
    title,
    description,
    category,
    mediaItems[] {
      _type,
      _key,
      image,
      alt,
      caption,
      video,
      poster,
      url,
      platform,
      title,
      description,
      thumbnail
    },
    order,
    isActive,
    tags,
    date,
    _createdAt,
    _updatedAt
  }[0]
`;

// Sadece resimler
export const galleryImagesQuery = `
  *[_type == "gallery" && isActive == true] {
    _id,
    title,
    category,
    mediaItems[] {
      _type,
      _key,
      image,
      alt,
      caption
    }[0...10]
  }
`;
