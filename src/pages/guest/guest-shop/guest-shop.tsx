import GuestPageLayout from "../../../layouts/guest/guest-page-layout";
import ShopTab from "../../../shared-components/shop/shop-tab";
import AllItems from "../../../shared-components/shop/all-items";
import DressItems from "../../../shared-components/shop/dress-items";
import FabricItems from "../../../shared-components/shop/fabric-items";
import { SearchProvider } from "../../user-dashboard/shop/context/search-context";
import { XIcon } from "@phosphor-icons/react";
import { useEffect } from "react";
import Button from "../../../shared-components/button";
import guestImage from "../discount-image.png";
import { useSwitch } from "../../../shared-hooks/switch";

/* ------------------------------------------------------ */

type ModalShape = {
  isOpen: boolean;
  onClose?: () => void;
};

// Discount Modal
const Modal: React.FC<ModalShape> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const originalOverflow = window.document.body.style.overflow;
    if (isOpen) {
      window.document.body.style.overflow = "hidden";
    } else {
      window.document.body.style.overflow = originalOverflow;
    }
    return () => {
      window.document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm top-0 left-0"
    >
      <div
        className="h-[770px] w-[500px] bg-white rounded-md shadow-xl z-50 relative"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <img
          src={guestImage}
          alt="discount image"
          className="w-full h-[350px] object-center object-contain rounded-t-md"
        />

        <div className="w-full flex items-center justify-center mt-6 px-6">
          <div className="w-[438px] flex flex-col items-center justify-center text-center">
            <h3 className="text-[40px] font-semibold leading-[125%] mb-4">
              Enjoy 10% Off Your First Order
            </h3>

            <p className="text-sm text-neutral-500">
              Join our style circle and enjoy a special welcome gift on your
              first order.
            </p>

            <div className="w-full gap-4 flex flex-col mt-6">
              <div className="w-full flex flex-col gap-2 mt-6">
                <label htmlFor="email" className="w-full text-left">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  className="border border-neutral-300 rounded-md p-3 w-full focus:outline-none focus:border-grey-300"
                />
              </div>

              <Button
                text="Claim my 10% off"
                type="submit"
                variant="solid"
                className="w-full"
              />
            </div>
          </div>
        </div>

        <XIcon
          className="absolute right-5 top-5 text-white cursor-pointer"
          onClick={onClose}
        />
      </div>
    </div>
  );
};

/**
 *
 * @returns
 */
export function GuestShopPage() {
  const { switchValue: isOpen, toggleSwitch: toggleModal } = useSwitch(false);

  useEffect(() => {
    setTimeout(() => toggleModal(), 3000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GuestPageLayout>
      <>
        <SearchProvider>
          <div className="w-full lg:w-[71.875rem] p-8 bg-white rounded-md overflow-y-scroll relative">
            {/* Shop Tabs */}
            <div className="size-full bg-white">
              <ShopTab
                items={["All", "Dresses", "Fabrics"]}
                tabContainerClassName="bg-transparent h-full"
                tabListClassName=" text-[0.875rem] text-neutral-700 border-b border-neutral-100 p-[0.254rem] bg-white mb-2"
                activeTabClassName="bg-primary-900 text-white rounded-t-md"
              >
                <AllItems userPage="shop" />
                <DressItems userPage="shop" />
                <FabricItems userPage="shop" />
              </ShopTab>
            </div>
          </div>
        </SearchProvider>

        <Modal isOpen={isOpen} onClose={toggleModal} />
      </>
    </GuestPageLayout>
  );
}
