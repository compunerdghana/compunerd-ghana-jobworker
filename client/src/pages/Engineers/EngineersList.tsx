import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Plus, Clock, CheckCircle, Phone } from "lucide-react";

export default function EngineersList() {
  const { data: engineers, isLoading, error } = trpc.engineers.list.useQuery();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Field Engineers</h1>
          <p className="text-muted-foreground mt-2">Manage field service engineers and assignments</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Engineer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Total Engineers</p>
              <p className="text-3xl font-bold text-foreground">{engineers?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">On Duty</p>
              <p className="text-3xl font-bold text-green-600">
                {engineers?.filter((e) => e.isOnDuty).length || 0}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Off Duty</p>
              <p className="text-3xl font-bold text-gray-600">
                {engineers?.filter((e) => !e.isOnDuty).length || 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engineers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Engineer Directory</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-muted-foreground">Loading engineers...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">Failed to load engineers</p>
            </div>
          ) : engineers?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No engineers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Check-In</TableHead>
                    <TableHead>Last Check-Out</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {engineers?.map((engineer) => (
                    <TableRow key={engineer.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{engineer.fullName}</TableCell>
                      <TableCell>
                        {engineer.phone ? (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            {engineer.phone}
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{engineer.specialization || "-"}</TableCell>
                      <TableCell>
                        {engineer.isOnDuty ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 gap-1">
                            <CheckCircle className="w-3 h-3" />
                            On Duty
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100 gap-1">
                            <Clock className="w-3 h-3" />
                            Off Duty
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {engineer.lastCheckIn
                          ? new Date(engineer.lastCheckIn).toLocaleString()
                          : "Never"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {engineer.lastCheckOut
                          ? new Date(engineer.lastCheckOut).toLocaleString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <a href="#" className="text-primary hover:underline text-sm font-medium">
                          View
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
