
import React, { useState } from 'react';
import { Lead, CallStatus, ResponseStatus } from '@/types/types';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Edit, Trash2, PhoneCall } from 'lucide-react';
import AddLeadForm from './AddLeadForm';
import EditLeadForm from './EditLeadForm';
import UpdateStatusForm from './UpdateStatusForm';

interface LeadsTableProps {
  leads: Lead[];
  onAddLead: (lead: Omit<Lead, 'id'>) => void;
  onEditLead: (id: string, address: string) => void;
  onDeleteLead: (id: string) => void;
  onUpdateStatus: (id: string, callStatus: CallStatus, responseStatus: ResponseStatus) => void;
}

const LeadsTable: React.FC<LeadsTableProps> = ({ 
  leads, 
  onAddLead, 
  onEditLead, 
  onDeleteLead, 
  onUpdateStatus 
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const handleEditClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsEditDialogOpen(true);
  };

  const handleStatusClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsStatusDialogOpen(true);
  };

  const handleDeleteClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedLead) {
      onDeleteLead(selectedLead.id);
    }
    setIsDeleteDialogOpen(false);
  };

  const getStatusBadge = (lead: Lead) => {
    if (!lead.callStatus) return null;

    if (lead.callStatus === 'connected') {
      switch (lead.responseStatus) {
        case 'interested':
          return <Badge className="bg-success">Interested</Badge>;
        case 'callback':
          return <Badge className="bg-warning">Callback</Badge>;
        case 'discussed':
          return <Badge className="bg-info">Discussed</Badge>;
        default:
          return <Badge>Connected</Badge>;
      }
    } else {
      switch (lead.responseStatus) {
        case 'busy':
          return <Badge variant="outline">Busy</Badge>;
        case 'rnr':
          return <Badge variant="outline">RNR</Badge>;
        case 'switched_off':
          return <Badge variant="outline">Switched Off</Badge>;
        default:
          return <Badge variant="outline">Not Connected</Badge>;
      }
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Customer Leads</CardTitle>
          <Button onClick={() => setIsAddDialogOpen(true)}>Add New Lead</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.length > 0 ? (
                leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.phone}</TableCell>
                    <TableCell>{lead.address}</TableCell>
                    <TableCell>{getStatusBadge(lead)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleStatusClick(lead)}
                        >
                          <PhoneCall className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleEditClick(lead)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleDeleteClick(lead)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No leads found. Add your first lead to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add New Lead Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
          </DialogHeader>
          <AddLeadForm 
            onSubmit={(data) => {
              onAddLead(data);
              setIsAddDialogOpen(false);
            }}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Lead Dialog */}
      {selectedLead && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Lead</DialogTitle>
            </DialogHeader>
            <EditLeadForm
              lead={selectedLead}
              onSubmit={(address) => {
                onEditLead(selectedLead.id, address);
                setIsEditDialogOpen(false);
              }}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Update Status Dialog */}
      {selectedLead && (
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Call Status</DialogTitle>
            </DialogHeader>
            <UpdateStatusForm
              lead={selectedLead}
              onSubmit={(callStatus, responseStatus) => {
                onUpdateStatus(selectedLead.id, callStatus, responseStatus);
                setIsStatusDialogOpen(false);
              }}
              onCancel={() => setIsStatusDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the lead for {selectedLead?.name}. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default LeadsTable;
