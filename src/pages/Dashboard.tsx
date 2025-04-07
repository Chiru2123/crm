
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import CallTrendsChart from '@/components/dashboard/CallTrendsChart';
import ConnectedCallsTable from '@/components/dashboard/ConnectedCallsTable';
import TelecallerList from '@/components/dashboard/TelecallerList';
import { callRecordsAPI } from '@/services/apiClient';
import { DashboardMetrics as MetricsType, CallTrend, CallRecord } from '@/types/types';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricsType>({ totalTelecallers: 0, totalCalls: 0, totalCustomers: 0 });
  const [trends, setTrends] = useState<CallTrend[]>([]);
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Use Promise.allSettled to handle partial failures
        const [metricsResult, trendsResult, callsResult] = await Promise.allSettled([
          callRecordsAPI.getDashboardMetrics(),
          callRecordsAPI.getCallTrends(),
          callRecordsAPI.getCallRecords()
        ]);

        // Handle metrics data
        if (metricsResult.status === 'fulfilled') {
          setMetrics(metricsResult.value);
        } else {
          console.error('Error fetching metrics:', metricsResult.reason);
          toast.error(`Failed to load dashboard metrics: ${metricsResult.reason?.response?.data?.message || metricsResult.reason?.message || 'Unknown error'}`);
          setMetrics({ totalTelecallers: 0, totalCalls: 0, totalCustomers: 0 });
        }

        // Handle trends data
        if (trendsResult.status === 'fulfilled') {
          setTrends(trendsResult.value);
        } else {
          console.error('Error fetching trends:', trendsResult.reason);
          toast.error(`Failed to load call trends: ${trendsResult.reason?.response?.data?.message || trendsResult.reason?.message || 'Unknown error'}`);
          setTrends([]);
        }

        // Handle calls data
        if (callsResult.status === 'fulfilled') {
          setCalls(callsResult.value);
        } else {
          console.error('Error fetching calls:', callsResult.reason);
          toast.error('Failed to load call records');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Layout requiredRole="admin">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your CRM system and telecaller performance
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading dashboard data...</p>
          </div>
        ) : (
          <>
            <DashboardMetrics metrics={metrics} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CallTrendsChart trends={trends} />
            </div>
            
            <TelecallerList />
            
            <ConnectedCallsTable calls={calls} />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
