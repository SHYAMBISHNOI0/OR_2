'use client';
import {
  ClipboardList,
  Users,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Pie, Cell } from 'recharts';
import * as RechartsPrimitive from 'recharts';
import { useOrchestrate } from '@/context/orchestrate-context';
import { useMemo } from 'react';

export default function AnalyticsTab() {
  const { equipment, users, requests } = useOrchestrate();

  const equipmentStatusData = useMemo(() => [
    { name: 'Available', value: equipment.filter(e => e.status === 'available').length, fill: 'var(--color-available)' },
    { name: 'Occupied', value: equipment.filter(e => e.status === 'occupied').length, fill: 'var(--color-occupied)' },
  ], [equipment]);

  const requestStatusData = useMemo(() => [
    { name: 'Pending', value: requests.filter(e => e.status === 'Pending').length, fill: 'var(--color-pending)' },
    { name: 'Assigned', value: requests.filter(e => e.status === 'Assigned').length, fill: 'var(--color-assigned)' },
    { name: 'Completed', value: requests.filter(e => e.status === 'Completed').length, fill: 'var(--color-completed)' },
  ], [requests]);


  const equipmentChartConfig = {
    value: {
      label: 'Equipment',
    },
    available: {
      label: 'Available',
      color: 'hsl(var(--chart-1))',
    },
    occupied: {
      label: 'Occupied',
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig;

  const requestChartConfig = {
    value: {
      label: 'Requests',
    },
    pending: {
      label: 'Pending',
      color: 'hsl(var(--chart-1))',
    },
    assigned: {
      label: 'Assigned',
      color: 'hsl(var(--chart-2))',
    },
    completed: {
      label: 'Completed',
      color: 'hsl(var(--chart-3))',
    },
  } satisfies ChartConfig;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Equipment"
          value={equipment.length.toString()}
          description="All equipment items in inventory"
          icon={ClipboardList}
        />
        <StatCard
          title="Active Patients"
          value={users.filter(u => u.role === 'patient').length.toString()}
          description="Patients currently registered"
          icon={Users}
        />
        <StatCard
          title="Pending Requests"
          value={requests.filter(r => r.status === 'Pending').length.toString()}
          description="Equipment requests awaiting action"
          icon={HelpCircle}
        />
        <StatCard
          title="Completed Requests"
          value={requests.filter(r => r.status === 'Completed').length.toString()}
          description="Fulfilled and discharged requests"
          icon={CheckCircle}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 lg:col-span-4">
          <CardHeader>
            <CardTitle>Equipment Status</CardTitle>
            <CardDescription>Live overview of all equipment inventory.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer
              config={equipmentChartConfig}
              className="mx-auto aspect-square max-h-[350px]"
            >
              <RechartsPrimitive.PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <RechartsPrimitive.Pie
                  data={equipmentStatusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  {equipmentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                  <RechartsPrimitive.Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {equipment.length.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Items
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </RechartsPrimitive.Pie>
              </RechartsPrimitive.PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Request Status</CardTitle>
            <CardDescription>Breakdown of patient request statuses.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={requestChartConfig}
              className="mx-auto aspect-square max-h-[350px]"
            >
              <RechartsPrimitive.PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <RechartsPrimitive.Pie
                  data={requestStatusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  {requestStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                  <RechartsPrimitive.Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {requests.length.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Requests
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </RechartsPrimitive.Pie>
              </RechartsPrimitive.PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
