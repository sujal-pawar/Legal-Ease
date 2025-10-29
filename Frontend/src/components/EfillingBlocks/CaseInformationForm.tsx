import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, BookOpen, AlertCircle, FileText, Scale, Bookmark, Users } from 'lucide-react';
import { format } from 'date-fns';
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
import { Textarea } from '@/components/ui/textarea';
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
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Form schema for validation
const formSchema = z.object({
  courtType: z.string().min(1, { message: "Court type is required." }),
  caseType: z.string().min(1, { message: "Case type is required." }),
  relief: z.string().min(5, { message: "Relief details are required." }),
  causeOfAction: z.string().min(5, { message: "Cause of action is required." }),
  dateOfAction: z.date({
    required_error: "Date of action is required.",
  }),
  subject: z.string().min(5, { message: "Subject is required." }),
  valuation: z.string().min(1, { message: "Valuation details are required." }),
  causeAgainstWhom: z.string().min(2, { message: "Please specify against whom the case is filed." }),
  actDetails: z.string().min(2, { message: "Act details are required." }),
  sectionDetails: z.string().min(1, { message: "Section details are required." }),
});

interface CaseInformationFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  onBack: () => void;
  className?: string;
}

const courtTypes = [
  "Supreme Court",
  "High Court",
  "District Court",
  "Family Court",
  "Consumer Court",
  "Labour Court"
];

const caseTypes = [
  "Civil",
  "Criminal",
  "Family",
  "Consumer",
  "Labour",
  "Tax",
  "Constitutional"
];

const FieldWrapper = React.memo(({ children, icon }: { children: React.ReactNode, icon: React.ReactNode }) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
      {icon}
    </div>
    <div className="pl-10">{children}</div>
  </div>
));

FieldWrapper.displayName = 'FieldWrapper';

const CaseInformationForm: React.FC<CaseInformationFormProps> = React.memo(({ 
  onSubmit, 
  onBack,
  className 
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courtType: "",
      caseType: "",
      relief: "",
      causeOfAction: "",
      subject: "",
      valuation: "",
      causeAgainstWhom: "",
      actDetails: "",
      sectionDetails: ""
    }
  });

  const handleSubmit = useCallback((data: z.infer<typeof formSchema>) => {
    toast.success("Case information saved successfully");
    onSubmit(data);
  }, [onSubmit]);

  return (
    <Card className={cn("form-glass w-full max-w-2xl mx-auto animate-slide-up", className)}>
      <CardHeader>
        <CardTitle className="text-xl font-medium">Case Information</CardTitle>
        <CardDescription>
          Please provide detailed information about the case you are filing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="courtType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Court Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="input-glass">
                          <SelectValue placeholder="Select court type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courtTypes.map((court) => (
                          <SelectItem key={court} value={court}>
                            {court}
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
                name="caseType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Case Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="input-glass">
                          <SelectValue placeholder="Select case type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {caseTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
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
                name="causeOfAction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cause of Action</FormLabel>
                    <FormControl>
                      <FieldWrapper icon={<BookOpen className="h-4 w-4" />}>
                        <Input 
                          placeholder="Enter cause of action" 
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
                name="dateOfAction"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Action</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "input-glass w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <FieldWrapper icon={<Bookmark className="h-4 w-4" />}>
                        <Input 
                          placeholder="Enter subject of the case" 
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
                name="valuation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valuation</FormLabel>
                    <FormControl>
                      <FieldWrapper icon={<Scale className="h-4 w-4" />}>
                        <Input 
                          placeholder="Enter case valuation" 
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
                name="causeAgainstWhom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Against Whom</FormLabel>
                    <FormControl>
                      <FieldWrapper icon={<Users className="h-4 w-4" />}>
                        <Input 
                          placeholder="Enter against whom the case is filed" 
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
                name="actDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Act Details</FormLabel>
                    <FormControl>
                      <FieldWrapper icon={<FileText className="h-4 w-4" />}>
                        <Input 
                          placeholder="Enter act details" 
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
                name="sectionDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section Details</FormLabel>
                    <FormControl>
                      <FieldWrapper icon={<AlertCircle className="h-4 w-4" />}>
                        <Input 
                          placeholder="Enter section details" 
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
                name="relief"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Relief Sought</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter the relief sought in this case" 
                        className="input-glass min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button 
                type="button"
                variant="outline"
                onClick={onBack}
                className="text-black border-black hover:bg-black/5"
              >
                Back
              </Button>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 text-black"
              >
                Submit Case
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
});

CaseInformationForm.displayName = 'CaseInformationForm';

export default CaseInformationForm;
