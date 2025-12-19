// Tüm aktif FAQ'ları getir
export const activeFaqsQuery = `
  *[_type == "faq" && isActive == true] | order(order asc) {
    _id,
    _type,
    question,
    answer,
    category,
    order,
    isActive,
    _createdAt,
    _updatedAt
  }
`;

// Kategoriye göre FAQ'lar
export const faqsByCategoryQuery = `
  *[_type == "faq" && isActive == true && category == $category] | order(order asc) {
    _id,
    _type,
    question,
    answer,
    category,
    order,
    isActive,
    _createdAt,
    _updatedAt
  }
`;

// Tüm FAQ'ları getir (admin için)
export const allFaqsQuery = `
  *[_type == "faq"] | order(order asc) {
    _id,
    _type,
    question,
    answer,
    category,
    order,
    isActive,
    _createdAt,
    _updatedAt
  }
`;

// FAQ arama
export const searchFaqsQuery = `
  *[_type == "faq" && isActive == true && (
    question match $query + "*" ||
    answer match $query + "*"
  )] | order(order asc) {
    _id,
    _type,
    question,
    answer,
    category,
    order,
    isActive,
    _createdAt,
    _updatedAt
  }
`;

// Admin FAQ arama
export const searchAllFaqsQuery = `
  *[_type == "faq" && (
    question match $query + "*" ||
    answer match $query + "*"
  )] | order(order asc) {
    _id,
    _type,
    question,
    answer,
    category,
    order,
    isActive,
    _createdAt,
    _updatedAt
  }
`;
