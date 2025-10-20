import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { PageHeader } from '@/components/shared/page-header';
import AnalyticsTab from '@/components/admin/analytics-tab';
import UsersTab from '@/components/admin/users-tab';
import RidesTab from '@/components/admin/rides-tab';
import OptimizerTab from '@/components/admin/optimizer-tab';

export default function AdminDashboard() {
  return (
    <>
      <PageHeader
        title="Admin Dashboard"
        description="Oversee all platform activities, manage users, and view analytics."
      />
      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="rides">Ride Management</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="optimizer">Optimizer</TabsTrigger>
        </TabsList>
        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsTab />
        </TabsContent>
        <TabsContent value="rides">
          <RidesTab />
        </TabsContent>
        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
        <TabsContent value="optimizer">
          <OptimizerTab />
        </TabsContent>
      </Tabs>
    </>
  );
}
