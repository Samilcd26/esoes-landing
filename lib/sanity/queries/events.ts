// Tüm yayınlanmış eventleri getir
export const publishedEventsQuery = `
  *[_type == "event" && status == "published"] | order(startDate asc) {
    _id,
    _type,
    title,
    description,
    startDate,
    endDate,
    location,
    "image": image.asset->url,
    capacity,
    registeredCount,
    status,
    "slug": slug.current,
    category,
    tags,
    "organizer": organizer->{
      _id,
      name,
      "avatar": avatar.asset->url
    },
    _createdAt,
    _updatedAt
  }
`;

// Tüm eventleri getir (admin için)
export const allEventsQuery = `
  *[_type == "event"] | order(_createdAt desc) {
    _id,
    _type,
    title,
    description,
    startDate,
    endDate,
    location,
    "image": image.asset->url,
    capacity,
    registeredCount,
    status,
    "slug": slug.current,
    category,
    tags,
    "organizer": organizer->{
      _id,
      name,
      "avatar": avatar.asset->url
    },
    _createdAt,
    _updatedAt
  }
`;

// Tek bir event getir
export const eventBySlugQuery = `
  *[_type == "event" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    description,
    startDate,
    endDate,
    location,
    "image": image.asset->url,
    capacity,
    registeredCount,
    status,
    "slug": slug.current,
    category,
    tags,
    "organizer": organizer->{
      _id,
      name,
      "avatar": avatar.asset->url
    },
    _createdAt,
    _updatedAt
  }
`;

// Event arama
export const searchEventsQuery = `
  *[_type == "event" && status == "published" && (
    title match $query + "*" ||
    description match $query + "*" ||
    location match $query + "*"
  )] | order(startDate asc) {
    _id,
    _type,
    title,
    description,
    startDate,
    endDate,
    location,
    "image": image.asset->url,
    capacity,
    registeredCount,
    status,
    "slug": slug.current,
    category,
    tags,
    "organizer": organizer->{
      _id,
      name,
      "avatar": avatar.asset->url
    },
    _createdAt,
    _updatedAt
  }
`;

// Admin event arama
export const searchAllEventsQuery = `
  *[_type == "event" && (
    title match $query + "*" ||
    description match $query + "*" ||
    location match $query + "*"
  )] | order(_createdAt desc) {
    _id,
    _type,
    title,
    description,
    startDate,
    endDate,
    location,
    "image": image.asset->url,
    capacity,
    registeredCount,
    status,
    "slug": slug.current,
    category,
    tags,
    "organizer": organizer->{
      _id,
      name,
      "avatar": avatar.asset->url
    },
    _createdAt,
    _updatedAt
  }
`;

// Kategoriye göre eventler
export const eventsByCategoryQuery = `
  *[_type == "event" && status == "published" && category == $category] | order(startDate asc) {
    _id,
    _type,
    title,
    description,
    startDate,
    endDate,
    location,
    "image": image.asset->url,
    capacity,
    registeredCount,
    status,
    "slug": slug.current,
    category,
    tags,
    "organizer": organizer->{
      _id,
      name,
      "avatar": avatar.asset->url
    },
    _createdAt,
    _updatedAt
  }
`;
