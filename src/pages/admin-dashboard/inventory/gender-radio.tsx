import { type UseFormRegister, type UseFormWatch } from "react-hook-form";

/* ------------------------------------------------- */

interface ProductFormData {
  audience: "men" | "women" | "kids";
  name: string;
  category: "dress" | "fabric";
  description: string;
  materialType: string;
  dressSize: string;
  weight: number;
  thickness: string;
  skinTone: string[];
  quantityInStock: number;
  price: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
  discountStart: string;
  discountEnd: string;
}

export const GenderRadio = ({
  fieldId,
  fieldValue,
  fieldWatch,
  registerField,
}: {
  fieldId: string;
  fieldValue: string;
  fieldWatch: UseFormWatch<ProductFormData>;
  registerField: UseFormRegister<ProductFormData>;
}) => {
  const selectedAudience = fieldWatch("audience");

  return (
    <label htmlFor="for-men" className="cursor-pointer flex items-center">
      <input
        type="radio"
        id={fieldId}
        className="hidden"
        value={fieldValue}
        {...registerField("audience")}
      />
      <div
        className={`border rounded-full p-1 flex items-center justify-center ${
          selectedAudience === "men" ? "border-primary-500" : "border-gray-300"
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full ${
            selectedAudience === "men" ? "bg-primary-500" : "bg-transparent"
          }`}
        />
      </div>
      <span className="ml-2 text-sm">For Men</span>
    </label>
  );
};
