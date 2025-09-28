import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js'
import * as kv from './kv_store.tsx'

const app = new Hono()

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.use('*', logger(console.log))

// Health check
app.get('/make-server-8f6df915/health', (c) => {
  return c.json({ 
    status: 'healthy', 
    service: 'ManMitra Admin API',
    timestamp: new Date().toISOString() 
  })
})

// Admin Authentication Routes
app.post('/make-server-8f6df915/auth/send-otp', async (c) => {
  try {
    const { email } = await c.req.json()
    
    // Validate institutional email
    if (!email || !email.includes('@') || !email.includes('.edu')) {
      return c.json({ error: 'Invalid institutional email address' }, 400)
    }
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    
    // Store OTP in KV store with expiration
    await kv.set(`otp:${email}`, {
      code: otp,
      expiresAt: expiresAt.toISOString(),
      attempts: 0
    })
    
    // In production, send actual email via email service
    console.log(`OTP for ${email}: ${otp}`)
    
    return c.json({ 
      success: true, 
      message: 'Verification code sent to your institutional email',
      expiresIn: 300 // 5 minutes in seconds
    })
  } catch (error) {
    console.error('Error sending OTP:', error)
    return c.json({ error: 'Failed to send verification code' }, 500)
  }
})

app.post('/make-server-8f6df915/auth/verify-otp', async (c) => {
  try {
    const { email, otp } = await c.req.json()
    
    if (!email || !otp || otp.length !== 6) {
      return c.json({ error: 'Invalid email or verification code' }, 400)
    }
    
    // Retrieve stored OTP
    const storedOtp = await kv.get(`otp:${email}`)
    if (!storedOtp) {
      return c.json({ error: 'Verification code expired or invalid' }, 400)
    }
    
    // Check if OTP is expired
    if (new Date() > new Date(storedOtp.expiresAt)) {
      await kv.del(`otp:${email}`)
      return c.json({ error: 'Verification code has expired' }, 400)
    }
    
    // Check if OTP matches
    if (storedOtp.code !== otp) {
      // Increment attempts
      storedOtp.attempts = (storedOtp.attempts || 0) + 1
      if (storedOtp.attempts >= 3) {
        await kv.del(`otp:${email}`)
        return c.json({ error: 'Too many invalid attempts. Please request a new code.' }, 400)
      }
      await kv.set(`otp:${email}`, storedOtp)
      return c.json({ error: 'Invalid verification code' }, 400)
    }
    
    // Create admin session
    const { data: { user }, error } = await supabase.auth.admin.createUser({
      email: email,
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        institution: 'University of Excellence',
        name: 'Dr. Sarah Johnson'
      }
    })
    
    if (error && !error.message.includes('already registered')) {
      console.error('Error creating user:', error)
      return c.json({ error: 'Authentication failed' }, 500)
    }
    
    // Generate session token
    const { data: session, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email
    })
    
    // Clean up OTP
    await kv.del(`otp:${email}`)
    
    // Store admin session data
    await kv.set(`admin_session:${email}`, {
      email,
      role: 'admin',
      institution: 'University of Excellence',
      loginTime: new Date().toISOString(),
      permissions: ['crisis_management', 'user_management', 'analytics', 'reports']
    })
    
    return c.json({
      success: true,
      user: {
        email,
        name: 'Dr. Sarah Johnson',
        role: 'Senior Administrator',
        institution: 'University of Excellence'
      },
      token: 'mock_admin_token_' + Date.now()
    })
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return c.json({ error: 'Authentication failed' }, 500)
  }
})

// Crisis Management Routes
app.get('/make-server-8f6df915/crisis/active', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    // Get active crisis situations
    const activeCrises = await kv.getByPrefix('crisis:active:')
    
    // Mock data if no real crises exist
    const mockCrises = [
      {
        id: 'CRISIS-001',
        studentId: '2024-5678',
        severity: 'High',
        trigger: 'Suicide ideation keywords detected in chat',
        timestamp: new Date().toISOString(),
        status: 'Active Response',
        location: 'Dormitory - West Campus',
        counselorAssigned: 'Dr. Sarah Johnson',
        contactAttempts: 2,
        lastActivity: 'Student responded to outreach call',
        riskFactors: ['Previous counseling history', 'Recent academic stress', 'Social isolation indicators']
      }
    ]
    
    return c.json({
      success: true,
      crises: activeCrises.length > 0 ? activeCrises : mockCrises,
      count: activeCrises.length > 0 ? activeCrises.length : mockCrises.length
    })
  } catch (error) {
    console.error('Error fetching active crises:', error)
    return c.json({ error: 'Failed to fetch crisis data' }, 500)
  }
})

