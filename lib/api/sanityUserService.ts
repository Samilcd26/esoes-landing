/* eslint-disable @typescript-eslint/no-explicit-any */
import { sanityClient } from '../sanity/client'
import {
  activeUsersQuery,
  allUsersQuery,
  usersByRoleQuery,
  searchUsersQuery,
  singleUserQuery,
  userByEmailQuery,
  adminUsersQuery,
  usersByCategoryQuery,
  hsdUsersQuery,
} from '../sanity/queries/user'

export interface User {
  _id: string
  _type: string
  firstName: string
  lastName: string
  email?: string
  profileImage?: {
    _type: string
    asset: {
      _ref: string
      _type: string
    }
  }
  isActive: boolean
  title?: string
  category?: 'HSD_MANAGEMENT' | 'GENERAL_MANAGEMENT'
  order?: number
  _createdAt: string
  _updatedAt: string
}

export interface CreateUserData {
  firstName: string
  lastName: string
  email?: string
  profileImage?: any
  title?: string
  category?: 'HSD_MANAGEMENT' | 'GENERAL_MANAGEMENT'
}

export interface UpdateUserData {
  firstName?: string
  lastName?: string
  email?: string
  profileImage?: any
  isActive?: boolean
  title?: string
  category?: 'HSD_MANAGEMENT' | 'GENERAL_MANAGEMENT'
  order?: number
}

export class SanityUserService {
  // Tüm aktif kullanıcıları getir
  static async getActiveUsers(): Promise<User[]> {
    try {
      const users = await sanityClient.fetch(activeUsersQuery)
      return users
    } catch (error) {
      console.error('Error fetching active users:', error)
      throw error
    }
  }

  // Tüm kullanıcıları getir (admin için)
  static async getAllUsers(): Promise<User[]> {
    try {
      const users = await sanityClient.fetch(allUsersQuery)
      return users
    } catch (error) {
      console.error('Error fetching all users:', error)
      throw error
    }
  }

  // Role göre kullanıcıları getir
  static async getUsersByRole(role: 'admin' | 'editor' | 'user'): Promise<User[]> {
    try {
      const users = await sanityClient.fetch(usersByRoleQuery, { role })
      return users
    } catch (error) {
      console.error('Error fetching users by role:', error)
      throw error
    }
  }

  // Kullanıcı arama
  static async searchUsers(query: string): Promise<User[]> {
    try {
      const users = await sanityClient.fetch(searchUsersQuery, { query } as any)
      return users
    } catch (error) {
      console.error('Error searching users:', error)
      throw error
    }
  }

  // Tek bir kullanıcı getir
  static async getUserById(id: string): Promise<User | null> {
    try {
      const user = await sanityClient.fetch(singleUserQuery, { id }) as User | null
      return user
    } catch (error) {
      console.error('Error fetching user by id:', error)
      throw error
    }
  }

  // E-posta ile kullanıcı getir
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await sanityClient.fetch(userByEmailQuery, { email }) as User | null
      return user
    } catch (error) {
      console.error('Error fetching user by email:', error)
      throw error
    }
  }

  // Admin kullanıcıları getir
  static async getAdminUsers(): Promise<User[]> {
    try {
      const users = await sanityClient.fetch(adminUsersQuery)
      return users
    } catch (error) {
      console.error('Error fetching admin users:', error)
      throw error
    }
  }

  // Yeni kullanıcı oluştur
  static async createUser(userData: CreateUserData): Promise<User> {
    try {
      const user = await sanityClient.create({
        _type: 'user',
        ...userData,
        isActive: true,
        title: userData.title,
      }) as User
      return user
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  // Kullanıcı güncelle
  static async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    try {
      const user = await sanityClient
        .patch(id)
        .set(userData)
        .commit() as User
      return user
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  // Kullanıcı sil (soft delete - isActive false yap)
  static async deleteUser(id: string): Promise<User> {
    try {
      const user = await sanityClient
        .patch(id)
        .set({ isActive: false })
        .commit() as User
      return user
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  }

  // Kullanıcıyı tamamen sil
  static async hardDeleteUser(id: string): Promise<void> {
    try {
      await sanityClient.delete(id)
    } catch (error) {
      console.error('Error hard deleting user:', error)
      throw error
    }
  }

  // Kullanıcıyı aktif et
  static async activateUser(id: string): Promise<User> {
    try {
      const user = await sanityClient
        .patch(id)
        .set({ isActive: true })
        .commit() as User
      return user
    } catch (error) {
      console.error('Error activating user:', error)
      throw error
    }
  }

  // Kullanıcı ünvanını güncelle
  static async updateUserTitle(id: string, title: string): Promise<User> {
    try {
      const user = await sanityClient
        .patch(id)
        .set({ title })
        .commit() as User
      return user
    } catch (error) {
      console.error('Error updating user title:', error)
      throw error
    }
  }

  // Kategoriye göre kullanıcıları getir
  static async getUsersByCategory(category: 'HSD_MANAGEMENT' | 'GENERAL_MANAGEMENT'): Promise<User[]> {
    try {
      const users = await sanityClient.fetch(usersByCategoryQuery, { category })
      return users
    } catch (error) {
      console.error('Error fetching users by category:', error)
      throw error
    }
  }

  // HSD Management kategorisindeki kullanıcıları getir
  static async getHsdManagementUsers(): Promise<User[]> {
    try {
      const users = await sanityClient.fetch(hsdUsersQuery)
      return users
    } catch (error) {
      console.error('Error fetching HSD Management users:', error)
      throw error
    }
  }

  // Kullanıcı kategorisini güncelle
  static async updateUserCategory(id: string, category: 'HSD_MANAGEMENT' | 'GENERAL_MANAGEMENT'): Promise<User> {
    try {
      const user = await sanityClient
        .patch(id)
        .set({ category })
        .commit() as User
      return user
    } catch (error) {
      console.error('Error updating user category:', error)
      throw error
    }
  }
}
