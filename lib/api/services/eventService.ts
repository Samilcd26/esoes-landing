import { supabase, typedSupabase } from '../client';
import { 
  Event, 
  CreateEventRequest, 
  PaginationParams, 
  PaginatedResponse,
} from '../../types/api';

export const eventService = {
  // Tüm eventleri getir
  async getEvents(params?: PaginationParams): Promise<PaginatedResponse<Event>> {
    let query = typedSupabase
      .from('events')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .order('start_date', { ascending: true });

    // Pagination
    if (params?.page && params?.limit) {
      const from = (params.page - 1) * params.limit;
      const to = from + params.limit - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    // Database field'larını API field'larına çevir
    const mappedData = (data || []).map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      startDate: event.start_date,
      endDate: event.end_date,
      location: event.location,
      image: event.image_url,
      capacity: event.capacity,
      registeredCount: event.registered_count,
      status: event.status,
      created_at: event.created_at,
      updated_at: event.updated_at
    }));

    return {
      data: mappedData,
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / (params?.limit || 10))
      }
    };
  },

  // ADMIN: Tüm eventleri getir (draft dahil)
  async getAllEvents(params?: PaginationParams): Promise<PaginatedResponse<Event>> {
    let query = typedSupabase
      .from('events')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Pagination
    if (params?.page && params?.limit) {
      const from = (params.page - 1) * params.limit;
      const to = from + params.limit - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    // Database field'larını API field'larına çevir
    const mappedData = (data || []).map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      startDate: event.start_date,
      endDate: event.end_date,
      location: event.location,
      image: event.image_url,
      capacity: event.capacity,
      registeredCount: event.registered_count,
      status: event.status,
      created_at: event.created_at,
      updated_at: event.updated_at
    }));

    return {
      data: mappedData,
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / (params?.limit || 10))
      }
    };
  },

  // Takvim için eventleri getir (yayınlanan)
  async getCalendarEvents(): Promise<Event[]> {
    const { data, error } = await typedSupabase
      .from('events')
      .select('*')
      .eq('status', 'published')
      .order('start_date', { ascending: true });

    if (error) throw error;
    
    // Database field'larını API field'larına çevir
    return (data || []).map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      startDate: event.start_date,
      endDate: event.end_date,
      location: event.location,
      image: event.image_url,
      capacity: event.capacity,
      registeredCount: event.registered_count,
      status: event.status,
      created_at: event.created_at,
      updated_at: event.updated_at
    }));
  },

  // ADMIN: Takvim için tüm eventleri getir (draft dahil)
  async getAllCalendarEvents(): Promise<Event[]> {
    const { data, error } = await typedSupabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) throw error;
    
    // Database field'larını API field'larına çevir
    return (data || []).map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      startDate: event.start_date,
      endDate: event.end_date,
      location: event.location,
      image: event.image_url,
      capacity: event.capacity,
      registeredCount: event.registered_count,
      status: event.status,
      created_at: event.created_at,
      updated_at: event.updated_at
    }));
  },

  // Tek bir event getir
  async getEvent(id: string): Promise<Event> {
    const { data, error } = await typedSupabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Yeni event oluştur
  async createEvent(eventData: CreateEventRequest): Promise<Event> {
    const { data, error } = await typedSupabase
      .from('events')
      .insert({
        title: eventData.title,
        description: eventData.description,
        start_date: eventData.startDate,
        end_date: eventData.endDate,
        location: eventData.location,
        image_url: eventData.image,
        capacity: eventData.capacity,
        status: 'draft'
      })
      .select()
      .single();

    if (error) throw error;
    
    // Database field'larını API field'larına çevir
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      startDate: data.start_date,
      endDate: data.end_date,
      location: data.location,
      image: data.image_url,
      capacity: data.capacity,
      registeredCount: data.registered_count,
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  },

  // Event güncelle
  async updateEvent(id: string, eventData: Partial<CreateEventRequest>): Promise<Event> {
    const updateData: Partial<CreateEventRequest> = {};
    
    if (eventData.title) updateData.title = eventData.title;
    if (eventData.description) updateData.description = eventData.description;
    if (eventData.startDate) updateData.startDate = eventData.startDate;
    if (eventData.endDate) updateData.endDate = eventData.endDate;
    if (eventData.location) updateData.location = eventData.location;
    if (eventData.image) updateData.image = eventData.image;
    if (eventData.capacity) updateData.capacity = eventData.capacity;

    const { data, error } = await typedSupabase
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    // Database field'larını API field'larına çevir
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      startDate: data.start_date,
      endDate: data.end_date,
      location: data.location,
      image: data.image_url,
      capacity: data.capacity,
      registeredCount: data.registered_count,
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  },

  // ADMIN: Event durumunu değiştir
  async updateEventStatus(id: string, status: 'draft' | 'published' | 'cancelled'): Promise<Event> {
    const { data, error } = await typedSupabase
      .from('events')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    // Database field'larını API field'larına çevir
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      startDate: data.start_date,
      endDate: data.end_date,
      location: data.location,
      image: data.image_url,
      capacity: data.capacity,
      registeredCount: data.registered_count,
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  },

  // Event sil
  async deleteEvent(id: string): Promise<void> {
    const { error } = await typedSupabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Event'e kayıt ol
  async registerForEvent(eventId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await typedSupabase
      .from('event_registrations')
      .insert({
        event_id: eventId,
        user_id: user.id
      });

    if (error) throw error;

    // Event'in registered_count'unu artır
    await typedSupabase.rpc('increment_event_registration_count', { event_id: eventId });
  },

  // Event kaydını iptal et
  async unregisterFromEvent(eventId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await typedSupabase
      .from('event_registrations')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', user.id);

    if (error) throw error;

    // Event'in registered_count'unu azalt
    await typedSupabase.rpc('decrement_event_registration_count', { event_id: eventId });
  },

  // Kullanıcının kayıt olduğu eventleri getir
  async getUserEvents(): Promise<Event[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await typedSupabase
      .from('events')
      .select(`
        *,
        event_registrations!inner(user_id)
      `)
      .eq('event_registrations.user_id', user.id)
      .order('start_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Event arama
  async searchEvents(query: string, params?: PaginationParams): Promise<PaginatedResponse<Event>> {
    let searchQuery = typedSupabase
      .from('events')
      .select('*')
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)
      .order('start_date', { ascending: true });

    // Pagination
    if (params?.page && params?.limit) {
      const from = (params.page - 1) * params.limit;
      const to = from + params.limit - 1;
      searchQuery = searchQuery.range(from, to);
    }

    const { data, error, count } = await searchQuery;

    if (error) throw error;

    return {
      data: data || [],
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / (params?.limit || 10))
      }
    };
  },

  // ADMIN: Event arama (tüm statuslar dahil)
  async searchAllEvents(query: string, params?: PaginationParams): Promise<PaginatedResponse<Event>> {
    let searchQuery = typedSupabase
      .from('events')
      .select('*', { count: 'exact' })
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    // Pagination
    if (params?.page && params?.limit) {
      const from = (params.page - 1) * params.limit;
      const to = from + params.limit - 1;
      searchQuery = searchQuery.range(from, to);
    }

    const { data, error, count } = await searchQuery;

    if (error) throw error;

    return {
      data: data || [],
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / (params?.limit || 10))
      }
    };
  },

  // Kullanıcının bir event'e kayıtlı olup olmadığını kontrol et
  async isUserRegisteredForEvent(eventId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await typedSupabase
      .from('event_registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return !!data;
  }
}; 