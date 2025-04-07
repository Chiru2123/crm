
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Lead, CallStatus, ResponseStatus } from '@/types/types';

interface UpdateStatusFormProps {
  lead: Lead;
  onSubmit: (callStatus: CallStatus, responseStatus: ResponseStatus) => void;
  onCancel: () => void;
}

const UpdateStatusForm: React.FC<UpdateStatusFormProps> = ({ lead, onSubmit, onCancel }) => {
  const [callStatus, setCallStatus] = useState<CallStatus | ''>('');
  const [responseStatus, setResponseStatus] = useState<ResponseStatus | ''>('');

  const handleConnectedClick = () => {
    setCallStatus('connected');
    setResponseStatus('');
  };

  const handleNotConnectedClick = () => {
    setCallStatus('not_connected');
    setResponseStatus('');
  };

  const handleSaveClick = () => {
    if (callStatus && responseStatus) {
      onSubmit(callStatus, responseStatus);
    }
  };

  const isConnected = callStatus === 'connected';
  const isNotConnected = callStatus === 'not_connected';
  const canSave = callStatus && responseStatus;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Lead: {lead.name}</h3>
        <span className="text-sm text-muted-foreground">{lead.phone}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={handleConnectedClick}
          variant={isConnected ? "default" : "outline"}
          className={isConnected ? "bg-success hover:bg-success/90" : ""}
        >
          Connected
        </Button>
        <Button
          onClick={handleNotConnectedClick}
          variant={isNotConnected ? "default" : "outline"}
          className={isNotConnected ? "bg-destructive hover:bg-destructive/90" : ""}
        >
          Not Connected
        </Button>
      </div>

      {callStatus && (
        <Card>
          <CardContent className="pt-6">
            <Select onValueChange={(value) => setResponseStatus(value as ResponseStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a response" />
              </SelectTrigger>
              <SelectContent>
                {isConnected && (
                  <>
                    <SelectItem value="discussed">Discussed</SelectItem>
                    <SelectItem value="callback">Callback</SelectItem>
                    <SelectItem value="interested">Interested</SelectItem>
                  </>
                )}
                {isNotConnected && (
                  <>
                    <SelectItem value="busy">Busy</SelectItem>
                    <SelectItem value="rnr">RNR (Ring No Response)</SelectItem>
                    <SelectItem value="switched_off">Switched Off</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSaveClick} disabled={!canSave}>
          Save Status
        </Button>
      </div>
    </div>
  );
};

export default UpdateStatusForm;
