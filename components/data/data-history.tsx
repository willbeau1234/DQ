"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/dialog"
import { Edit, Trash2, Download, Search } from "lucide-react"

interface DataEntry {
  id: string
  date: string
  location: string
  locationName: string
  sales: number
  transactions: number
  laborHours: number
  laborCost: number
  driveThruTime: number
  customerSatisfaction: number
  source: "CSV" | "Manual"
  createdAt: string
}

export function DataHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")

  // Mock data
  const dataEntries: DataEntry[] = [
    {
      id: "1",
      date: "2025-08-23",
      location: "DQ001",
      locationName: "Downtown Location",
      sales: 4850.75,
      transactions: 247,
      laborHours: 48.5,
      laborCost: 728.5,
      driveThruTime: 125,
      customerSatisfaction: 4.2,
      source: "Manual",
      createdAt: "2025-08-23 18:30",
    },
    {
      id: "2",
      date: "2025-08-22",
      location: "DQ002",
      locationName: "Mall Location",
      sales: 5120.25,
      transactions: 268,
      laborHours: 52.0,
      laborCost: 780.0,
      driveThruTime: 118,
      customerSatisfaction: 4.5,
      source: "CSV",
      createdAt: "2025-08-22 20:15",
    },
    {
      id: "3",
      date: "2025-08-22",
      location: "DQ001",
      locationName: "Downtown Location",
      sales: 4650.0,
      transactions: 235,
      laborHours: 46.0,
      laborCost: 690.0,
      driveThruTime: 132,
      customerSatisfaction: 4.0,
      source: "CSV",
      createdAt: "2025-08-22 20:15",
    },
    {
      id: "4",
      date: "2025-08-21",
      location: "DQ003",
      locationName: "Airport Location",
      sales: 6200.5,
      transactions: 312,
      laborHours: 58.5,
      laborCost: 877.5,
      driveThruTime: 95,
      customerSatisfaction: 4.8,
      source: "Manual",
      createdAt: "2025-08-21 19:45",
    },
  ]

  const locations = [
    { id: "DQ001", name: "Downtown Location" },
    { id: "DQ002", name: "Mall Location" },
    { id: "DQ003", name: "Airport Location" },
    { id: "DQ004", name: "University Location" },
    { id: "DQ005", name: "Suburban Location" },
    { id: "DQ006", name: "Highway Location" },
  ]

  const filteredEntries = dataEntries.filter((entry) => {
    const matchesSearch =
      entry.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.date.includes(searchTerm)

    const matchesLocation = locationFilter === "all" || entry.location === locationFilter
    const matchesSource = sourceFilter === "all" || entry.source.toLowerCase() === sourceFilter

    return matchesSearch && matchesLocation && matchesSource
  })

  const handleDelete = (id: string) => {
    // Mock delete functionality
    console.log("Deleting entry:", id)
  }

  const handleEdit = (id: string) => {
    // Mock edit functionality
    console.log("Editing entry:", id)
  }

  const handleExport = () => {
    // Mock export functionality
    console.log("Exporting data...")
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Data History</CardTitle>
          <CardDescription>View and manage all your uploaded and entered data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by location, date, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.id} - {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleExport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead>Labor %</TableHead>
                  <TableHead>Drive-Thru</TableHead>
                  <TableHead>Satisfaction</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.date}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{entry.location}</p>
                        <p className="text-sm text-muted-foreground">{entry.locationName}</p>
                      </div>
                    </TableCell>
                    <TableCell>${entry.sales.toLocaleString()}</TableCell>
                    <TableCell>{entry.transactions}</TableCell>
                    <TableCell>{((entry.laborCost / entry.sales) * 100).toFixed(1)}%</TableCell>
                    <TableCell>{entry.driveThruTime}s</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span>{entry.customerSatisfaction}</span>
                        <span className="text-yellow-500">★</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={entry.source === "Manual" ? "default" : "secondary"}>{entry.source}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{entry.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(entry.id)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Data Entry</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this data entry? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(entry.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredEntries.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No data entries found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{filteredEntries.length}</div>
            <p className="text-sm text-muted-foreground">Total Entries</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{filteredEntries.filter((e) => e.source === "Manual").length}</div>
            <p className="text-sm text-muted-foreground">Manual Entries</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{filteredEntries.filter((e) => e.source === "CSV").length}</div>
            <p className="text-sm text-muted-foreground">CSV Uploads</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              ${filteredEntries.reduce((sum, entry) => sum + entry.sales, 0).toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Total Sales</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
