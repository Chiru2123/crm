
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import Layout from '@/components/layout/Layout';
import LeadsTable from '@/components/telecaller/LeadsTable';
import { Lead, CallRecord, CallStatus, ResponseStatus } from '@/types/types';
import { useAuth } from '@/contexts/AuthContext';
import { leadsAPI, callRecordsAPI } from '@/services/apiClient';

const Telecaller: React.FC = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [callRecords, setCallRecords] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchLeadsData = async () => {
      try {
        setLoading(true);
        // Fetch leads
        const leadsData = await leadsAPI.getLeads();
        // Convert MongoDB _id to id for frontend consistency
        const formattedLeads = leadsData.map((lead: any) => ({
          id: lead._id,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          address: lead.address,
          callStatus: lead.callStatus,
          responseStatus: lead.responseStatus,
          lastUpdated: new Date(lead.lastUpdated),
          telecallerId: lead.telecallerId,
          telecallerName: lead.telecallerName
        }));
        setLeads(formattedLeads);
        
        // Fetch call records
        const callsData = await callRecordsAPI.getCallRecords();
        // Convert MongoDB _id to id for frontend consistency
        const formattedCalls = callsData.map((call: any) => ({
          id: call._id,
          leadId: call.leadId,
          customerName: call.customerName,
          telecallerId: call.telecallerId,
          telecallerName: call.telecallerName,
          callStatus: call.callStatus,
          responseStatus: call.responseStatus,
          callDateTime: new Date(call.callDateTime)
        }));
        setCallRecords(formattedCalls);
      } catch (error) {
        console.error('Error fetching telecaller data:', error);
        toast.error('Failed to load leads data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeadsData();
  }, []);

  const handleAddLead = async (newLeadData: Omit<Lead, 'id'>) => {
    try {
      const telecallerId = user?.id || '';
      const telecallerName = user?.name || '';
      
      // Prepare lead data for API
      const leadData = {
        ...newLeadData,
        telecallerId,
        telecallerName
      };
      
      // Call API to create lead
      const response = await leadsAPI.createLead(leadData);
      
      // Format the response for frontend
      const newLead: Lead = {
        id: response._id,
        ...newLeadData,
        telecallerId,
        telecallerName
      };
      
      setLeads([...leads, newLead]);
      toast.success(`New lead added: ${newLead.name}`);
    } catch (error) {
      console.error('Error adding lead:', error);
      toast.error('Failed to add new lead');
    }
  };

  const handleEditLead = async (id: string, address: string) => {
    try {
      // Call API to update lead
      await leadsAPI.updateLead(id, { address });
      
      // Update local state
      const updatedLeads = leads.map(lead => 
        lead.id === id ? { ...lead, address } : lead
      );
      
      setLeads(updatedLeads);
      toast.success(`Lead address updated successfully`);
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('Failed to update lead address');
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      // Call API to delete lead
      await leadsAPI.deleteLead(id);
      
      // Update local state
      const updatedLeads = leads.filter(lead => lead.id !== id);
      setLeads(updatedLeads);
      toast.success(`Lead deleted successfully`);
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error('Failed to delete lead');
    }
  };

  const handleUpdateStatus = async (id: string, callStatus: CallStatus, responseStatus: ResponseStatus) => {
    try {
      // Update the lead status via API
      await leadsAPI.updateLeadStatus(id, { 
        callStatus, 
        responseStatus 
      });
      
      // Update local state
      const leadIndex = leads.findIndex(lead => lead.id === id);
      
      if (leadIndex === -1) return;
      
      const updatedLead = {
        ...leads[leadIndex],
        callStatus: callStatus as 'connected' | 'not_connected',
        responseStatus: responseStatus as any,
        lastUpdated: new Date()
      };
      
      const updatedLeads = [...leads];
      updatedLeads[leadIndex] = updatedLead;
      setLeads(updatedLeads);
      
      // If the call was connected, create a call record via API
      if (callStatus === 'connected') {
        const callData = {
          leadId: id,
          callStatus: callStatus,
          responseStatus: responseStatus
        };
        
        // Create call record via API
        const response = await callRecordsAPI.createCallRecord(callData);
        
        // Format the response for frontend
        const newCallRecord: CallRecord = {
          id: response._id,
          leadId: id,
          customerName: updatedLead.name,
          telecallerId: user?.id || '',
          telecallerName: user?.name || '',
          callStatus: callStatus,
          responseStatus: responseStatus,
          callDateTime: new Date()
        };
        
        setCallRecords([...callRecords, newCallRecord]);
        toast.success(`Call status updated: ${responseStatus}`);
      } else {
        toast.success(`Call status updated: Not connected - ${responseStatus}`);
      }
    } catch (error) {
      console.error('Error updating call status:', error);
      toast.error('Failed to update call status');
    }
  };

  return (
    <Layout requiredRole="any">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Lead Management</h1>
          <p className="text-muted-foreground">
            Manage your customer leads and update call statuses
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading leads data...</p>
          </div>
        ) : (
          <LeadsTable
            leads={leads}
            onAddLead={handleAddLead}
            onEditLead={handleEditLead}
            onDeleteLead={handleDeleteLead}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </div>
    </Layout>
  );
};

export default Telecaller;
