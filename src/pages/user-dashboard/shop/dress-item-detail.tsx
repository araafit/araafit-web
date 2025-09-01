import UserDashboardLayout from "../../../layouts/user-dashboard/dashboard-layout";
import TopBar from "../top-bar";
import { CaretRightIcon } from "@phosphor-icons/react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { ShopProvider } from "./context/shop-context";
import { rtw2 } from "../images/image-entry";
import Button from "../../../shared-components/button";
import { MinusIcon, PlusIcon } from "@phosphor-icons/react";

/* -------------------------------------------------------- */

export function DashboardShopDressDetailPage() {
  const measurement = [6, 8, 10, 12, 14, 16, 18, 20];
  const params = useParams<{ shopTab: string; itemName: string }>();
  const itemName = params.itemName?.replaceAll("-", " ");

  const BreadCrumb = () => (
    <div className="font-inter font-light capitalize flex items-center">
      <span className="text-primary-900">Araafit</span>
      <CaretRightIcon className="text-[#979797]" />
      <Link to="/dashboard/shop/" className="text-primary-900">
        Shop
      </Link>
      <CaretRightIcon className="text-[#979797]" />
      <Link to="/dashboard/shop/dress" className="text-primary-900">dress</Link>
      <CaretRightIcon className="text-[#979797]" />
      <span className="text-[#979797]">{itemName}</span>
    </div>
  );

  return (
    <UserDashboardLayout>
      <div className="h-screen flex flex-col gap-2 relative">
        <TopBar title="Shop" breadCrumb={<BreadCrumb />} />

        <ShopProvider>
          <div className="w-full h-[95%] flex flex-col gap-4 p-4 mt-20 overflow-y-scroll">
            <div className="h-auto bg-white rounded-md p-4 flex flex-col gap-6">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="relative size-[35.4375rem] bg-blue-100 rounded-md">
                    <img
                      src={rtw2}
                      alt=""
                      className="size-full rounded-md object-cover"
                    />
                    <div className="absolute left-3 top-40 flex flex-col gap-[1rem]">
                      {[1, 2, 3].map((idx) => (
                        <img
                          key={idx}
                          src={rtw2}
                          alt=""
                          className="w-[101px] h-[67px] rounded-md object-cover border border-white cursor-pointer"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="size-[35.4375rem] grow rounded-md flex flex-col gap-4">
                    <div className="flex flex-col gap-3">
                      <h3 className="text-neutral-700 font-semibold text-[1.5rem]">
                        Araafit All Blue Jumpsuit
                      </h3>
                      <p className="text-neutral-700 font-light">
                        This all blue jumpsuit is perfect for making a
                        statement, brunches, events, or nights out.
                      </p>
                      <span className="font-semibold text-neutral-900">
                        ₦80,000.00
                      </span>
                    </div>
                    <div className="border-b border-gray-100 pb-3">
                      <div className="mb-3">Color</div>
                      <div className="size-[40px] bg-[#2280B3] rounded-full" />
                    </div>

                    <div className="flex flex-col gap-3 border-b border-gray-100 pb-3">
                      <div className="bg-yellow-50 rounded-md p-2">
                        <h5 className="mb-4 font-inter text-[#F59E0B]">
                          We’ve Got Your Size Covered
                        </h5>

                        <p className="text-[#B47409] font-light">
                          No need to choose a size—our AI has already selected
                          the perfect fit for you based on your measurements.
                        </p>
                      </div>

                      <div className="w-full flex items-center justify-between">
                        {measurement.map((item, idx) => (
                          <div
                            key={idx}
                            className="w-[3.625rem] h-[2.75rem] p-2 text-[14px] border border-[#E8E8E8] rounded-md flex items-center justify-center cursor-pointer"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <span className="text-[14px]">Quality</span>

                      <div className="w-[121px] flex items-center justify-between gap-2 border border-neutral-100 py-[10px] px-[12px] rounded-md">
                        <MinusIcon className="cursor-pointer" />
                        <span>{1}</span>
                        <PlusIcon className="cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-100 flex items-center justify-center gap-[1.5rem] py-[40px] px-[24px]">
                  <Button
                    text="Add to Cart"
                    variant="outline"
                    className="w-[23.4375rem] border border-neutral-500 text-neutral-900"
                  />

                  <Button
                    text="Pay Now"
                    variant="solid"
                    className="w-[23.4375rem]"
                  />
                </div>
              </div>
            </div>
          </div>
        </ShopProvider>
      </div>
    </UserDashboardLayout>
  );
}
