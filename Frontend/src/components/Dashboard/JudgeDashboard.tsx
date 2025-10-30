import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, Users, Gavel, ArrowUp, ArrowDown } from "lucide-react";
import { CourtCalendar } from "@/components/Dashboard/CourtCalendar";
import { analytics } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

interface DashboardData {
  casesCount: {
    total: number;
    active: number;
    processing: number;
    pending: number;
  };
  roleSpecific: {
    assignedCases: number;
    todayHearings: number;
    casesResolved: number;
    caseBacklog: number;
    upcomingHearings: Array<{
      id: string;
      title: string;
      date: string;
      participants: number;
      type: string;
    }>;
    recentRulings: Array<{
      id: string;
      caseNumber: string;
      title: string;
      status: string;
      date: string;
    }>;
  };
}

export function JudgeDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await analytics.getDashboard();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
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
      title: "Assigned Cases",
      value: dashboardData.roleSpecific.assignedCases.toString(),
      change: "+5%",
      trend: "up",
      icon: FileText,
      description: "Active cases",
    },
    {
      title: "Hearings Today",
      value: dashboardData.roleSpecific.todayHearings.toString(),
      change: "+2",
      trend: "up",
      icon: Calendar,
      description: "Scheduled today",
    },
    {
      title: "Cases Resolved",
      value: dashboardData.roleSpecific.casesResolved.toString(),
      change: "+12%",
      trend: "up",
      icon: Gavel,
      description: "Total resolved",
    },
    {
      title: "Case Backlog",
      value: dashboardData.roleSpecific.caseBacklog.toString(),
      change: "-4%",
      trend: "down",
      icon: FileText,
      description: "Pending cases",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="mb-6">
        {/* <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.fullName}
        </h1> */}
        <p className="text-gray-600 dark:text-gray-400">
          Here's an overview of your court activities and case management.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
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
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground ml-1">{stat.description}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Court Calendar Section */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Court Calendar</CardTitle>
          <CardDescription>Manage your court schedule and hearings</CardDescription>
        </CardHeader>
        <CardContent>
          <CourtCalendar />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Rulings */}
        <Card className="col-span-1 hover-card">
          <CardHeader>
            <CardTitle>Recent Rulings</CardTitle>
            <CardDescription>Your recent case decisions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.roleSpecific.recentRulings.length > 0 ? (
                dashboardData.roleSpecific.recentRulings.map((ruling, index) => (
                  <div key={ruling.id} className="flex items-start space-x-4">
                    <div className="h-9 w-9 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Gavel className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{ruling.caseNumber}: {ruling.title}</p>
                      <p className="text-sm text-muted-foreground">Status: {ruling.status}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(ruling.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent rulings</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Hearings */}
        <Card className="col-span-1 hover-card">
          <CardHeader>
            <CardTitle>Upcoming Hearings</CardTitle>
            <CardDescription>Your court schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.roleSpecific.upcomingHearings.length > 0 ? (
                dashboardData.roleSpecific.upcomingHearings.map((hearing, index) => (
                  <div key={hearing.id} className="bg-secondary/50 dark:bg-justice-800/50 rounded-lg p-4">
                    <p className="text-sm font-medium">{hearing.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(hearing.date).toLocaleDateString()} • {new Date(hearing.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <div className="flex items-center mt-3">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">
                        {hearing.type}, {hearing.participants} participants
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No upcoming hearings</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
