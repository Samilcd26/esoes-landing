import {  typedSupabase } from '../client';
import { Faq, CreateFaqRequest, UpdateFaqRequest } from '../../types/api';

export const faqService = {
  // Tüm SSS'leri getir
  
  async getAllFaqs(): Promise<Faq[]> {
    const { data, error } = await typedSupabase
      .from('faqs')
      .select('*')
      .order('order', { ascending: true }); // Siparişe göre sırala
    
    if (error) throw error;
    return data || [];
  },

  // Belirli bir SSS'yi ID ile getir
  async getFaqById(id: string): Promise<Faq> {
    const { data, error } = await typedSupabase
      .from('faqs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Yeni SSS oluştur
  async createFaq(faqData: CreateFaqRequest): Promise<Faq> {
    const { data, error } = await typedSupabase
      .from('faqs')
      .insert(faqData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // SSS güncelle
  async updateFaq(id: string, faqData: UpdateFaqRequest): Promise<Faq> {
    const { data, error } = await typedSupabase
      .from('faqs')
      .update(faqData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // SSS sil
  async deleteFaq(id: string): Promise<void> {
    const { error } = await typedSupabase
      .from('faqs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};