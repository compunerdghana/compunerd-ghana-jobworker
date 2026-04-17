import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  open: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  in_progress: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  closed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100",
};

const priorityColors: Record<string, string> = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
  emergency: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
};

export default function JobDetail() {
  const [match, params] = useRoute("/jobs/:id");
  const jobId = params?.id ? parseInt(params.id) : null;
  const [jobNotes, setJobNotes] = useState("");

  const { data: allJobs, isLoading, error } = trpc.jobs.list.useQuery();
  const job = allJobs?.find((j: any) => j.id === jobId);

  if (!match || !jobId) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Job not found</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load job</p>
      </div>
    );
  }

  const statusFlow = ["open", "in_progress", "resolved", "closed"];
  const currentStatusIndex = statusFlow.indexOf(job.status);

  const handleStatusChange = (newStatus: string) => {
    toast.success(`Job status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/jobs" className="text-primary hover:underline">
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Job #{job.id}</h1>
            <p className="text-muted-foreground mt-1">{job.description?.substring(0, 100) || "No description"}</p>
          </div>
        </div>
        <Button className="gap-2">Edit Job</Button>
      </div>

      {/* Status and Priority */}
      <div className="flex gap-2">
        <Badge className={statusColors[job.status] || ""}>
          {job.status.replace(/_/g, " ")}
        </Badge>
        <Badge className={priorityColors[job.priority] || ""}>
          {job.priority}
        </Badge>
      </div>

      {/* Status Workflow */}
      <Card>
        <CardHeader>
          <CardTitle>Job Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {statusFlow.map((status, index) => (
              <div key={status} className="flex items-center flex-1">
                <button
                  onClick={() => handleStatusChange(status)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    index <= currentStatusIndex
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground text-muted-foreground"
                  }`}
                >
                  {index < currentStatusIndex ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </button>
                {index < statusFlow.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      index < currentStatusIndex ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-muted-foreground">
            <span>Open</span>
            <span>In Progress</span>
            <span>Resolved</span>
            <span>Closed</span>
          </div>
        </CardContent>
      </Card>

      {/* Main Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Details */}
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Client ID</p>
              <p className="font-medium">Client #{job.clientId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Description</p>
              <p className="text-sm">{job.description || "No description provided"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Assigned Engineer</p>
              <p className="font-medium">{job.assignedEngineerId ? `Engineer #${job.assignedEngineerId}` : "Not assigned"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Issue Type</p>
              <p className="font-medium">{job.issueType}</p>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Created</p>
              <p className="font-medium">{new Date(job.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
              <p className="font-medium">{new Date(job.updatedAt).toLocaleString()}</p>
            </div>
            {job.completedAt && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Completed</p>
                <p className="font-medium">{new Date(job.completedAt).toLocaleString()}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notes and Comments */}
      <Card>
        <CardHeader>
          <CardTitle>Job Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Add notes about this job..."
            value={jobNotes}
            onChange={(e) => setJobNotes(e.target.value)}
            className="min-h-[100px]"
          />
          <Button className="w-full">Save Notes</Button>
        </CardContent>
      </Card>

      {/* Related Items */}
      <Card>
        <CardHeader>
          <CardTitle>Related Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="devices" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="inventory">Inventory Used</TabsTrigger>
            </TabsList>

            <TabsContent value="devices" className="mt-4">
              <div className="text-center py-8">
                <p className="text-muted-foreground">No devices associated with this job</p>
              </div>
            </TabsContent>

            <TabsContent value="inventory" className="mt-4">
              <div className="text-center py-8">
                <p className="text-muted-foreground">No inventory items used yet</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
