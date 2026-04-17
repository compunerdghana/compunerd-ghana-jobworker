import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Calendar, DollarSign } from "lucide-react";

export default function StaffDetail() {
  const [match, params] = useRoute("/staff/:id");
  const staffId = params?.id ? parseInt(params.id) : null;

  const { data: allStaff, isLoading, error } = trpc.staff.list.useQuery();
  const staff = allStaff?.find((s: any) => s.id === staffId);

  if (!match || !staffId) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Staff member not found</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading staff details...</p>
        </div>
      </div>
    );
  }

  if (error || !staff) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load staff</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/staff" className="text-primary hover:underline">
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{staff.fullName}</h1>
            <p className="text-muted-foreground mt-1">Staff ID: {staff.id}</p>
          </div>
        </div>
        <Button className="gap-2">Edit Profile</Button>
      </div>

      {/* Status */}
      <div className="flex gap-2">
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 capitalize">
          Active
        </Badge>
        <Badge variant="outline" className="capitalize">{staff.role}</Badge>
      </div>

      {/* Staff Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Full Name</p>
              <p className="font-medium">{staff.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Phone</p>
              <p className="font-medium">{staff.phone || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">User ID</p>
              <p className="font-medium">#{staff.userId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Performance Score</p>
              <p className="font-medium">{staff.performanceScore || "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Employment Info */}
        <Card>
          <CardHeader>
            <CardTitle>Employment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Position</p>
              <p className="font-medium capitalize">{staff.role}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Commission</p>
              <p className="font-medium">₵{Number(staff.commission || 0).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Joined</p>
              <p className="font-medium">{new Date(staff.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Salary</p>
              <p className="font-medium">₵{Number(staff.salary || 0).toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance & Payroll */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance & Payroll</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="attendance" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="payroll">Payroll</TabsTrigger>
            </TabsList>

            <TabsContent value="attendance" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-muted-foreground text-sm">Present Days</p>
                        <p className="text-3xl font-bold">18</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-muted-foreground text-sm">Absent Days</p>
                        <p className="text-3xl font-bold">2</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-muted-foreground text-sm">Leave Days</p>
                        <p className="text-3xl font-bold">5</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="font-semibold mb-3">Recent Attendance</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>April 16, 2026</span>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Present</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>April 15, 2026</span>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Present</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>April 14, 2026</span>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Absent</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>April 13, 2026</span>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Leave</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payroll" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-muted-foreground text-sm">Monthly Salary</p>
                        <p className="text-2xl font-bold">₵{Number(staff.salary || 0).toFixed(2)}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-muted-foreground text-sm">YTD Earnings</p>
                        <p className="text-2xl font-bold">₵{(Number(staff.salary || 0) * 4).toFixed(2)}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="font-semibold mb-3">Recent Payroll</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span>April 2026</span>
                      <div className="text-right">
                        <p className="font-medium">₵{Number(staff.salary || 0).toFixed(2)}</p>
                        <p className="text-muted-foreground text-xs">Paid</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>March 2026</span>
                      <div className="text-right">
                        <p className="font-medium">₵{Number(staff.salary || 0).toFixed(2)}</p>
                        <p className="text-muted-foreground text-xs">Paid</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>February 2026</span>
                      <div className="text-right">
                        <p className="font-medium">₵{Number(staff.salary || 0).toFixed(2)}</p>
                        <p className="text-muted-foreground text-xs">Paid</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
