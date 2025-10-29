
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, MessageSquare, DollarSign, Clock } from "lucide-react";
import { analytics, cases, meetings } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

interface DashboardData {
  casesCount: {
    total: number;
    active: number;
    processing: number;
    pending: number;
  };
  roleSpecific: {
    myCases: Array<{
      _id: string;
      caseNumber: string;
      litigant: { name: string };
      case: { causeAgainstWhom: string; caseType: string };
      status: string;
      filingDate: string;
      updatedAt: string;
    }>;
    upcomingMeetings: Array<{
      _id: string;
      title: string;
      scheduledAt: string;
      agenda: string;
      participants: any[];
    }>;
  };
}

export function LitigantDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dashboardResponse = await analytics.getDashboard();
        setDashboardData(dashboardResponse);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return <div>No data available</div>;
  }

  const myCases = dashboardData.roleSpecific.myCases || [];
  const upcomingMeetings = dashboardData.roleSpecific.upcomingMeetings || [];

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.fullName}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your case progress and stay updated on legal proceedings.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Cases</CardTitle>
            <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
              <FileText className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myCases.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total cases filed
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Meetings</CardTitle>
            <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingMeetings.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Scheduled meetings
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myCases.filter(c => c.status === 'approved' || c.status === 'processing').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Cases in progress
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Your Cases */}
        <Card className="col-span-1 hover-card">
          <CardHeader>
            <CardTitle>Your Cases</CardTitle>
            <CardDescription>Status of your legal cases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myCases.length > 0 ? (
                myCases.map((caseItem, index) => (
                  <div key={caseItem._id} className="bg-secondary/50 dark:bg-justice-800/50 rounded-lg p-4">
                    <p className="text-sm font-medium">
                      {caseItem.caseNumber}: {caseItem.litigant.name} vs {caseItem.case.causeAgainstWhom}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        caseItem.status === 'approved' ? 'bg-green-100 text-green-800' :
                        caseItem.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {caseItem.case.caseType}
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground">
                        Filed: {new Date(caseItem.filingDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last Updated: {new Date(caseItem.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No cases found</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Meetings */}
        <Card className="col-span-1 hover-card">
          <CardHeader>
            <CardTitle>Upcoming Meetings</CardTitle>
            <CardDescription>Scheduled legal consultations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMeetings.length > 0 ? (
                upcomingMeetings.map((meeting, index) => (
                  <div key={meeting._id} className="flex items-start space-x-4">
                    <div className="h-9 w-9 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{meeting.title}</p>
                      <p className="text-sm text-muted-foreground">{meeting.agenda || 'Legal consultation'}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(meeting.scheduledAt).toLocaleDateString()} • {new Date(meeting.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No upcoming meetings</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Case Status Summary */}
      <Card className="hover-card">
        <CardHeader>
          <CardTitle>Case Status Summary</CardTitle>
          <CardDescription>Overview of your case statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <p className="text-sm font-medium">Approved Cases</p>
              </div>
              <p className="text-lg font-bold text-green-600">
                {myCases.filter(c => c.status === 'approved').length}
              </p>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                <p className="text-sm font-medium">Processing Cases</p>
              </div>
              <p className="text-lg font-bold text-yellow-600">
                {myCases.filter(c => c.status === 'processing').length}
              </p>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-gray-500 rounded-full"></div>
                <p className="text-sm font-medium">Pending Cases</p>
              </div>
              <p className="text-lg font-bold text-gray-600">
                {myCases.filter(c => c.status === 'pending').length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
