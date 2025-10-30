import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Users, FileText, Bell, Settings, Server, Shield, ArrowUp, ArrowDown } from "lucide-react";
import { analytics } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

interface DashboardData {
  casesCount: {
    total: number;
    active: number;
    processing: number;
    pending: number;
  };
  casesByType: Array<{
    type: string;
    count: number;
  }>;
  roleSpecific: {
    totalUsers: number;
    totalMeetings: number;
    systemStats: Array<{
      role: string;
      count: number;
    }>;
  };
}

export function AdminDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
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
      fetchData();
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
      title: "Total Users",
      value: dashboardData.roleSpecific.totalUsers.toString(),
      trend: "up",
      change: "+12%",
      description: "System users",
      icon: Users
    },
    {
      title: "Total Cases",
      value: dashboardData.casesCount.total.toString(),
      trend: "up",
      change: "+5%",
      description: "All cases",
      icon: FileText
    },
    {
      title: "Active Cases",
      value: dashboardData.casesCount.active.toString(),
      trend: "up",
      change: "+3%",
      description: "Currently active",
      icon: FileText
    },
    {
      title: "Total Meetings",
      value: dashboardData.roleSpecific.totalMeetings.toString(),
      trend: "up",
      change: "+8%",
      description: "Scheduled meetings",
      icon: Bell
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="mb-6">
        {/* <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard - Welcome, {user?.fullName}
        </h1> */}
        <p className="text-gray-600 dark:text-gray-400">
          System overview and management console for Legal-Ease platform.
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
              <p className="text-xs flex items-center mt-2">
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
      
      {/* Case Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Case Status Distribution</CardTitle>
            <CardDescription>Current status of all cases in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Active Cases</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {dashboardData.casesCount.active}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium">Processing Cases</span>
                </div>
                <span className="text-lg font-bold text-yellow-600">
                  {dashboardData.casesCount.processing}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 bg-gray-500 rounded-full"></div>
                  <span className="text-sm font-medium">Pending Cases</span>
                </div>
                <span className="text-lg font-bold text-gray-600">
                  {dashboardData.casesCount.pending}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Distribution by Role</CardTitle>
            <CardDescription>System users categorized by their roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.roleSpecific.systemStats.map((stat, index) => (
                <div key={stat.role} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`h-3 w-3 rounded-full ${
                      stat.role === 'judge' ? 'bg-purple-500' :
                      stat.role === 'lawyer' ? 'bg-blue-500' :
                      stat.role === 'litigant' ? 'bg-green-500' :
                      'bg-gray-500'
                    }`}></div>
                    <span className="text-sm font-medium capitalize">{stat.role}s</span>
                  </div>
                  <span className="text-lg font-bold">{stat.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cases by Type */}
      <Card>
        <CardHeader>
          <CardTitle>Cases by Type</CardTitle>
          <CardDescription>Distribution of cases across different legal categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardData.casesByType.map((caseType, index) => (
              <div key={caseType.type} className="text-center p-4 bg-secondary/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{caseType.count}</div>
                <div className="text-sm text-muted-foreground">{caseType.type} Cases</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">All systems operational</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">No security threats</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Optimal performance</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
