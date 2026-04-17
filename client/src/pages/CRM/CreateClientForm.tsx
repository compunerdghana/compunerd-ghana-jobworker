import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";

const clientSchema = z.object({
  name: z.string().min(1, "Client name is required"),
  type: z.enum(["school", "business", "hotel", "pharmacy", "supermarket", "individual"]),
  status: z.enum(["lead", "active", "dormant"]).default("lead"),
  industry: z.string().optional(),
  location: z.string().optional(),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  serviceAgreement: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

export default function CreateClientForm() {
  const [, setLocation] = useLocation();
  const createMutation = trpc.crm.clients.create.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      status: "lead",
    },
  });

  // const clientType = watch("type");

  const onSubmit = async (data: any) => {
    try {
      await createMutation.mutateAsync({
        name: data.name,
        type: data.type,
        location: data.location,
        contactPerson: data.contactPerson,
        phone: data.phone,
        email: data.email || undefined,
      });
      toast.success("Client created successfully!");
      setLocation("/clients");
    } catch (error) {
      toast.error("Failed to create client");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Add New Client</h1>
        <p className="text-muted-foreground mt-2">Create a new client record in the system</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Client Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter client name"
                  {...register("name")}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="type">Client Type *</Label>
                <Select
                  onValueChange={(value: any) =>
                    setValue("type", value)
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="school">School</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="hotel">Hotel</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="supermarket">Supermarket</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  onValueChange={(value: any) =>
                    setValue("status", value)
                  }
                  defaultValue="lead"
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="dormant">Dormant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  placeholder="e.g., Retail, Education"
                  {...register("industry")}
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    placeholder="Name of primary contact"
                    {...register("contactPerson")}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+233 XX XXX XXXX"
                    {...register("phone")}
                  />
                </div>

                <div>
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="+233 XX XXX XXXX"
                    {...register("whatsapp")}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="client@example.com"
                    {...register("email")}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Physical address or location"
                    {...register("location")}
                  />
                </div>
              </div>
            </div>

            {/* Service Agreement */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Service Agreement</h3>
              <div>
                <Label htmlFor="serviceAgreement">Agreement Details</Label>
                <Textarea
                  id="serviceAgreement"
                  placeholder="Enter service agreement terms and conditions"
                  className="min-h-[120px]"
                  {...register("serviceAgreement")}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="gap-2"
              >
                {createMutation.isPending ? "Creating..." : "Create Client"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/clients")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
