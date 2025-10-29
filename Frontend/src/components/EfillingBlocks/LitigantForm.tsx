import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { User, MapPin, Phone, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Form schema for validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  address: z.string().min(5, { message: "Please enter a valid address." }),
  state: z.string().min(1, { message: "State is required." }),
  district: z.string().min(1, { message: "District is required." }),
  mobileNumber: z.string().regex(/^[0-9]{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  aadharNumber: z.string().regex(/^[0-9]{12}$/, { message: "Please enter a valid 12-digit Aadhar number." }),
});

interface LitigantFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  className?: string;
}

const statesList = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

// Sample district data - in a real app you would fetch this based on selected state
const districtsByState: Record<string, string[]> = {
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
  // Add districts for other states as needed
};

const FieldWrapper = React.memo(({ children, icon }: { children: React.ReactNode, icon: React.ReactNode }) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
      {icon}
    </div>
    <div className="pl-10">{children}</div>
  </div>
));

FieldWrapper.displayName = 'FieldWrapper';

const LitigantForm: React.FC<LitigantFormProps> = React.memo(({ onSubmit, className }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      state: "",
      district: "",
      mobileNumber: "",
      aadharNumber: ""
    }
  });

  const selectedState = form.watch("state");
  const districts = useMemo(() => 
    selectedState ? (districtsByState[selectedState] || []) : [], 
    [selectedState]
  );

  const handleSubmit = useCallback((data: z.infer<typeof formSchema>) => {
    toast.success("Litigant details saved successfully");
    onSubmit(data);
  }, [onSubmit]);

  return (
    <Card className={cn("form-glass w-full max-w-2xl mx-auto animate-slide-up", className)}>
      <CardHeader>
        <CardTitle className="text-xl font-medium">Litigant Information</CardTitle>
        <CardDescription>
          Please enter the details of the litigant for whom you are filing this case.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <FieldWrapper icon={<User className="h-4 w-4" />}>
                        <Input 
                          placeholder="Enter full name" 
                          className="input-glass pl-10" 
                          {...field} 
                        />
                      </FieldWrapper>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <FieldWrapper icon={<Phone className="h-4 w-4" />}>
                        <Input 
                          type="tel"
                          placeholder="10-digit mobile number" 
                          className="input-glass pl-10" 
                          {...field} 
                        />
                      </FieldWrapper>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="aadharNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aadhar Number</FormLabel>
                    <FormControl>
                      <FieldWrapper icon={<CreditCard className="h-4 w-4" />}>
                        <Input 
                          placeholder="12-digit Aadhar number" 
                          className="input-glass pl-10" 
                          {...field} 
                        />
                      </FieldWrapper>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <FieldWrapper icon={<MapPin className="h-4 w-4" />}>
                        <Input 
                          placeholder="Enter full address" 
                          className="input-glass pl-10" 
                          {...field} 
                        />
                      </FieldWrapper>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="input-glass">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-80">
                        {statesList.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={!selectedState || districts.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger className="input-glass">
                          <SelectValue placeholder={selectedState ? "Select district" : "Select state first"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-80">
                        {districts.length > 0 ? (
                          districts.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-districts" disabled>
                            No districts available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 text-black px-6 py-2 rounded-md transition-all duration-200"
              >
                Next Step
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
});

LitigantForm.displayName = 'LitigantForm';

export default LitigantForm;
