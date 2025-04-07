
import React from 'react';
import { CallRecord } from '@/types/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
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
import { Badge } from '@/components/ui/badge';

interface ConnectedCallsTableProps {
  calls: CallRecord[];
}

const ConnectedCallsTable: React.FC<ConnectedCallsTableProps> = ({ calls }) => {
  // Function to get the appropriate badge color based on responseStatus
  const getResponseStatusBadge = (status: string) => {
    switch (status) {
      case 'interested':
        return <Badge className="bg-success">Interested</Badge>;
      case 'callback':
        return <Badge className="bg-warning">Callback</Badge>;
      case 'discussed':
        return <Badge className="bg-info">Discussed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Connected Call Records</CardTitle>
        <CardDescription>
          Recent successful call connections with customers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Telecaller</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calls.length > 0 ? (
              calls.map((call) => (
                <TableRow key={call._id || call.id}>
                  <TableCell className="font-medium">{call.customerName}</TableCell>
                  <TableCell>{call.telecallerName}</TableCell>
                  <TableCell>
                    {new Date(call.callDateTime).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </TableCell>
                  <TableCell>{getResponseStatusBadge(call.responseStatus)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No connected calls recorded yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ConnectedCallsTable;
