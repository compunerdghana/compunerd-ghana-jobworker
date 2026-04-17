import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Clock, MapPin, Phone } from "lucide-react";

export default function EngineerDetail() {
  const [match, params] = useRoute("/engineers/:id");
  const engineerId = params?.id ? parseInt(params.id) : null;

  const { data: allEngineers, isLoading, error } = trpc.engineers.list.useQuery();
  const engineer = allEngineers?.find((e: any) => e.id === engineerId);

  if (!match || !engineerId) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Engineer not found</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading engineer details...</p>
        </div>
      </div>
    );
  }

  if (error || !engineer) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load engineer</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/engineers" className="text-primary hover:underline">
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{engineer.fullName}</h1>
            <p className="text-muted-foreground mt-1">Field Engineer</p>
          </div>
        </div>
        <Button className="gap-2">Edit Profile</Button>
      </div>

      {/* Status */}
      <div className="flex gap-2">
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
          Available
        </Badge>
        <Badge variant="outline">On Duty</Badge>
      </div>

      {/* Engineer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{engineer.phone || "Not provided"}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">User ID</p>
              <p className="font-medium">#{engineer.userId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Specialization</p>
              <p className="font-medium">{engineer.specialization || "General"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Jobs Completed</p>
              <p className="text-2xl font-bold">24</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Average Rating</p>
              <p className="text-2xl font-bold">4.8/5</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Jobs</p>
              <p className="text-2xl font-bold">2</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignments and Work Log */}
      <Card>
        <CardHeader>
          <CardTitle>Assignments & Work Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="assignments" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="assignments">Current Assignments</TabsTrigger>
              <TabsTrigger value="worklog">Work Log</TabsTrigger>
            </TabsList>

            <TabsContent value="assignments" className="mt-4">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">Job #TK-001</p>
                      <p className="text-sm text-muted-foreground">Printer repair at School</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                      In Progress
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <MapPin className="w-3 h-3" />
                    Accra Central
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">Job #TK-002</p>
                      <p className="text-sm text-muted-foreground">Network setup at Business</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                      Open
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <MapPin className="w-3 h-3" />
                    Osu
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="worklog" className="mt-4">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">Check-in</p>
                      <p className="text-sm text-muted-foreground">April 16, 2026 - 08:30 AM</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      Checked In
                    </Badge>
                  </div>
                  <p className="text-sm mt-2">Location: Head Office</p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">Job Completed</p>
                      <p className="text-sm text-muted-foreground">April 15, 2026 - 03:45 PM</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      Completed
                    </Badge>
                  </div>
                  <p className="text-sm mt-2">Job #TK-098: Router configuration - Completed successfully</p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">Check-out</p>
                      <p className="text-sm text-muted-foreground">April 15, 2026 - 05:30 PM</p>
                    </div>
                    <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
                      Checked Out
                    </Badge>
                  </div>
                  <p className="text-sm mt-2">Location: Head Office</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Check-in/Check-out */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Daily Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <div>
              <p className="font-semibold text-green-900 dark:text-green-100">Currently Checked In</p>
              <p className="text-sm text-green-700 dark:text-green-300">Since 08:30 AM</p>
            </div>
            <Button variant="destructive">Check Out</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
