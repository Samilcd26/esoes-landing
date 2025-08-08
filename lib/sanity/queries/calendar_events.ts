// Tüm yayınlanmış calendar eventleri getir
export const publishedCalendarEventsQuery = `
  *[_type == "calendar_event" && status == "published"] | order(startDate asc) {
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

// Tüm calendar eventleri getir (admin için)
export const allCalendarEventsQuery = `
  *[_type == "calendar_event"] | order(_createdAt desc) {
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

// Tek bir calendar event getir
export const calendarEventBySlugQuery = `
  *[_type == "calendar_event" && slug.current == $slug][0] {
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

// Calendar event arama
export const searchCalendarEventsQuery = `
  *[_type == "calendar_event" && status == "published" && (
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

// Admin calendar event arama
export const searchAllCalendarEventsQuery = `
  *[_type == "calendar_event" && (
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

// Kategoriye göre calendar eventler
export const calendarEventsByCategoryQuery = `
  *[_type == "calendar_event" && status == "published" && category == $category] | order(startDate asc) {
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
