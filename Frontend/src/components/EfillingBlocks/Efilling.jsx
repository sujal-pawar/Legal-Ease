import React, { useState } from "react";
import { toast } from "sonner";
import EFilingHeader from "@/components/EfillingBlocks/EFilingHeader";
import EFilingNavigation from "@/components/EfillingBlocks/EFilingNavigation";
import LitigantForm from "@/components/EfillingBlocks/LitigantForm";
import CaseInformationForm from "@/components/EfillingBlocks/CaseInformationForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import api from '@/services/api';


// Define the navigation steps
const eFilingSteps = [
    {
      id: 'litigant',
      title: 'Litigant Details',
      description: 'Personal information'
    },
    {
      id: 'case',
      title: 'Case Information',
      description: 'Legal details'
    },
    {
      id: 'complete',
      title: 'Complete',
      description: 'Submission summary'
    }
  ];
  
  const Efilling = () => {
    // State for form data and current step
    const [currentStep, setCurrentStep] = useState('litigant');
    const [formData, setFormData] = useState({
      litigant: null,
      case: null
    });
  
    // Handler for step changes
    const handleStepChange = (stepId , string) => {
      // Only allow navigation to steps that are available based on form progress
      if (stepId === 'litigant' || 
          (stepId === 'case' && formData.litigant) ||
          (stepId === 'complete' && formData.litigant && formData.case)) {
        setCurrentStep(stepId);
      }
    };
  
    // Handler for litigant form submission
    const handleLitigantSubmit = (data, any) => {
      setFormData(prev => ({ ...prev, litigant: data }));
      setCurrentStep('case');
    };
  
    // Handler for case information form submission
    const handleCaseSubmit = async (data, any) => {
      setFormData(prev => ({ ...prev, case: data }));
      // Compose payload
      const payload = {
        // Case fields
        title: data.subject || '',
        description: data.causeOfAction || '',
        category: data.caseType || '',
        courtType: data.courtType,
        caseType: data.caseType,
        relief: data.relief,
        causeOfAction: data.causeOfAction,
        dateOfAction: data.dateOfAction,
        subject: data.subject,
        valuation: data.valuation,
        causeAgainstWhom: data.causeAgainstWhom,
        actDetails: data.actDetails,
        sectionDetails: data.sectionDetails,
        // Litigant fields (assuming you have user IDs, otherwise send as subdoc)
        client: formData.litigant && formData.litigant.id, // or send full object if needed
        // You may need to select judge from a dropdown in the UI
        judge: '', // TODO: set judge user ID from UI
        // Optionally handle documents
        documents: []
      };
      try {
        await api.post('/cases', payload);
        setCurrentStep('complete');
        toast.success('Case filed successfully!');
      } catch (err) {
        toast.error('Failed to file case.');
      }
    };
  
    // Handler for form completion
    const handleStartNew = () => {
      setFormData({ litigant: null, case: null });
      setCurrentStep('litigant');
      toast.info('Started a new e-filing form');
    };
  
    // Handler to go back to the litigant form
    const handleBackToLitigant = () => {
      setCurrentStep('litigant');
    };
  
    // Helper to render the current step content
    const renderStepContent = () => {
      switch (currentStep) {
        case 'litigant':
          return <LitigantForm onSubmit={handleLitigantSubmit} />;
        case 'case':
          return <CaseInformationForm onSubmit={handleCaseSubmit} onBack={handleBackToLitigant} />;
        case 'complete':
          return (
            <Card className="form-glass w-full max-w-2xl mx-auto animate-slide-up">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
                <CardTitle className="text-2xl font-semibold">Submission Complete</CardTitle>
                <CardDescription>
                  Your e-filing has been submitted successfully.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-white/50 dark:bg-black/20 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-medium">Litigant Information</h3>
                    {formData.litigant && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Name:</span> 
                          <span className="ml-2 font-medium">{formData.litigant.name}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Mobile:</span> 
                          <span className="ml-2 font-medium">{formData.litigant.mobileNumber}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Aadhar:</span> 
                          <span className="ml-2 font-medium">{formData.litigant.aadharNumber}</span>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-muted-foreground">Address:</span> 
                          <span className="ml-2 font-medium">{formData.litigant.address}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">State:</span> 
                          <span className="ml-2 font-medium">{formData.litigant.state}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">District:</span> 
                          <span className="ml-2 font-medium">{formData.litigant.district}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-white/50 dark:bg-black/20 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-medium">Case Information</h3>
                    {formData.case && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Court Type:</span> 
                          <span className="ml-2 font-medium">{formData.case.courtType}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Case Type:</span> 
                          <span className="ml-2 font-medium">{formData.case.caseType}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Cause of Action:</span> 
                          <span className="ml-2 font-medium">{formData.case.causeOfAction}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Date of Action:</span> 
                          <span className="ml-2 font-medium">
                            {formData.case.dateOfAction.toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Subject:</span> 
                          <span className="ml-2 font-medium">{formData.case.subject}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Valuation:</span> 
                          <span className="ml-2 font-medium">{formData.case.valuation}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Against:</span> 
                          <span className="ml-2 font-medium">{formData.case.causeAgainstWhom}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Act Details:</span> 
                          <span className="ml-2 font-medium">{formData.case.actDetails}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Section Details:</span> 
                          <span className="ml-2 font-medium">{formData.case.sectionDetails}</span>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-muted-foreground">Relief Sought:</span> 
                          <p className="mt-1 font-medium">{formData.case.relief}</p>
                        </div>
                      </div>
                    )}
                  </div>
  
                  <div className="flex justify-center pt-6">
                    <Button 
                      onClick={handleStartNew}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      Start New E-Filing
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        default:
          return null;
      }
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-16">
        <Navbar />
        <div className="container px-4 md:px-6 mx-auto mb-16 mt-20">
          <EFilingHeader />
          
          <EFilingNavigation 
            steps={eFilingSteps} 
            currentStep={currentStep} 
            onStepChange={handleStepChange} 
            className="mb-8 items-center"
          />
          
          <div className="max-w-5xl mx-auto">
            {renderStepContent()}
          </div>
        </div>
        <Footer  />
      </div>
    );
  };
  
  export default Efilling;
  