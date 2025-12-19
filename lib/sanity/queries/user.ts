// Tüm aktif kullanıcıları getir
export const activeUsersQuery = `
  *[_type == "user" && isActive == true] | order(order asc, firstName asc, lastName asc) {
    _id,
    _type,
    firstName,
    lastName,
    email,
    profileImage {
      _type,
      asset {
        _ref,
        _type
      }
    },
    isActive,
    title,
    category,
    order,
    _createdAt,
    _updatedAt
  }
`;

// Tüm kullanıcıları getir (admin için)
export const allUsersQuery = `
  *[_type == "user"] | order(order asc, firstName asc, lastName asc) {
    _id,
    _type,
    firstName,
    lastName,
    email,
    profileImage {
      _type,
      asset {
        _ref,
        _type
      }
    },
    isActive,
    title,
    category,
    order,
    _createdAt,
    _updatedAt
  }
`;

// Role göre kullanıcıları getir
export const usersByRoleQuery = `
  *[_type == "user" && isActive == true && role == $role] | order(order asc, firstName asc, lastName asc) {
    _id,
    _type,
    firstName,
    lastName,
    email,
    profileImage {
      _type,
      asset {
        _ref,
        _type
      }
    },
    isActive,
    title,
    category,
    order,
    _createdAt,
    _updatedAt
  }
`;

// Kullanıcı arama
export const searchUsersQuery = `
  *[_type == "user" && isActive == true && (
    firstName match $query + "*" ||
    lastName match $query + "*" ||
    email match $query + "*"
  )] | order(order asc, firstName asc, lastName asc) {
    _id,
    _type,
    firstName,
    lastName,
    email,
    profileImage {
      _type,
      asset {
        _ref,
        _type
      }
    },
    isActive,
    title,
    category,
    order,
    _createdAt,
    _updatedAt
  }
`;

// Tek bir kullanıcı getir
export const singleUserQuery = `
  *[_type == "user" && _id == $id] {
    _id,
    _type,
    firstName,
    lastName,
    email,
    profileImage {
      _type,
      asset {
        _ref,
        _type
      }
    },
    isActive,
    title,
    category,
    order,
    _createdAt,
    _updatedAt
  }[0]
`;

// E-posta ile kullanıcı getir
export const userByEmailQuery = `
  *[_type == "user" && email == $email] {
    _id,
    _type,
    firstName,
    lastName,
    email,
    profileImage {
      _type,
      asset {
        _ref,
        _type
      }
    },
    isActive,
    title,
    category,
    order,
    _createdAt,
    _updatedAt
  }[0]
`;

// Admin kullanıcıları getir (title ile filtreleme)
export const adminUsersQuery = `
  *[_type == "user" && isActive == true && title match "*admin*" || title match "*başkan*"] | order(order asc, firstName asc, lastName asc) {
    _id,
    _type,
    firstName,
    lastName,
    email,
    profileImage {
      _type,
      asset {
        _ref,
        _type
      }
    },
    isActive,
    title,
    category,
    order,
    _createdAt,
    _updatedAt
  }
`;

// Kategoriye göre kullanıcıları getir
export const usersByCategoryQuery = `
  *[_type == "user" && isActive == true && category == $category] | order(order asc, firstName asc, lastName asc) {
    _id,
    _type,
    firstName,
    lastName,
    email,
    profileImage {
      _type,
      asset {
        _ref,
        _type
      }
    },
    isActive,
    title,
    category,
    order,
    _createdAt,
    _updatedAt
  }
`;

// HSD Management kategorisindeki kullanıcıları getir
export const hsdUsersQuery = `
  *[_type == "user" && isActive == true && category == "HSD_MANAGEMENT"] | order(order asc, firstName asc, lastName asc) {
    _id,
    _type,
    firstName,
    lastName,
    email,
    profileImage {
      _type,
      asset {
        _ref,
        _type
      }
    },
    isActive,
    title,
    category,
    order,
    _createdAt,
    _updatedAt
  }
`;
