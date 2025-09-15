import { useForm, type SubmitHandler } from "react-hook-form";
import Spinner from "../../shared-components/spinner";
import Button from "../../shared-components/button";
import { useTokenizeCard } from "../../hooks/cards.hooks";
import { useCheckoutWithCard } from "../../hooks/orders.hooks";

/* ------------------------------------------------------------- */

interface FormValues {
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  email: string;
}

export interface CheckoutInfo {
  callbackUrl: string;
}

export interface BillingCardFormProps {
  checkoutInfo?: CheckoutInfo;
}

/**
 *
 * @param param0
 *
 * @returns ReactElement
 */
export default function BillingCardForm({ checkoutInfo }: BillingCardFormProps) {
  const tokenizeCardMutation = useTokenizeCard();
  const checkoutWithCardMutation = useCheckoutWithCard();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<FormValues & { saveCard?: boolean }>({
    mode: "onChange",
  });
  const cardNumber = watch("cardNumber");

  // Format card number with spaces
  const formatCardNumber = (cardNumber: string) => {
    const cleanCardNumber = cardNumber
      .replace(/\s+/g, "")
      .replace(/[^0-9]/gi, "");
    const matches = cleanCardNumber.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    return parts.length ? parts.join(" ") : cleanCardNumber;
  };

  // Format card expiry date
  const formatExpiryDate = (date: string) => {
    let value = date.replace(/\D/g, "");

    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }

    return value;
  };


  const submitHandler: SubmitHandler<FormValues & { saveCard?: boolean }> = async (data) => {
    try {
      if (checkoutInfo) {
        // Use checkout with card endpoint for payment + optional card saving
        const checkoutData = {
          cardholderName: data.cardHolder,
          cardNumber: data.cardNumber,
          expiryDate: data.expiry,
          cvv: data.cvv,
          saveCard: data.saveCard || false,
          callbackUrl: checkoutInfo.callbackUrl,
        };
        
        await checkoutWithCardMutation.mutateAsync(checkoutData);
        // No need to call onSuccess here since we're redirecting to payment
      } else {
        // Use regular tokenize flow for just adding card
        const tokenizeData = {
          cardholderName: data.cardHolder,
          cardNumber: data.cardNumber,
          expiryDate: data.expiry,
          cvv: data.cvv,
          email: data.email,
        };
        const tokenizeResult = await tokenizeCardMutation.mutateAsync(tokenizeData);
        window.location.href = tokenizeResult.authorizationUrl;
      }
    } catch (error) {
      console.error("Card operation failed:", error);
    }
  };


  return (
    <form className="w-full" onSubmit={handleSubmit(submitHandler)}>
      <div className="w-full flex flex-col gap-4">
        <div>
          <legend className="font-lora text-[2rem] font-semibold">
            Add a card
          </legend>
          <p className="font-light text-neutral-600">
            Enter the information below to add a card.
          </p>
        </div>

        {/* Card holder's name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="cardHolder" className="font-light text-[#1C1C1C]">
            Cardholder Name
          </label>

          <input
            type="text"
            {...register("cardHolder", {
              required: "Card holder's name is required",
              minLength: {
                value: 5,
                message: "Name must be at least 5 characters",
              },
              pattern: {
                value: /^[a-zA-Z\s]+$/,
                message: "Name can only contain letters and spaces",
              },
            })}
            id="cardHolder"
            placeholder="John Doe"
            className="p-4 border border-gray-300 outline-none rounded-[6px] text-[0.875rem] placeholder:text-[0.875rem]"
          />
          {errors.cardHolder && (
            <small className="mt-1 text-sm text-red-400">
              {errors.cardHolder.message}
            </small>
          )}
        </div>

        {/* Card number */}
        <div className="flex flex-col gap-1">
          <label htmlFor="card-number" className="font-light text-[#1C1C1C]">
            Card Number
          </label>

          <input
            type="text"
            {...register("cardNumber", {
              required: "Card number is required",
              validate: {
                validLength: (value: string | number) => {
                  const cleanValue = String(value).replace(/\s/g, "");
                  return (
                    (cleanValue.length >= 13 && cleanValue.length <= 19) ||
                    "Card number must be 13-19 digits"
                  );
                },
                validFormat: (value: string | number) => {
                  const cleanValue = String(value).replace(/\s/g, "");
                  return (
                    /^\d+$/.test(cleanValue) ||
                    "Card number can only contain digits"
                  );
                },
              },
            })}
            value={formatCardNumber(String(cardNumber))}
            id="card-number"
            placeholder="xxxx xxxx xxxx xxxx"
            className="p-4 border border-gray-300 outline-none rounded-[6px] text-[0.875rem] placeholder:text-[0.875rem]"
          />

          {errors.cardNumber && (
            <small className="mt-1 text-sm text-red-400">
              {errors.cardNumber.message}
            </small>
          )}
        </div>

        <div className="w-full grid grid-cols-2 gap-3">
          {/* Expiry Date */}
          <div className="flex flex-col gap-1">
            <label htmlFor="expiry" className="font-light text-[#1C1C1C]">
              Expiry Date
            </label>

            <input
              type="text"
              {...register("expiry", {
                required: "Expiry date is required",
                pattern: {
                  value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                  message: "Invalid format (MM/YY)",
                },
                validate: {
                  notExpired: (value: string) => {
                    const [month, year] = value.split("/");
                    const expiry = new Date(
                      2000 + parseInt(year),
                      parseInt(month) - 1
                    );
                    const today = new Date();
                    return expiry >= today || "Card has expired";
                  },
                },
                onChange: (e) => {
                  e.target.value = formatExpiryDate(e.target.value);
                },
              })}
              placeholder="MM/YY"
              className="p-4 border border-gray-300 outline-none rounded-[6px] text-[0.875rem] placeholder:text-[0.875rem]"
            />

            {errors.expiry && (
              <small className="mt-1 text-sm text-red-400">
                {errors.expiry.message}
              </small>
            )}
          </div>

          {/* CVV */}
          <div className="flex flex-col gap-1">
            <label htmlFor="cvv" className="font-light text-[#1C1C1C]">
              CVV
            </label>
            <input
              type="text"
              maxLength={4}
              {...register("cvv", {
                required: "CVV is required",
                pattern: {
                  value: /^\d{3,4}$/,
                  message: "CVV must be 3 or 4 digits",
                },
                onChange: (e) => {
                  e.target.value = e.target.value.replace(/\D/g, "");
                },
              })}
              placeholder="888"
              className="p-4 border border-gray-300 outline-none rounded-[6px] text-[0.875rem] placeholder:text-[0.875rem]"
            />
            {errors.cvv && (
              <small className="mt-1 text-sm text-red-400">
                {errors.cvv.message}
              </small>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="font-light text-[#1C1C1C]">
            Email Address
          </label>

          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            id="email"
            placeholder="john.doe@example.com"
            className="p-4 border border-gray-300 outline-none rounded-[6px] text-[0.875rem] placeholder:text-[0.875rem]"
          />
          {errors.email && (
            <small className="mt-1 text-sm text-red-400">
              {errors.email.message}
            </small>
          )}
        </div>

        <div className="w-full flex flex-col gap-1">
          <div>
            <input 
              type="checkbox" 
              {...register("saveCard")}
              id="saveCard" 
              className="mr-4" 
            />
            <label htmlFor="saveCard" className="font-light">Save this for future use</label>
          </div>

          <Button
            type="submit"
            variant="solid"
            className={`w-full disabled:bg-neutral-100 disabled:cursor-not-allowed`}
            disabled={!isValid || tokenizeCardMutation.isPending || checkoutWithCardMutation.isPending}
          >
            <div className="flex items-center justify-center gap-1">
              <span>
                {(tokenizeCardMutation.isPending || checkoutWithCardMutation.isPending) 
                  ? "Processing..." 
                  : checkoutInfo ? "Pay Now" : "Add card"}
              </span>
              {(tokenizeCardMutation.isPending || checkoutWithCardMutation.isPending) && (
                <Spinner size="sm" speed="fast" />
              )}
            </div>
          </Button>
        </div>
      </div>
    </form>
  );
}
