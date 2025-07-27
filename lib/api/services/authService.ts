import { supabase } from '../client';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../../types/api';

export const authService = {
  // Kullanıcı girişi
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    if (error) throw error;
    return {
      user: {
        id: data.user?.id || '',
        email: data.user?.email || '',
        first_name: data.user?.user_metadata?.first_name || '',
        last_name: data.user?.user_metadata?.last_name || '',
        role: data.user?.user_metadata?.role || 'user',
        avatar_url: data.user?.user_metadata?.avatar_url || '',
        created_at: data.user?.created_at || '',
        updated_at: data.user?.updated_at || '',
      },
      token: data.session?.access_token || ''
    };
  },

  // Kullanıcı kaydı
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (error) throw error;

    // Kullanıcı profilini oluştur
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user?.id,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: 'user'
      })
      .select()
      .single();

    if (profileError) throw profileError;

    return {
      user: profileData,
      token: data.session?.access_token || ''
    };
  },

  // Kullanıcı çıkışı
  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Mevcut kullanıcıyı al
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Kullanıcıyı users tablosundan al
    const { data: userProfile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      // Eğer kullanıcı users tablosunda yoksa, otomatik olarak oluştur
      return await this.createUserProfile(user);
    }

    return {
      id: userProfile.id,
      email: userProfile.email,
      first_name: userProfile.first_name,
      last_name: userProfile.last_name,
      role: userProfile.role,
      avatar_url: userProfile.avatar_url,
      created_at: userProfile.created_at,
      updated_at: userProfile.updated_at,
    };
  },

  // Kullanıcı profilini oluştur (eğer yoksa)
  async createUserProfile(authUser: any): Promise<User> {
    const { data: userProfile, error } = await supabase
      .from('users')
      .insert({
        id: authUser.id,
        email: authUser.email,
        first_name: authUser.user_metadata?.first_name || '',
        last_name: authUser.user_metadata?.last_name || '',
        role: authUser.user_metadata?.role || 'user',
        avatar_url: authUser.user_metadata?.avatar_url || '',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
      throw new Error('Kullanıcı profili oluşturulamadı');
    }

    return {
      id: userProfile.id,
      email: userProfile.email,
      first_name: userProfile.first_name,
      last_name: userProfile.last_name,
      role: userProfile.role,
      avatar_url: userProfile.avatar_url,
      created_at: userProfile.created_at,
      updated_at: userProfile.updated_at,
    };
  },

  // Kullanıcı profilinin var olduğundan emin ol
  async ensureUserProfile(): Promise<User> {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new Error('Kullanıcı girişi yapılmamış');
    }
    return user;
  },

  // Kullanıcı profilini güncelle
  async updateProfile(updates: Partial<User>): Promise<User> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Şifre sıfırlama
  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
  },

  // Yeni şifre belirleme
  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
  },

  // Email doğrulama
  async verifyEmail(token: string): Promise<void> {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email'
    });

    if (error) throw error;
  },

  // Session'ı yenile
  async refreshSession(): Promise<void> {
    const { error } = await supabase.auth.refreshSession();
    if (error) throw error;
  },

  // Auth state değişikliklerini dinle
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}; 