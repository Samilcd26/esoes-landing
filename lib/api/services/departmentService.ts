import { supabase } from '../client';
import { 
  Department, 
  CreateDepartmentRequest, 
  UpdateDepartmentRequest, 
  DepartmentStatistics, 
  User
} from '../../types/api';

export const departmentService = {
  // Tüm departmanları getir
  async getAllDepartments(): Promise<Department[]> {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  // Departman istatistikleri getir
  async getDepartmentStatistics(): Promise<DepartmentStatistics[]> {
    const { data, error } = await supabase
      .rpc('get_department_statistics');
    
    if (error) throw error;
    return data || [];
  },

  // Departman üyelerini getir
  async getDepartmentMembers(departmentId: string): Promise<User[]> {
    const { data, error } = await supabase
      .rpc('get_department_members', { dept_id: departmentId });
    
    if (error) throw error;
    return data || [];
  },

  // Yeni departman oluştur
  async createDepartment(departmentData: CreateDepartmentRequest): Promise<Department> {
    const { data, error } = await supabase
      .from('departments')
      .insert(departmentData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Departman güncelle
  async updateDepartment(id: string, departmentData: UpdateDepartmentRequest): Promise<Department> {
    const { data, error } = await supabase
      .from('departments')
      .update(departmentData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Departman sil
  async deleteDepartment(id: string): Promise<void> {
    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Kullanıcıyı departmana ata
  async assignUserToDepartment(userId: string, departmentId: string): Promise<string> {
    const { data, error } = await supabase
      .rpc('assign_user_to_department', { 
        user_id: userId, 
        dept_id: departmentId 
      });
    
    if (error) throw error;
    return data;
  },

  // Kullanıcıyı departmandan çıkar
  async removeUserFromDepartment(userId: string): Promise<string> {
    const { data, error } = await supabase
      .rpc('remove_user_from_department', { user_id: userId });
    
    if (error) throw error;
    return data;
  },

  // Departman bilgisi ile kullanıcıları getir
  async getUsersWithDepartment(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        department:departments(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Departmansız kullanıcıları getir
  async getUsersWithoutDepartment(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        department:departments(*)
      `)
      .is('department_id', null)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Belirli bir departmandaki kullanıcıları getir
  async getUsersByDepartment(departmentId: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        department:departments(*)
      `)
      .eq('department_id', departmentId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Belirli bir departmanı getir
  async getDepartmentById(id: string): Promise<Department> {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
}; 