import DashboardLayout from "../../layouts/dashboard/dashboard-layout";
import TopBar from "./top-bar";
import Button from "../../shared-components/button";

/* ---------------------------------------------------- */

/**
 * Dashboard home page
 *
 * @returns ReactElement
 */
export function DashboardHomePage() {
  return (
    <DashboardLayout>
      <>
        <div className="flex flex-col gap-2 relative mb-4">
          <TopBar userName="Eni" breadCrumb="home" />

          <div className="p-2">home</div>
        </div>

        <div className="w-full flex flex-col gap-4 p-4 overflow-y-scroll">
          <div className="w-full bg-white mt-5 rounded-sm p-4 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[28px] capitalize">
                Ongoing Orders
              </h2>
              <span className="capitalize text-neutral-400">See all</span>
            </div>

            <div className="w-full flex flex-col items-center justify-center gap-2">
              <p className="font-light text-center">
                You haven’t placed any orders yet. Browse through our curated
                collection based on your unique measurements and style.
              </p>
              <Button
                text="Browse shop"
                variant="solid"
                className="w-full max-w-[175px]"
              />
            </div>
          </div>

          <div className="w-full bg-white rounded-sm p-4 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[28px] capitalize">
                Ready to wear dresses
              </h2>
              <span className="capitalize text-neutral-400">See all</span>
            </div>

            <div></div>
          </div>

          <div className="w-full bg-white"></div>
        </div>
      </>
    </DashboardLayout>
  );
}