app.post('/make-server-8f6df915/crisis/create', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const crisisData = await c.req.json()
    const crisisId = `CRISIS-${Date.now()}`
    
    await kv.set(`crisis:active:${crisisId}`, {
      id: crisisId,
      ...crisisData,
      createdAt: new Date().toISOString(),
      status: 'Active Response'
    })
    
    return c.json({ success: true, crisisId })
  } catch (error) {
    console.error('Error creating crisis record:', error)
    return c.json({ error: 'Failed to create crisis record' }, 500)
  }
})

// User Management Routes
app.get('/make-server-8f6df915/users/pending', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    // Get pending counselors and volunteers
    const pendingCounselors = await kv.getByPrefix('pending:counselor:')
    const pendingVolunteers = await kv.getByPrefix('pending:volunteer:')
    
    return c.json({
      success: true,
      counselors: pendingCounselors,
      volunteers: pendingVolunteers
    })
  } catch (error) {
    console.error('Error fetching pending users:', error)
    return c.json({ error: 'Failed to fetch pending users' }, 500)
  }
})

app.post('/make-server-8f6df915/users/approve', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const { userId, userType, action } = await c.req.json()
    
    if (!userId || !userType || !action) {
      return c.json({ error: 'Missing required fields' }, 400)
    }
    
    const pendingKey = `pending:${userType}:${userId}`
    const userData = await kv.get(pendingKey)
    
    if (!userData) {
      return c.json({ error: 'User not found' }, 404)
    }
    
    if (action === 'approve') {
      // Move to approved users
      await kv.set(`approved:${userType}:${userId}`, {
        ...userData,
        approvedAt: new Date().toISOString(),
        approvedBy: 'admin', // In real app, get from auth token
        status: 'approved'
      })
      
      // Remove from pending
      await kv.del(pendingKey)
      
      // Log approval action
      await kv.set(`audit:approval:${Date.now()}`, {
        action: 'approve',
        userType,
        userId,
        timestamp: new Date().toISOString(),
        approvedBy: 'admin'
      })
    } else if (action === 'reject') {
      // Move to rejected with reason
      await kv.set(`rejected:${userType}:${userId}`, {
        ...userData,
        rejectedAt: new Date().toISOString(),
        rejectedBy: 'admin',
        status: 'rejected'
      })
      
      await kv.del(pendingKey)
    }
    
    return c.json({ success: true, message: `User ${action}ed successfully` })
  } catch (error) {
    console.error('Error processing user approval:', error)
    return c.json({ error: 'Failed to process approval' }, 500)
  }
})

// Analytics Routes
app.get('/make-server-8f6df915/analytics/dashboard', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    // Get aggregated analytics data
    const activeCrises = await kv.getByPrefix('crisis:active:')
    const approvedCounselors = await kv.getByPrefix('approved:counselor:')
    const approvedVolunteers = await kv.getByPrefix('approved:volunteer:')
    
    // Mock analytics data
    const analytics = {
      activeUsers: 1247,
      ongoingSessions: 23,
      communityActivity: 156,
      activeCrises: activeCrises.length,
      totalCounselors: approvedCounselors.length,
      totalVolunteers: approvedVolunteers.length,
      weeklyTrends: {
        newRegistrations: 89,
        sessionsCompleted: 234,
        crisisInterventions: 12,
        volunteerActions: 445
      },
      systemHealth: {
        status: 'online',
        serverLoad: 67,
        responseTime: '250ms',
        uptime: '99.8%'
      }
    }
    
    return c.json({ success: true, analytics })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return c.json({ error: 'Failed to fetch analytics data' }, 500)
  }
})

// Reports Routes
app.get('/make-server-8f6df915/reports/crisis-summary', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const { startDate, endDate } = c.req.query()
    
    // Get crisis data for date range
    const allCrises = await kv.getByPrefix('crisis:')
    
    // Mock report data
    const report = {
      period: { startDate, endDate },
      summary: {
        totalCrises: 12,
        averageResolutionTime: '1.2 hours',
        successRate: 95,
        highPriorityCrises: 3,
        mediumPriorityCrises: 7,
        lowPriorityCrises: 2
      },
      trends: {
        peakHours: '2:00 PM - 6:00 PM',
        commonTriggers: ['Academic Stress', 'Relationship Issues', 'Anxiety'],
        outcomeDistribution: {
          resolved: 10,
          ongoing: 2,
          escalated: 0
        }
      },
      generatedAt: new Date().toISOString()
    }
    
    return c.json({ success: true, report })
  } catch (error) {
    console.error('Error generating crisis report:', error)
    return c.json({ error: 'Failed to generate report' }, 500)
  }
})

// WebSocket endpoint for real-time crisis alerts (simplified)
app.get('/make-server-8f6df915/ws/crisis-alerts', async (c) => {
  // In a real implementation, this would establish WebSocket connection
  return c.json({ 
    message: 'WebSocket endpoint for real-time crisis alerts',
    endpoint: '/ws/crisis-alerts'
  })
})

console.log('ManMitra Admin API server starting...')

Deno.serve(app.fetch)