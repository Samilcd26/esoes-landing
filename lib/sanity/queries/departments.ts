// Tüm aktif department'ları getir
export const activeDepartmentsQuery = `
  *[_type == "department" && isActive == true] | order(order asc) {
    _id,
    _type,
    name,
    description,
    category,
    "images": images[]{
      "url": asset->url,
      "alt": asset->altText
    },
    "responsible": responsible[]{
      firstName,
      lastName,
      title,
      "image": image.asset->url,
      phone,
      email
    },
    "assistant": assistant[]{
      firstName,
      lastName,
      title,
      "image": image.asset->url,
      phone,
      email
    },
    "slug": slug.current,
    isActive,
    order,
    _createdAt,
    _updatedAt
  }
`;

// Tüm department'ları getir (admin için)
export const allDepartmentsQuery = `
  *[_type == "department"] | order(order asc) {
    _id,
    _type,
    name,
    description,
    category,
    "images": images[]{
      "url": asset->url,
      "alt": asset->altText
    },
    "responsible": responsible[]{
      firstName,
      lastName,
      title,
      "image": image.asset->url,
      phone,
      email
    },
    "assistant": assistant[]{
      firstName,
      lastName,
      title,
      "image": image.asset->url,
      phone,
      email
    },
    "slug": slug.current,
    isActive,
    order,
    _createdAt,
    _updatedAt
  }
`;

// Slug'a göre department getir
export const departmentBySlugQuery = `
  *[_type == "department" && slug.current == $slug][0] {
    _id,
    _type,
    name,
    description,
    category,
    "images": images[]{
      "url": asset->url,
      "alt": asset->altText
    },
    "responsible": responsible[]{
      firstName,
      lastName,
      title,
      "image": image.asset->url,
      phone,
      email
    },
    "assistant": assistant[]{
      firstName,
      lastName,
      title,
      "image": image.asset->url,
      phone,
      email
    },
    "slug": slug.current,
    isActive,
    order,
    _createdAt,
    _updatedAt
  }
`;

// Department arama
export const searchDepartmentsQuery = `
  *[_type == "department" && isActive == true && (
    name match $query + "*" ||
    description match $query + "*" ||
    responsible[].firstName match $query + "*" ||
    responsible[].lastName match $query + "*" ||
    assistant[].firstName match $query + "*" ||
    assistant[].lastName match $query + "*"
  )] | order(order asc) {
    _id,
    _type,
    name,
    description,
    category,
    "images": images[]{
      "url": asset->url,
      "alt": asset->altText
    },
    "responsible": responsible[]{
      firstName,
      lastName,
      title,
      "image": image.asset->url,
      phone,
      email
    },
    "assistant": assistant[]{
      firstName,
      lastName,
      title,
      "image": image.asset->url,
      phone,
      email
    },
    "slug": slug.current,
    isActive,
    order,
    _createdAt,
    _updatedAt
  }
`;

// Admin department arama
export const searchAllDepartmentsQuery = `
  *[_type == "department" && (
    name match $query + "*" ||
    description match $query + "*" ||
    responsible[].firstName match $query + "*" ||
    responsible[].lastName match $query + "*" ||
    assistant[].firstName match $query + "*" ||
    assistant[].lastName match $query + "*"
  )] | order(order asc) {
    _id,
    _type,
    name,
    description,
    category,
    "images": images[]{
      "url": asset->url,
      "alt": asset->altText
    },
    "responsible": responsible[]{
      firstName,
      lastName,
      title,
      "image": image.asset->url,
      phone,
      email
    },
    "assistant": assistant[]{
      firstName,
      lastName,
      title,
      "image": image.asset->url,
      phone,
      email
    },
    "slug": slug.current,
    isActive,
    order,
    _createdAt,
    _updatedAt
  }
`;

// Kategoriye göre aktif department'ları getir
export const activeDepartmentsByCategoryQuery = `
  *[_type == "department" && isActive == true && coalesce(category, "GENERAL") == $category] | order(order asc) {
    _id,
    _type,
    name,
    description,
    category,
    "images": images[]{
      "url": asset->url,
      "alt": asset->altText
    },
    "responsible": responsible[]{
      firstName,
      lastName,
      title,
      "image": image.asset->url,
      phone,
      email
    },
    "assistant": assistant[]{
      firstName,
      lastName,
      title,
      "image": image.asset->url,
      phone,
      email
    },
    "slug": slug.current,
    isActive,
    order,
    _createdAt,
    _updatedAt
  }
`;
