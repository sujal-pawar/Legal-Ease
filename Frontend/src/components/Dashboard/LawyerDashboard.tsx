import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  FileText,
  MessageSquare,
  Clock,
  ArrowUp,
  ArrowDown,
  Link,
} from "lucide-react";
import { Button } from "../ui/button";
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
    clientCases: number;
    upcomingMeetings: Array<{
      id: string;
      title: string;
      date: string;
      participants: number;
    }>;
    activeClients: number;
    casesWon: number;
  };
}

export function LawyerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [recentCases, setRecentCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('LawyerDashboard: Starting data fetch...');
        console.log('LawyerDashboard: User:', user);
        
        const [dashboardResponse, casesResponse] = await Promise.all([
          analytics.getDashboard(),
          cases.getCases(),
        ]);
        
        console.log('LawyerDashboard: Dashboard response:', dashboardResponse);
        console.log('LawyerDashboard: Cases response:', casesResponse);
        
        setDashboardData(dashboardResponse);
        // Handle the API response structure: { eFiledCases: [...], pagination: {...} }
        const casesArray = casesResponse?.eFiledCases || [];
        setRecentCases(Array.isArray(casesArray) ? casesArray.slice(0, 3) : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        console.error('Error details:', {
          message: err instanceof Error ? err.message : 'Unknown error',
          response: (err as any)?.response?.data,
          status: (err as any)?.response?.status
        });
        setError(`Failed to load dashboard data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    } else {
      console.log('LawyerDashboard: No user found, not fetching data');
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
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

  const stats = [
    {
      title: "Active Cases",
      value: (dashboardData?.roleSpecific?.clientCases || 0).toString(),
      change: "+3",
      trend: "up",
      icon: FileText,
      description: "Current client cases",
    },
    {
      title: "Upcoming Meetings",
      value: (dashboardData?.roleSpecific?.upcomingMeetings?.length || 0).toString(),
      change: "+2",
      trend: "up",
      icon: Calendar,
      description: "Scheduled meetings",
    },
    {
      title: "Active Clients",
      value: (dashboardData?.roleSpecific?.activeClients || 0).toString(),
      change: "+1",
      trend: "up",
      icon: Clock,
      description: "Current clients",
    },
    {
      title: "Cases Won",
      value: (dashboardData?.roleSpecific?.casesWon || 0).toString(),
      change: "+5%",
      trend: "up",
      icon: FileText,
      description: "Success rate",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          {/* <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.fullName}
          </h1> */}
          <p className="text-gray-600 dark:text-gray-400">
            Manage your legal practice and client cases efficiently.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate('/filecase')} size="sm" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> New Case
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                {stat.trend === "up" ? (
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span
                  className={
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  }
                >
                  {stat.change}
                </span>
                <span className="text-muted-foreground ml-1">
                  {stat.description}
                </span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Case Activity */}
        <Card className="col-span-1 hover-card">
          <CardHeader>
            <CardTitle>Recent Case Activity</CardTitle>
            <CardDescription>Updates on your active cases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCases.length > 0 ? (
                recentCases.map((case_, index) => (
                  <div key={case_._id} className="flex items-start space-x-4">
                    <div className="h-9 w-9 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {case_.caseNumber}: {case_.litigant.name} vs {case_.case.causeAgainstWhom}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Status: {case_.status} - {case_.case.caseType} case
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Filed: {new Date(case_.filingDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent case activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Meetings */}
        <Card className="col-span-1 hover-card">
          <CardHeader>
            <CardTitle>Upcoming Meetings</CardTitle>
            <CardDescription>Scheduled client meetings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(dashboardData?.roleSpecific?.upcomingMeetings?.length || 0) > 0 ? (
                (dashboardData?.roleSpecific?.upcomingMeetings || []).map((meeting, index) => (
                  <div
                    key={meeting.id}
                    className="bg-secondary/50 dark:bg-justice-800/50 rounded-lg p-4"
                  >
                    <p className="text-sm font-medium">{meeting.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(meeting.date).toLocaleDateString()} • {new Date(meeting.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <div className="flex items-center mt-3">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <Calendar className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">
                        {meeting.participants} participants
                      </span>
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
    </div>
  );
}
