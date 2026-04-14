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
import { trpc } from "@/lib/trpc";
import { Plus, Search, AlertTriangle, TrendingDown } from "lucide-react";

export default function InventoryList() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: items, isLoading, error } = trpc.inventory.list.useQuery();

  const filteredItems = items?.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  }) || [];

  const lowStockItems = items?.filter((item) => item.quantity <= item.reorderLevel) || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory & Warehouse</h1>
          <p className="text-muted-foreground mt-2">Manage stock and inventory levels</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Total Items</p>
              <p className="text-3xl font-bold text-foreground">{items?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Total Quantity</p>
              <p className="text-3xl font-bold text-foreground">
                {items?.reduce((sum, item) => sum + item.quantity, 0) || 0}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Low Stock Alerts</p>
              <p className="text-3xl font-bold text-red-600">{lowStockItems.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Inventory Value</p>
              <p className="text-3xl font-bold text-foreground">
                ₵{(
                  items?.reduce((sum, item) => {
                    const price = Number(item.purchasePrice) || 0;
                    return sum + price * item.quantity;
                  }, 0) || 0
                ).toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-900 dark:text-yellow-100">
              <AlertTriangle className="w-5 h-5" />
              Low Stock Alerts ({lowStockItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white dark:bg-yellow-900/20 rounded-md">
                  <div>
                    <p className="font-medium text-yellow-900 dark:text-yellow-100">{item.name}</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-200">
                      {item.quantity} units (Reorder level: {item.reorderLevel})
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Reorder
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by item name, type, or supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Items</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-muted-foreground">Loading inventory...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">Failed to load inventory</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No items found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Reorder Level</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const isLowStock = item.quantity <= item.reorderLevel;
                    const totalValue = (Number(item.purchasePrice) || 0) * item.quantity;

                    return (
                      <TableRow key={item.id} className={`hover:bg-muted/50 ${isLowStock ? "bg-yellow-50 dark:bg-yellow-950/20" : ""}`}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-sm">{item.type || "-"}</TableCell>
                        <TableCell>
                          <span className={isLowStock ? "font-bold text-red-600" : ""}>
                            {item.quantity}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">{item.reorderLevel}</TableCell>
                        <TableCell className="text-sm">
                          ₵{Number(item.purchasePrice || 0).toFixed(2)}
                        </TableCell>
                        <TableCell className="font-medium">
                          ₵{totalValue.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-sm">{item.supplier || "-"}</TableCell>
                        <TableCell>
                          {isLowStock ? (
                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 gap-1">
                              <TrendingDown className="w-3 h-3" />
                              Low Stock
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                              In Stock
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <a href="#" className="text-primary hover:underline text-sm font-medium">
                            Edit
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
