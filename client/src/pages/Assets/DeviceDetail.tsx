import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, AlertTriangle, CheckCircle2 } from "lucide-react";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100",
  maintenance: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  retired: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
};

export default function DeviceDetail() {
  const [match, params] = useRoute("/devices/:id");
  const deviceId = params?.id ? parseInt(params.id) : null;

  const { data: allDevices, isLoading, error } = trpc.devices.list.useQuery();
  const device = allDevices?.find((d: any) => d.id === deviceId);

  if (!match || !deviceId) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Device not found</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading device details...</p>
        </div>
      </div>
    );
  }

  if (error || !device) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load device</p>
      </div>
    );
  }

  const warrantyStatus = device.warrantyExpiry
    ? new Date(device.warrantyExpiry) > new Date()
      ? "active"
      : "expired"
    : "none";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/devices" className="text-primary hover:underline">
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{device.name}</h1>
            <p className="text-muted-foreground mt-1">Serial: {device.serialNumber}</p>
          </div>
        </div>
        <Button className="gap-2">Edit Device</Button>
      </div>

      {/* Status and Warranty */}
      <div className="flex gap-2">
        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 capitalize">
          {device.condition}
        </Badge>
        {warrantyStatus === "active" && (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Warranty Active
          </Badge>
        )}
        {warrantyStatus === "expired" && (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 gap-1">
            <AlertTriangle className="w-3 h-3" />
            Warranty Expired
          </Badge>
        )}
      </div>

      {/* Device Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Device Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Device Type</p>
              <p className="font-medium">{device.type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Model</p>
              <p className="font-medium">{device.model || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Serial Number</p>
              <p className="font-mono text-sm">{device.serialNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Client</p>
              <p className="font-medium">Client #{device.clientId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <p className="font-medium capitalize">Active</p>
            </div>
          </CardContent>
        </Card>

        {/* Warranty Info */}
        <Card>
          <CardHeader>
            <CardTitle>Warranty & Maintenance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Warranty Expiry</p>
              <p className="font-medium">
                {device.warrantyExpiry ? new Date(device.warrantyExpiry).toLocaleDateString() : "No warranty"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Condition</p>
              <p className="font-medium capitalize">{device.condition}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Last Service</p>
              <p className="font-medium">March 15, 2026</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Repair History & Related */}
      <Card>
        <CardHeader>
          <CardTitle>Repair History & Related Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="repairs" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="repairs">Repair History</TabsTrigger>
              <TabsTrigger value="jobs">Related Jobs</TabsTrigger>
              <TabsTrigger value="inventory">Parts Used</TabsTrigger>
            </TabsList>

            <TabsContent value="repairs" className="mt-4">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">Screen Replacement</p>
                      <p className="text-sm text-muted-foreground">March 15, 2026</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Completed</Badge>
                  </div>
                  <p className="text-sm">Replaced broken LCD screen. Device fully functional.</p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">Battery Service</p>
                      <p className="text-sm text-muted-foreground">February 28, 2026</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Completed</Badge>
                  </div>
                  <p className="text-sm">Battery replacement and diagnostics performed.</p>
                </div>

                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">No more repair records</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="jobs" className="mt-4">
              <div className="text-center py-8">
                <p className="text-muted-foreground">No jobs associated with this device</p>
              </div>
            </TabsContent>

            <TabsContent value="inventory" className="mt-4">
              <div className="text-center py-8">
                <p className="text-muted-foreground">No parts used yet</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Device Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            No notes recorded for this device
          </p>
          <Button variant="outline">Edit Notes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
