
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Lead } from '@/types/types';

// Form schema - only allow editing the address field
const formSchema = z.object({
  address: z.string().min(5, { message: 'Address must be at least 5 characters.' }),
});

type FormData = z.infer<typeof formSchema>;

interface EditLeadFormProps {
  lead: Lead;
  onSubmit: (address: string) => void;
  onCancel: () => void;
}

const EditLeadForm: React.FC<EditLeadFormProps> = ({ lead, onSubmit, onCancel }) => {
  // Initialize form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: lead.address,
    }
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data.address);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Display the non-editable fields */}
        <div className="space-y-4 mb-4">
          <div>
            <FormLabel>Name</FormLabel>
            <Input value={lead.name} disabled />
          </div>
          
          <div>
            <FormLabel>Email</FormLabel>
            <Input value={lead.email} disabled />
          </div>
          
          <div>
            <FormLabel>Phone Number</FormLabel>
            <Input value={lead.phone} disabled />
          </div>
        </div>

        {/* Editable address field */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditLeadForm;
