import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Plus, Search, AlertTriangle, CheckCircle } from "lucide-react";

const statusColors: Record<string, string> = {
  excellent: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  good: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  fair: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  poor: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
};

const warrantyColors: Record<string, string> = {
  valid: "text-green-600",
  expired: "text-red-600",
  expiring_soon: "text-yellow-600",
};

export default function DevicesList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: devices, isLoading, error } = trpc.devices.list.useQuery();

  const filteredDevices = devices?.filter((device) => {
    const matchesSearch =
      (device.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      device.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.model?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCondition = statusFilter === "all" || device.condition === statusFilter;

    return matchesSearch && matchesCondition;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Device & Asset Management</h1>
          <p className="text-muted-foreground mt-2">Track and manage client devices and assets</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Register Device
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Total Devices</p>
              <p className="text-3xl font-bold text-foreground">{devices?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Excellent</p>
              <p className="text-3xl font-bold text-green-600">
                {devices?.filter((d) => d.condition === "excellent").length || 0}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Fair/Poor</p>
              <p className="text-3xl font-bold text-yellow-600">
                {devices?.filter((d) => d.condition === "fair" || d.condition === "poor").length || 0}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Warranty Expired</p>
              <p className="text-3xl font-bold text-red-600">
                {devices?.filter((d) => {
                  if (!d.warrantyExpiry) return false;
                  const expiry = new Date(d.warrantyExpiry);
                  return expiry < new Date();
                }).length || 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by serial, type, or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Condition Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>

            {/* Results Count */}
            <div className="flex items-center justify-end text-sm text-muted-foreground">
              {filteredDevices.length} device{filteredDevices.length !== 1 ? "s" : ""} found
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Devices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Device Registry</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-muted-foreground">Loading devices...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">Failed to load devices</p>
            </div>
          ) : filteredDevices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No devices found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Warranty</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDevices.map((device) => {
                    let warrantyStatus = "valid";
                    if (device.warrantyExpiry) {
                      const warrantyExpiry = new Date(device.warrantyExpiry);
                      const now = new Date();
                      const daysUntilExpiry = Math.ceil(
                        (warrantyExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                      );
                      if (daysUntilExpiry < 0) {
                        warrantyStatus = "expired";
                      } else if (daysUntilExpiry < 30) {
                        warrantyStatus = "expiring_soon";
                      }
                    }

                    return (
                      <TableRow key={device.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono font-bold">{device.serialNumber || "N/A"}</TableCell>
                        <TableCell className="capitalize">{device.type}</TableCell>
                        <TableCell>{device.model || "-"}</TableCell>
                        <TableCell className="text-sm">{device.clientId ? `Client #${device.clientId}` : "Unassigned"}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[device.condition] || ""}>
                            {device.condition}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {device.warrantyExpiry && (
                              <>
                                {warrantyStatus === "expired" && (
                                  <AlertTriangle className="w-4 h-4 text-red-600" />
                                )}
                                {warrantyStatus === "valid" && (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                                <span className={`text-sm ${warrantyColors[warrantyStatus]}`}>
                                  {new Date(device.warrantyExpiry).toLocaleDateString()}
                                </span>
                              </>
                            )}
                            {!device.warrantyExpiry && <span className="text-sm text-muted-foreground">N/A</span>}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {device.createdAt ? new Date(device.createdAt).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell>
                          <a href="#" className="text-primary hover:underline text-sm font-medium">
                            View
                          </a>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
