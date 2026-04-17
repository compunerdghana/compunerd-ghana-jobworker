import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Mail, Phone, MapPin, FileText, Edit, ArrowLeft } from "lucide-react";

export default function ClientDetail() {
  const [match, params] = useRoute("/clients/:id");
  const clientId = params?.id ? parseInt(params.id) : null;

  // For now, we'll fetch from the CRM list and find the one we need
  const { data: allClients, isLoading, error } = trpc.crm.clients.list.useQuery();
  const client = allClients?.find((c: any) => c.id === clientId);

  if (!match || !clientId) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Client not found</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading client details...</p>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load client</p>
      </div>
    );
  }

  const typeColors: Record<string, string> = {
    school: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    business: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
    hotel: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
    pharmacy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    supermarket: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    individual: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100",
  };

  const statusColors: Record<string, string> = {
    lead: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    dormant: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/clients" className="text-primary hover:underline">
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{client.name}</h1>
            <p className="text-muted-foreground mt-1">{client.industry || "No industry specified"}</p>
          </div>
        </div>
        <Button className="gap-2">
          <Edit className="w-4 h-4" />
          Edit
        </Button>
      </div>

      {/* Status Badges */}
      <div className="flex gap-2">
        <Badge className={typeColors[client.type] || ""}>
          {client.type}
        </Badge>
        <Badge className={statusColors[client.status] || ""}>
          {client.status}
        </Badge>
      </div>

      {/* Main Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Contact Person</p>
              <p className="font-medium">{client.contactPerson || "Not specified"}</p>
            </div>
            {client.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <a href={`tel:${client.phone}`} className="text-primary hover:underline">
                  {client.phone}
                </a>
              </div>
            )}
            {client.whatsapp && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <a href={`https://wa.me/${client.whatsapp}`} className="text-primary hover:underline">
                  WhatsApp: {client.whatsapp}
                </a>
              </div>
            )}
            {client.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <a href={`mailto:${client.email}`} className="text-primary hover:underline">
                  {client.email}
                </a>
              </div>
            )}
            {client.location && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                <p className="text-sm">{client.location}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Service Agreement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Service Agreement
            </CardTitle>
          </CardHeader>
          <CardContent>
            {client.serviceAgreement ? (
              <p className="text-sm whitespace-pre-wrap">{client.serviceAgreement}</p>
            ) : (
              <p className="text-muted-foreground text-sm">No service agreement on file</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Related Data */}
      <Card>
        <CardHeader>
          <CardTitle>Client Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="jobs" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
            </TabsList>
            
            <TabsContent value="jobs" className="mt-4">
              <div className="text-center py-8">
                <p className="text-muted-foreground">No jobs associated with this client yet</p>
              </div>
            </TabsContent>
            
            <TabsContent value="devices" className="mt-4">
              <div className="text-center py-8">
                <p className="text-muted-foreground">No devices registered for this client</p>
              </div>
            </TabsContent>
            
            <TabsContent value="invoices" className="mt-4">
              <div className="text-center py-8">
                <p className="text-muted-foreground">No invoices for this client</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="font-medium">{new Date(client.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Updated</p>
              <p className="font-medium">{new Date(client.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
