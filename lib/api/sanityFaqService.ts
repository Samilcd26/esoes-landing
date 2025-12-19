import { FaqCategory } from '@/lib/types/enum';
import { sanityQuery } from '../sanity/client';
import { 
  activeFaqsQuery, 
  allFaqsQuery, 
  faqsByCategoryQuery,
  searchFaqsQuery,
  searchAllFaqsQuery
} from '../sanity/queries/faqs';
import { Faq,  PaginationParams, PaginatedResponse } from '../types/api';

// Sanity FAQ tipi
export interface SanityFaq {
  _id: string;
  _type: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
  _createdAt: string;
  _updatedAt: string;
}

// Sanity FAQ'yu API FAQ'suna çevir
const mapSanityFaqToApiFaq = (sanityFaq: SanityFaq): Faq => ({
  id: sanityFaq._id,
  question: sanityFaq.question,
  answer: sanityFaq.answer,
  category: sanityFaq.category as unknown as FaqCategory,
  order: sanityFaq.order,
  created_at: sanityFaq._createdAt,
  updated_at: sanityFaq._updatedAt
});

export const sanityFaqService = {
  // Tüm aktif FAQ'ları getir
  async getFaqs(params?: PaginationParams): Promise<PaginatedResponse<Faq>> {
    const faqs = await sanityQuery<SanityFaq[]>(activeFaqsQuery);
    
    // Pagination işlemi
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFaqs = faqs.slice(startIndex, endIndex);

    return {
      data: paginatedFaqs.map(mapSanityFaqToApiFaq),
      pagination: {
        page,
        limit,
        total: faqs.length,
        totalPages: Math.ceil(faqs.length / limit)
      }
    };
  },

  // ADMIN: Tüm FAQ'ları getir
  async getAllFaqs(params?: PaginationParams): Promise<PaginatedResponse<Faq>> {
    const faqs = await sanityQuery<SanityFaq[]>(allFaqsQuery);
    
    // Pagination işlemi
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFaqs = faqs.slice(startIndex, endIndex);

    return {
      data: paginatedFaqs.map(mapSanityFaqToApiFaq),
      pagination: {
        page,
        limit,
        total: faqs.length,
        totalPages: Math.ceil(faqs.length / limit)
      }
    };
  },

  // Kategoriye göre FAQ'lar
  async getFaqsByCategory(category: string): Promise<Faq[]> {
    const faqs = await sanityQuery<SanityFaq[]>(faqsByCategoryQuery, { category });
    return faqs.map(mapSanityFaqToApiFaq);
  },

  // FAQ arama
  async searchFaqs(query: string, params?: PaginationParams): Promise<PaginatedResponse<Faq>> {
    const faqs = await sanityQuery<SanityFaq[]>(searchFaqsQuery, { query });
    
    // Pagination işlemi
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFaqs = faqs.slice(startIndex, endIndex);

    return {
      data: paginatedFaqs.map(mapSanityFaqToApiFaq),
      pagination: {
        page,
        limit,
        total: faqs.length,
        totalPages: Math.ceil(faqs.length / limit)
      }
    };
  },

  // ADMIN: FAQ arama
  async searchAllFaqs(query: string, params?: PaginationParams): Promise<PaginatedResponse<Faq>> {
    const faqs = await sanityQuery<SanityFaq[]>(searchAllFaqsQuery, { query });
    
    // Pagination işlemi
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFaqs = faqs.slice(startIndex, endIndex);

    return {
      data: paginatedFaqs.map(mapSanityFaqToApiFaq),
      pagination: {
        page,
        limit,
        total: faqs.length,
        totalPages: Math.ceil(faqs.length / limit)
      }
    };
  },

  

};
