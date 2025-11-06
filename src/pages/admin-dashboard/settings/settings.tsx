import { CaretRightIcon } from "@phosphor-icons/react";
import TopBar from "../admin-components/top-bar/top-bar";
import AdminDashboardLayout from "../../../layouts/admin-dashboard/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import Profile from "./profile";
import SizeTabs from "./size";
import StylesTabs from "./styles/styles";

/* ------------------------------------------------------------------------------------------ */

export function AdminDashboardSettings() {
  const title = <div className="font-lora text-[#1C1C1C]">Settings</div>;

  const BreadCrumb = () => (
    <div className="font-inter font-light capitalize flex items-center">
      <span className="text-primary-900">Araafit</span>
      <CaretRightIcon className="text-[#979797]" />
      <span className="text-[#979797]">Settings</span>
    </div>
  );

  return (
    <AdminDashboardLayout>
      <div className="h-screen">
        <div className="flex flex-col gap-2 relative">
          <TopBar title={title} breadCrumb={<BreadCrumb />} />
        </div>

        <div className="w-full  flex flex-col gap-4 p-4 mt-20 overflow-y-scroll px-10">
          {/* -------- */}
          <Tabs defaultValue="profile" className="w-full">
            <section className="flex items-center justify-between mb-5">
              <TabsList className="w-fit border border-[#E7E7E7] rounded-lg h-11">
                <TabsTrigger value="profile">My Profile</TabsTrigger>
                <TabsTrigger value="size">Size Chart</TabsTrigger>
                <TabsTrigger value="style">Tailoring Styles</TabsTrigger>
              </TabsList>
            </section>

            <TabsContent
              value="profile"
              className="relative flex  flex-col gap-4 overflow-auto"
            >
              <Profile />
            </TabsContent>

            <TabsContent value="size">
              <SizeTabs />
            </TabsContent>

            <TabsContent value="style">
              <StylesTabs />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
