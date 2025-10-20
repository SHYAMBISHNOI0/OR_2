import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { PageHeader } from '@/components/shared/page-header';
import AnalyticsTab from '@/components/admin/analytics-tab';
import UsersTab from '@/components/admin/users-tab';
import RequestsTab from '@/components/admin/requests-tab';
import AssignmentsTab from '@/components/admin/assignments-tab';
import EquipmentTab from '@/components/admin/equipment-tab';

export default function AdminDashboard() {
  return (
    <>
      <PageHeader
        title="Admin Dashboard"
        description="Oversee all platform activities, manage users, and view analytics."
      />
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-4">
          <AnalyticsTab />
        </TabsContent>
        <TabsContent value="requests">
          <RequestsTab />
        </TabsContent>
        <TabsContent value="assignments">
          <AssignmentsTab />
        </TabsContent>
        <TabsContent value="equipment">
          <EquipmentTab />
        </TabsContent>
        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
      </Tabs>
    </>
  );
}
