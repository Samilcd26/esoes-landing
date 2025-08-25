import { sanityQuery } from '../sanity/client';
import { 
  activeDepartmentsQuery, 
  allDepartmentsQuery, 
  departmentBySlugQuery,
  searchDepartmentsQuery,
  searchAllDepartmentsQuery,
  activeDepartmentsByCategoryQuery,
} from '../sanity/queries/departments';
import { Department,  PaginationParams, PaginatedResponse } from '../types/api';

// Sanity Department tipi
export interface SanityDepartment {
  _id: string;
  _type: string;
  name: string;
  description: string;
  category?: 'HSD' | 'GENERAL';
  images?: Array<{
    url: string;
    alt?: string;
  }>;
  responsible: Array<{
    firstName: string;
    lastName: string;
    title?: string;
    image?: string;
    phone?: string;
    email?: string;
  }>;
  assistant?: Array<{
    firstName: string;
    lastName: string;
    title?: string;
    image?: string;
    phone?: string;
    email?: string;
  }>;
  slug: string;
  isActive: boolean;
  order: number;
  _createdAt: string;
  _updatedAt: string;
}

// Sanity department'ı API department'ına çevir
const mapSanityDepartmentToApiDepartment = (sanityDepartment: SanityDepartment): Department => ({
  id: sanityDepartment._id,
  name: sanityDepartment.name,
  description: sanityDepartment.description,
  category: sanityDepartment.category || 'GENERAL',
  images: sanityDepartment.images,
  responsible: sanityDepartment.responsible,
  assistant: sanityDepartment.assistant,
  slug: sanityDepartment.slug,
  isActive: sanityDepartment.isActive,
  order: sanityDepartment.order,
  created_at: sanityDepartment._createdAt,
  updated_at: sanityDepartment._updatedAt
});

export const sanityDepartmentService = {
  // Tüm aktif department'ları getir
  async getDepartments(params?: PaginationParams): Promise<PaginatedResponse<Department>> {
    const departments = await sanityQuery<SanityDepartment[]>(activeDepartmentsQuery);
    
    // Pagination işlemi
    const page = params?.page || 1;
    const limit = params?.limit || 100; // Increased from 10 to 100
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDepartments = departments.slice(startIndex, endIndex);

    return {
      data: paginatedDepartments.map(mapSanityDepartmentToApiDepartment),
      pagination: {
        page,
        limit,
        total: departments.length,
        totalPages: Math.ceil(departments.length / limit)
      }
    };
  },

  async getDepartmentsByCategory(category: 'HSD' | 'GENERAL', params?: PaginationParams): Promise<PaginatedResponse<Department>> {
    const departments = await sanityQuery<SanityDepartment[]>(activeDepartmentsByCategoryQuery, { category });
    const page = params?.page || 1;
    const limit = params?.limit || 100; // Increased from 10 to 100
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDepartments = departments.slice(startIndex, endIndex);

    return {
      data: paginatedDepartments.map(mapSanityDepartmentToApiDepartment),
      pagination: {
        page,
        limit,
        total: departments.length,
        totalPages: Math.ceil(departments.length / limit)
      }
    };
  },

  // ADMIN: Tüm department'ları getir
  async getAllDepartments(params?: PaginationParams): Promise<PaginatedResponse<Department>> {
    const departments = await sanityQuery<SanityDepartment[]>(allDepartmentsQuery);
    
    // Pagination işlemi
    const page = params?.page || 1;
    const limit = params?.limit || 100; // Increased from 10 to 100
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDepartments = departments.slice(startIndex, endIndex);

    return {
      data: paginatedDepartments.map(mapSanityDepartmentToApiDepartment),
      pagination: {
        page,
        limit,
        total: departments.length,
        totalPages: Math.ceil(departments.length / limit)
      }
    };
  },

  // Slug'a göre department getir
  async getDepartment(slug: string): Promise<Department> {
    const department = await sanityQuery<SanityDepartment>(departmentBySlugQuery, { slug });
    if (!department) throw new Error('Department not found');
    return mapSanityDepartmentToApiDepartment(department);
  },

  // Department arama
  async searchDepartments(query: string, params?: PaginationParams): Promise<PaginatedResponse<Department>> {
    const departments = await sanityQuery<SanityDepartment[]>(searchDepartmentsQuery, { query });
    
    // Pagination işlemi
    const page = params?.page || 1;
    const limit = params?.limit || 100; // Increased from 10 to 100
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDepartments = departments.slice(startIndex, endIndex);

    return {
      data: paginatedDepartments.map(mapSanityDepartmentToApiDepartment),
      pagination: {
        page,
        limit,
        total: departments.length,
        totalPages: Math.ceil(departments.length / limit)
      }
    };
  },

  // ADMIN: Department arama
  async searchAllDepartments(query: string, params?: PaginationParams): Promise<PaginatedResponse<Department>> {
    const departments = await sanityQuery<SanityDepartment[]>(searchAllDepartmentsQuery, { query });
    
    // Pagination işlemi
    const page = params?.page || 1;
    const limit = params?.limit || 100; // Increased from 10 to 100
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDepartments = departments.slice(startIndex, endIndex);

    return {
      data: paginatedDepartments.map(mapSanityDepartmentToApiDepartment),
      pagination: {
        page,
        limit,
        total: departments.length,
        totalPages: Math.ceil(departments.length / limit)
      }
    };
  },

};
