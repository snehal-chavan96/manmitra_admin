import { createClient } from '@supabase/supabase-js'
import { projectId, publicAnonKey } from './info'

const supabaseUrl = `https://${projectId}.supabase.co`
const supabaseKey = publicAnonKey

export const supabase = createClient(supabaseUrl, supabaseKey)

// API helper functions for ManMitra Admin
export class AdminAPI {
  private static baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-8f6df915`
  private static token: string | null = null

  static setAuthToken(token: string) {
    this.token = token
  }

  static getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token || publicAnonKey}`
    }
  }

  // Authentication methods
  static async signIn(adminId: string, password: string) {
    try {
      const response = await fetch(`${this.baseUrl}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId, password })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed')
      }
      
      // Store token for future requests
      if (data.token) {
        this.setAuthToken(data.token)
        localStorage.setItem('admin_token', data.token)
      }
      
      return { success: true, user: data.user, token: data.token }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: error.message }
    }
  }

  static async signOut() {
    try {
      await fetch(`${this.baseUrl}/auth/signout`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      })
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      this.token = null
      localStorage.removeItem('admin_token')
    }
  }

  static async getSession() {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        return { user: null }
      }

      this.setAuthToken(token)
      const response = await fetch(`${this.baseUrl}/auth/session`, {
        headers: this.getAuthHeaders()
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        localStorage.removeItem('admin_token')
        return { user: null }
      }
      
      return { user: data.user }
    } catch (error) {
      console.error('Session check error:', error)
      localStorage.removeItem('admin_token')
      return { user: null }
    }
  }

  // Crisis management methods
  static async getActiveCrises() {
    try {
      const response = await fetch(`${this.baseUrl}/crisis/active`, {
        headers: this.getAuthHeaders()
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch crisis data')
      }
      
      return data
    } catch (error) {
      console.error('Error fetching active crises:', error)
      throw error
    }
  }

  static async createCrisisRecord(crisisData: any) {
    try {
      const response = await fetch(`${this.baseUrl}/crisis/create`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(crisisData)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create crisis record')
      }
      
      return data
    } catch (error) {
      console.error('Error creating crisis record:', error)
      throw error
    }
  }

  // User management methods
  static async getPendingUsers() {
    try {
      const response = await fetch(`${this.baseUrl}/users/pending`, {
        headers: this.getAuthHeaders()
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch pending users')
      }
      
      return data
    } catch (error) {
      console.error('Error fetching pending users:', error)
      throw error
    }
  }

  static async approveUser(userId: string, userType: 'counselor' | 'volunteer', action: 'approve' | 'reject') {
    try {
      const response = await fetch(`${this.baseUrl}/users/approve`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ userId, userType, action })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to process user approval')
      }
      
      return data
    } catch (error) {
      console.error('Error processing user approval:', error)
      throw error
    }
  }

  // Analytics methods
  static async getDashboardAnalytics() {
    try {
      const response = await fetch(`${this.baseUrl}/analytics/dashboard`, {
        headers: this.getAuthHeaders()
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch analytics data')
      }
      
      return data
    } catch (error) {
      console.error('Error fetching analytics:', error)
      throw error
    }
  }

  // Reports methods
  static async getCrisisSummaryReport(startDate?: string, endDate?: string) {
    try {
      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)
      
      const url = `${this.baseUrl}/reports/crisis-summary${params.toString() ? '?' + params.toString() : ''}`
      
      const response = await fetch(url, {
        headers: this.getAuthHeaders()
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate report')
      }
      
      return data
    } catch (error) {
      console.error('Error generating crisis report:', error)
      throw error
    }
  }

  // Health check
  static async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/health`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error checking server health:', error)
      throw error
    }
  }
}