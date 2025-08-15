import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import paymentWallet from "../payment-wallet.png";
import Button from "../../../../shared-components/button";
import { paymentInfo } from "../../_data/_cart";
import { useSwitch } from "../../../../hooks/switch";
import Modal from "../../../../shared-components/modal";
import Spinner from "../../../../shared-components/spinner";

/* ------------------------------------------------------------------------- */

interface FormValues {
  cardHolder: string;
  cardNumber: string | number;
  expiryDate: string;
  CVV: string;
}

/**
 * Checkout payment information component
 *
 * @returns ReactElement
 */
export default function CheckoutPaymentInfo() {
  const { toggleSwitch, switchValue } = useSwitch();
  const [isLoading, setLoading] = React.useState(false);
  const noBillingInfo = paymentInfo.length === 0;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({ mode: "all" });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log("form data", data);
    setLoading(!isLoading);

    await new Promise((res) => setTimeout(res, 9000));
    setLoading(false);
  };

  const noBilling = (
    <div className="w-full max-w-[500px] flex flex-col items-center justify-center gap-2">
      <img src={paymentWallet} alt="" className="size-[200px]" />

      <p className="font-light text-center text-neutral-500">
        you have not added a payment option.
      </p>

      <Button
        text="Add card"
        variant="solid"
        className="w-full max-w-[175px]"
        onClick={toggleSwitch}
      />
    </div>
  );

  return (
    <div className="w-full h-full bg-white mt-5 rounded-sm p-4 flex flex-col gap-6">
      <h2 className="font-semibold text-[1.75rem] capitalize">
        Payment Information
      </h2>

      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="w-full h-auto flex items-center justify-center mb-6">
          {noBillingInfo ? noBilling : <div>{/* Showing billing */}</div>}
        </div>

        {!noBillingInfo && (
          <div className="w-full flex items-center justify-center py-[2.5rem] px-[1.5rem] border-t border-[#E8E8E8] mt-1">
            <Button
              type="submit"
              variant="solid"
              className={`w-full max-w-[23.4375rem] disabled:bg-neutral-100 disabled:cursor-not-allowed`}
              disabled={!isValid}
            >
              <div className="flex items-center justify-center gap-1">
                <span>Pay ₦90,000.00</span>
                {isLoading && <Spinner size="sm" speed="fast" />}
              </div>
            </Button>
          </div>
        )}
      </div>

      <Modal
        isOpen={switchValue}
        onClose={toggleSwitch}
        containerClassName="w-full max-w-[26rem]"
      >
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full flex flex-col gap-4">
            <div>
              <legend className="font-lora text-[2rem] font-semibold">
                Add a card
              </legend>
              <p className="font-light text-neutral-600">
                Enter the information below to add a card.
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="cardHolder" className="font-light text-[#1C1C1C]">
                Cardholder Name
              </label>

              <input
                type="text"
                {...register("cardHolder", {
                  required: "Card holder's name is required",
                })}
                id="cardHolder"
                placeholder="John Doe"
                className="p-4 border border-gray-300 outline-none rounded-[6px] text-[0.875rem] placeholder:text-[0.875rem]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="card-number"
                className="font-light text-[#1C1C1C]"
              >
                Card Number
              </label>

              <input
                type="text"
                {...register("cardNumber", {
                  required: "Card number is required",
                })}
                id="card-number"
                placeholder="xxxx xxxx xxxx xxxx"
                className="p-4 border border-gray-300 outline-none rounded-[6px] text-[0.875rem] placeholder:text-[0.875rem]"
              />
            </div>

            <div className="w-full grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="expiryDate"
                  className="font-light text-[#1C1C1C]"
                >
                  Expiry Date
                </label>

                <input
                  type="date"
                  {...register("expiryDate", {
                    required: "Expiry date is required",
                  })}
                  placeholder="MM/YY"
                  className="p-4 border border-gray-300 outline-none rounded-[6px] text-[0.875rem] placeholder:text-[0.875rem]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="expiryDate"
                  className="font-light text-[#1C1C1C]"
                >
                  CVV
                </label>
                <input
                  type="text"
                  {...register("CVV", {
                    required: "CVV is required",
                  })}
                  placeholder="888"
                  className="p-4 border border-gray-300 outline-none rounded-[6px] text-[0.875rem] placeholder:text-[0.875rem]"
                />
              </div>
            </div>

            <div className="w-full flex flex-col gap-1">
              <div>
                <input type="checkbox" name="" id="" className="mr-4" />
                <span className="font-light">Save this for future use</span>
              </div>

              <Button
                type="submit"
                variant="solid"
                className={`w-full disabled:bg-neutral-100 disabled:cursor-not-allowed`}
                disabled={!isValid}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Add card</span>
                  {isLoading && <Spinner size="sm" speed="fast" />}
                </div>
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
