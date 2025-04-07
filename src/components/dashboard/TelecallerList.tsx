import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { authAPI, leadsAPI } from '@/services/apiClient';
import { User, Lead } from '@/types/types';
import { toast } from 'sonner';
import { Users } from 'lucide-react';

interface TelecallerWithLeads extends User {
  leads: Lead[];
  totalLeads: number;
}

const TelecallerList: React.FC = () => {
  const [telecallers, setTelecallers] = useState<TelecallerWithLeads[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTelecallersAndLeads = async () => {
      try {
        setLoading(true);
        // Fetch all users
        const users = await authAPI.getUsers();
        
        // Filter telecallers only
        const telecallerUsers = users.filter((user: any) => user.role === 'telecaller');
        
        // Fetch all leads
        const allLeads = await leadsAPI.getLeads();
        
        // Map telecallers with their leads
        const telecallersWithLeads = telecallerUsers.map((telecaller: any) => {
          const telecallerLeads = allLeads.filter(
            (lead: Lead) => lead.telecallerId === telecaller._id
          );
          
          return {
            id: telecaller._id,
            name: telecaller.name,
            email: telecaller.email,
            role: telecaller.role,
            avatar: telecaller.avatar,
            leads: telecallerLeads,
            totalLeads: telecallerLeads.length
          };
        });
        
        setTelecallers(telecallersWithLeads);
      } catch (error) {
        console.error('Error fetching telecallers and leads:', error);
        toast.error('Failed to load telecaller data');
      } finally {
        setLoading(false);
      }
    };

    fetchTelecallersAndLeads();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Telecaller Performance</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <p>Loading telecaller data...</p>
          </div>
        ) : telecallers.length === 0 ? (
          <div className="text-center py-4">
            <p>No telecallers found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Assigned Leads</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {telecallers.map((telecaller) => (
                <TableRow key={telecaller.id}>
                  <TableCell className="font-medium">{telecaller.name}</TableCell>
                  <TableCell>{telecaller.email}</TableCell>
                  <TableCell className="text-right">{telecaller.totalLeads}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default TelecallerList;