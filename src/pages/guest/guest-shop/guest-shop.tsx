import GuestPageLayout from "../../../layouts/guest/guest-page-layout";
import ShopTab from "../../../shared-components/shop/shop-tab";
import AllItems from "../../../shared-components/shop/all-items";
import DressItems from "../../../shared-components/shop/dress-items";
import FabricItems from "../../../shared-components/shop/fabric-items";
import { SearchProvider } from "../../user-dashboard/shop/context/search-context";
import {
  useActiveDiscounts,
  useClaimDiscount,
} from "../../../hooks/discount.hook";
import { memo, useEffect, useState } from "react";
import type { ActiveDiscount } from "../../../services/landing-page.service";
import { useSwitch } from "../../../shared-hooks/switch";
import guestImage from "../discount-image.png";
import Button from "../../../shared-components/button";
import Spinner from "../../../shared-components/spinner";
import { XIcon } from "@phosphor-icons/react";
import { useLocalStorage } from "../../../shared-hooks/loca-storage";
import useAuth from "../../../hooks/use-auth";
import { useCreateGuestUser } from "../../../hooks/auth.hooks";

/* -------------------------------------------------------------------------------- */

type ModalShape = {
  isOpen: boolean;
  onClose?: () => void;
  discountData: ActiveDiscount | null;
};

/**
 * Guest Shop
 *
 * @returns ReactElement
 */
export function GuestShopPage() {
  const { isAuthenticated } = useAuth();
  const createGuestUser = useCreateGuestUser();
  const { setValue: setGuestUser, storedValue: isGuestUser } = useLocalStorage(
    "IS_ARAAFIT_GUEST_USER",
    false
  );
  const [discountData, setDiscountData] = useState<ActiveDiscount | null>(null);
  const { switchValue: isOpen, toggleSwitch: toggleModal } = useSwitch(false);
  const {
    isError: isActiveDiscountError,
    // error: activeDiscountError,
    isSuccess: activeDiscountSuccess,
    data: activeDiscountData,
  } = useActiveDiscounts();

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (isActiveDiscountError) return;

    if (activeDiscountData && activeDiscountData.length >= 1) {
      const firstBuyerDiscount = activeDiscountData.filter(
        (item) => item.eligibility === "guest_customers"
      );

      if (firstBuyerDiscount.length > 0 && isGuestUser) {
        setDiscountData(firstBuyerDiscount[0]);

        timeout = setTimeout(() => toggleModal(), 5000);
      }
    }

    return () => clearTimeout(timeout);
  }, [activeDiscountSuccess, isActiveDiscountError, activeDiscountData]);

  useEffect(() => {
    if (!isAuthenticated) {
      setGuestUser(true);

      // Create session for guest user
      createGuestUser.mutateAsync({
        bust: 0,
        waist: 0,
        hips: 0,
        height: 0,
        dressSize: 0,
        skinTone: "",
      });
    } else {
      setGuestUser(false);
    }
  }, [isAuthenticated]);

  return (
    <GuestPageLayout>
      <>
        <SearchProvider>
          <div className="w-full h-full p-4 sm:p-6 lg:p-8 bg-white md:rounded-md relative mb-10">
            {/* Shop Tabs */}
            <div className="w-full h-full bg-white">
              <ShopTab
                items={["All", "Ready made", "Fabrics"]}
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

        <Modal
          isOpen={isOpen}
          onClose={toggleModal}
          discountData={discountData}
        />
      </>
    </GuestPageLayout>
  );
}

// claim discount Modal
const Modal: React.FC<ModalShape> = memo(
  ({ isOpen, onClose, discountData }) => {
    const [discountInput, setDiscountInput] = useState("");
    const [fieldIsEmpty, setFieldIsEmpty] = useState(false);
    const { isPending: PendingDiscountClaim, mutateAsync: claimDiscountAsync } =
      useClaimDiscount();

    // Stop scroll
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

    const submitDiscount = () => {
      if (discountInput === "") {
        setFieldIsEmpty(true);

        return;
      }

      claimDiscountAsync(discountInput);
      setFieldIsEmpty(false);
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm top-0 left-0">
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
                Enjoy{" "}
                {discountData?.type === "percentage"
                  ? `${Number(discountData.value).toFixed()}%`
                  : `₦${Number(discountData?.value).toFixed()}`}{" "}
                Off Your First Order
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
                    value={discountInput}
                    onChange={(e) => setDiscountInput(e.currentTarget.value)}
                    placeholder="Email"
                    className="border border-neutral-300 rounded-md p-3 w-full focus:outline-none focus:border-grey-300"
                  />

                  <small
                    className={`w-full ${
                      fieldIsEmpty ? "text-red-400" : "text-white"
                    } text-left`}
                  >
                    Please fill discount field
                  </small>
                </div>

                <Button
                  type="submit"
                  variant="solid"
                  className="w-full"
                  onClick={submitDiscount}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>
                      Claim my{" "}
                      {discountData?.type === "percentage"
                        ? `${Number(discountData.value).toFixed()}%`
                        : ` ₦${Number(discountData?.value).toFixed()}`}{" "}
                      off
                    </span>
                    <Spinner
                      isLoading={PendingDiscountClaim}
                      circleColor="white"
                      size="sm"
                      speed="fast"
                    />
                  </div>
                </Button>
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
  }
);
