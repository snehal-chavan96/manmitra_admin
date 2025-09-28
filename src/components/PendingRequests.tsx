import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { getPendingRequests, updateTherapistStatus, updateVolunteerStatus } from '../api/admin';

export default function PendingRequests() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [therapists, setTherapists] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getPendingRequests();
      setTherapists(data?.therapists || []);
      setVolunteers(data?.volunteers || []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load pending requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleVolunteer = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateVolunteerStatus(id, { status });
      await load();
    } catch (e) {
      setError('Failed to update volunteer');
    }
  };

  const handleTherapist = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateTherapistStatus(id, { status });
      await load();
    } catch (e) {
      setError('Failed to update therapist');
    }
  };

  return (
    <AdminLayout
      title="Pending Requests"
      subtitle="Approve or reject new volunteers and therapists"
    >
      <div className="space-y-6">
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}
        {loading && <div className="text-sm text-gray-600">Loading...</div>}

        <Tabs defaultValue="therapists" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="therapists">Therapists ({therapists.length})</TabsTrigger>
            <TabsTrigger value="volunteers">Volunteers ({volunteers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="therapists">
            <Card className="admin-card">
              <CardHeader>
                <CardTitle>Therapist Requests</CardTitle>
                <CardDescription>Review and take action</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {therapists.length === 0 && (
                  <div className="text-sm text-gray-600">No pending therapist requests.</div>
                )}
                {therapists.map((t) => (
                  <div key={t._id || t.id} className="flex items-center justify-between p-3 admin-pale-gray-bg rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{t.name || 'Therapist'}</div>
                      <div className="text-sm text-gray-600">{t.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>pending</Badge>
                      <Button size="sm" onClick={() => handleTherapist(t._id || t.id, 'approved')}>Approve</Button>
                      <Button size="sm" variant="outline" onClick={() => handleTherapist(t._id || t.id, 'rejected')}>Reject</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="volunteers">
            <Card className="admin-card">
              <CardHeader>
                <CardTitle>Volunteer Requests</CardTitle>
                <CardDescription>Review and take action</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {volunteers.length === 0 && (
                  <div className="text-sm text-gray-600">No pending volunteer requests.</div>
                )}
                {volunteers.map((v) => (
                  <div key={v._id || v.id} className="flex items-center justify-between p-3 admin-pale-gray-bg rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{v.name || 'Volunteer'}</div>
                      <div className="text-sm text-gray-600">{v.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>pending</Badge>
                      <Button size="sm" onClick={() => handleVolunteer(v._id || v.id, 'approved')}>Approve</Button>
                      <Button size="sm" variant="outline" onClick={() => handleVolunteer(v._id || v.id, 'rejected')}>Reject</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
