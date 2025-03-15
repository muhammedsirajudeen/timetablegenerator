"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimetableGridProps {
  days?: string[]
  periods?: number[]
}

export function TimetableGrid({
  days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  periods = [1, 2, 3, 4, 5, 6],
}: TimetableGridProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Day / Period</TableHead>
            {periods.map((period) => (
              <TableHead key={period}>Period {period}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {days.map((day) => (
            <TableRow key={day}>
              <TableCell className="font-medium">{day}</TableCell>
              {periods.map((period) => (
                <TableCell key={`${day}-${period}`} className="min-w-[150px]">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-gray-700">Not Assigned</span>
                    <Select>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="math">Mathematics</SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="biology">Biology</SelectItem>
                        <SelectItem value="computer">Computer Science</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

