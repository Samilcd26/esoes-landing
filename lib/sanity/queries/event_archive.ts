// Tüm arşiv eventleri getir
export const publishedEventArchiveQuery = `
  *[_type == "event_archive"] | order(_createdAt desc) {
    _id,
    _type,
    title,
    description,
    "slug": slug.current,
    mediaResources[]{
      type,
      "image": image.asset->url,
      imageUrl,
      "video": video.asset->url,
      videoUrl,
      youtubeUrl,
      "document": document.asset->url,
      documentUrl,
      externalUrl,
      order
    },
    _createdAt,
    _updatedAt
  }
`;

// Tüm arşiv eventleri getir (admin için)
export const allEventArchiveQuery = `
  *[_type == "event_archive"] | order(_createdAt desc) {
    _id,
    _type,
    title,
    description,
    "slug": slug.current,
    mediaResources[]{
      type,
      "image": image.asset->url,
      imageUrl,
      "video": video.asset->url,
      videoUrl,
      youtubeUrl,
      "document": document.asset->url,
      documentUrl,
      externalUrl,
      order
    },
    _createdAt,
    _updatedAt
  }
`;

// Tek bir arşiv event getir
export const eventArchiveBySlugQuery = `
  *[_type == "event_archive" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    description,
    "slug": slug.current,
    mediaResources[] | order(order asc) {
      type,
      "image": image.asset->url,
      imageUrl,
      "video": video.asset->url,
      videoUrl,
      youtubeUrl,
      "document": document.asset->url,
      documentUrl,
      externalUrl,
      order
    },
    _createdAt,
    _updatedAt
  }
`;

// Arşiv event arama
export const searchEventArchiveQuery = `
  *[_type == "event_archive" && (
    title match $query + "*" ||
    description match $query + "*"
  )] | order(_createdAt desc) {
    _id,
    _type,
    title,
    description,
    "slug": slug.current,
    mediaResources[]{
      type,
      "image": image.asset->url,
      imageUrl,
      "video": video.asset->url,
      videoUrl,
      youtubeUrl,
      "document": document.asset->url,
      documentUrl,
      externalUrl,
      order
    },
    _createdAt,
    _updatedAt
  }
`;

// Admin arşiv event arama
export const searchAllEventArchiveQuery = `
  *[_type == "event_archive" && (
    title match $query + "*" ||
    description match $query + "*"
  )] | order(_createdAt desc) {
    _id,
    _type,
    title,
    description,
    "slug": slug.current,
    mediaResources[]{
      type,
      "image": image.asset->url,
      imageUrl,
      "video": video.asset->url,
      videoUrl,
      youtubeUrl,
      "document": document.asset->url,
      documentUrl,
      externalUrl,
      order
    },
    _createdAt,
    _updatedAt
  }
`;

// Tüm arşiv eventler (kategori kaldırıldı)
export const eventArchiveByCategoryQuery = `
  *[_type == "event_archive"] | order(_createdAt desc) {
    _id,
    _type,
    title,
    description,
    "slug": slug.current,
    mediaResources[]{
      type,
      "image": image.asset->url,
      imageUrl,
      "video": video.asset->url,
      videoUrl,
      youtubeUrl,
      "document": document.asset->url,
      documentUrl,
      externalUrl,
      order
    },
    _createdAt,
    _updatedAt
  }
`;

// Tüm arşiv eventler (yıl filtresi kaldırıldı)
export const eventArchiveByYearQuery = `
  *[_type == "event_archive"] | order(_createdAt desc) {
    _id,
    _type,
    title,
    description,
    "slug": slug.current,
    mediaResources[]{
      type,
      "image": image.asset->url,
      imageUrl,
      "video": video.asset->url,
      videoUrl,
      youtubeUrl,
      "document": document.asset->url,
      documentUrl,
      externalUrl,
      order
    },
    _createdAt,
    _updatedAt
  }
`;
