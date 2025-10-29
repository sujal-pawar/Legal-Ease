import React, { useState, useCallback, useMemo } from "react";
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
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Add this to ensure credentials are sent
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request config:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const message = error.response.data.message || 'An error occurred';
      console.error('Server error:', error.response.data);
      toast.error(message);

      if (error.response.status === 401) {
        // Handle unauthorized error (e.g., redirect to login)
        localStorage.removeItem('token');
        window.location.href = '/auth';
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      toast.error('No response from server. Please try again.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
      toast.error('Error setting up request. Please try again.');
    }
    return Promise.reject(error);
  }
);

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
    const { user } = useAuth();
    // State for form data and current step
    const [currentStep, setCurrentStep] = useState('litigant');
    const [formData, setFormData] = useState({
      litigant: null,
      case: null
    });
  
    // Memoized handlers
    const handleStepChange = useCallback((stepId) => {
      if (stepId === 'litigant' || 
          (stepId === 'case' && formData.litigant) ||
          (stepId === 'complete' && formData.litigant && formData.case)) {
        setCurrentStep(stepId);
      }
    }, [formData.litigant, formData.case]);
  
    const handleLitigantSubmit = useCallback((data) => {
      setFormData(prev => ({ ...prev, litigant: data }));
      setCurrentStep('case');
    }, []);
  
    const handleCaseSubmit = useCallback(async (data) => {
      try {
        // Create a Date object from the input date
        const dateObj = new Date(data.dateOfAction);
        
        const formattedData = {
          ...data,
          dateOfAction: dateObj.toISOString()
        };

        const response = await api.post('/api/efiled-cases', {
          litigant: formData.litigant,
          case: formattedData
        });
        
        if (response.data) {
          setFormData(prev => ({ 
            ...prev, 
            case: {
              ...data,
              dateOfAction: dateObj // Store the Date object instead of ISO string
            }
          }));
          setCurrentStep('complete');
          toast.success('Case filed successfully!');
        }
      } catch (error) {
        // Error handling is now done in the axios interceptor
        console.error('Error filing case:', error);
      }
    }, [formData.litigant]);
  
    const handleStartNew = useCallback(() => {
      setFormData({ litigant: null, case: null });
      setCurrentStep('litigant');
      toast.info('Started a new e-filing form');
    }, []);
  
    const handleBackToLitigant = useCallback(() => {
      setCurrentStep('litigant');
    }, []);
  
    // Memoized step content
    const stepContent = useMemo(() => {
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
                            {formData.case?.dateOfAction instanceof Date 
                              ? formData.case.dateOfAction.toLocaleDateString() 
                              : new Date(formData.case?.dateOfAction).toLocaleDateString()}
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
    }, [currentStep, formData, handleLitigantSubmit, handleCaseSubmit, handleBackToLitigant, handleStartNew]);
  
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-16">
        <Navbar />
        <div className="container px-4 md:px-6 mx-auto mb-16 mt-20">
          <EFilingHeader />
          
          <EFilingNavigation 
            steps={eFilingSteps} 
            currentStep={currentStep} 
            onStepChange={handleStepChange} 
          />
          
          <div className="mt-8">
            {stepContent}
          </div>
        </div>
        <Footer />
      </div>
    );
  };
  
  export default Efilling;
  