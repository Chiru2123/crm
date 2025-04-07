
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardMetrics as MetricsType } from '@/types/types';
import { Users, Phone, UserCheck } from 'lucide-react';

interface DashboardMetricsProps {
  metrics: MetricsType;
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ metrics }) => {
  const { totalTelecallers, totalCalls, totalCustomers } = metrics;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Telecallers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTelecallers}</div>
          <p className="text-xs text-muted-foreground">Active staff members</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Calls Made</CardTitle>
          <Phone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCalls}</div>
          <p className="text-xs text-muted-foreground">Call attempts this week</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCustomers}</div>
          <p className="text-xs text-muted-foreground">Leads in database</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMetrics;
