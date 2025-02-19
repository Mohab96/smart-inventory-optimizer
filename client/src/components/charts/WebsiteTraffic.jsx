import { useState } from "react";
import { Tooltip } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { CalendarIcon, ChevronDown } from "lucide-react";

const WebsiteTraffic = () => {
  const [selectedDateRange, setSelectedDateRange] = useState("Last 7 Days");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const data = [
    { day: "Sun", visits: 120 },
    { day: "Mon", visits: 150 },
    { day: "Tue", visits: 180 },
    { day: "Wed", visits: 200 },
    { day: "Thu", visits: 220 },
    { day: "Fri", visits: 170 },
    { day: "Sat", visits: 130 },
  ];

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Website Traffic</CardTitle>
        <Tooltip content="Website traffic for the selected date range">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                {selectedDateRange} <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setSelectedDateRange("Last 7 Days")}
              >
                Last 7 Days
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedDateRange("Last 30 Days")}
              >
                Last 30 Days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDatePickerOpen(true)}>
                Custom Range <CalendarIcon className="w-4 h-4 ml-2" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Tooltip>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="day" />
            <YAxis />
            <RechartsTooltip />
            <Bar dataKey="visits" fill="#4F46E5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
      {datePickerOpen && (
        <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg p-4">
          <Calendar
            onChange={(date) => {
              setSelectedDateRange(date.toDateString());
              setDatePickerOpen(false);
            }}
          />
        </div>
      )}
    </Card>
  );
};

export default WebsiteTraffic;
