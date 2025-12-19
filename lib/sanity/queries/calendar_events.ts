const calendarEventFields = `
  _id,
  _type,
  title,
  description,
  startDate,
  endDate,
  location,
  "image": image.asset->url,
  // Compute fields to match app expectations
  "capacity": coalesce(maxParticipants, 0),
  "registeredCount": 0,
  "status": select(isPublished == true => "published", isPublished == false => "draft", "draft"),
  "slug": slug.current,
  category,
  tags,
  // Current schema stores organizer as a string; wrap as an object with name
  "organizer": select(defined(organizer) => {"name": organizer}, null),
  _createdAt,
  _updatedAt
`;

// Tüm yayınlanmış calendar eventleri getir
export const publishedCalendarEventsQuery = `
  *[_type == "event" && isPublished == true] | order(startDate asc) {
    ${calendarEventFields}
  }
`;

// Tüm calendar eventleri getir (admin için)
export const allCalendarEventsQuery = `
  *[_type == "event"] | order(_createdAt desc) {
    ${calendarEventFields}
  }
`;

// Tek bir calendar event getir
export const calendarEventBySlugQuery = `
  *[_type == "event" && slug.current == $slug][0] {
    ${calendarEventFields}
  }
`;

// Calendar event arama
export const searchCalendarEventsQuery = `
  *[_type == "event" && isPublished == true && (
    title match $query + "*" ||
    description match $query + "*" ||
    location match $query + "*"
  )] | order(startDate asc) {
    ${calendarEventFields}
  }
`;

// Admin calendar event arama
export const searchAllCalendarEventsQuery = `
  *[_type == "event" && (
    title match $query + "*" ||
    description match $query + "*" ||
    location match $query + "*"
  )] | order(_createdAt desc) {
    ${calendarEventFields}
  }
`;

// Kategoriye göre calendar eventler
export const calendarEventsByCategoryQuery = `
  *[_type == "event" && isPublished == true && category == $category] | order(startDate asc) {
    ${calendarEventFields}
  }
`;
