import { useForm, type SubmitHandler } from "react-hook-form";
import Button from "../../../shared-components/button";

/* ------------------------------------------------------------------ */

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
};

/**
 * Contact page form
 *
 * @returns ReactElement
 */
export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log("form data", data);

    console.log(data)
    // Send data
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
      {/* First name */}
      <div className="flex flex-col justify-center gap-2">
        <label className="text-neutral-950">First Name</label>

        <input
          {...register("firstName", {
            required: "First name is required",
          })}
          type="text"
          className="p-4 border border-gray-300 rounded-[6px] focus:outline-none"
          placeholder="Janet"
        />
        {errors.firstName && <small className="text-red-400">{errors.firstName.message}</small>}
      </div>

      {/* Last name */}
      <div className="flex flex-col justify-center gap-2">
        <label className="text-neutral-950">Last Name</label>

        <input
          {...register("lastName", { required: "Last name is required" })}
          type="text"
          className="p-4 border border-gray-300 rounded-[6px] focus:outline-none"
          placeholder="Jackson"
        />
        {errors.lastName && <small className="text-red-400">{errors.lastName.message}</small>}
      </div>

      {/* Email */}
      <div className="flex flex-col justify-center gap-2">
        <label>Email</label>
        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Enter a valid email",
            },
          })}
          type="email"
          className="p-4 border border-gray-300 rounded-[6px] focus:outline-none"
          placeholder="jane.net@gmail.com"
          
        />
        {errors.email && <small className="text-red-400">{errors.email.message}</small>}
      </div>

      {/* Subject */}
      <div className="flex flex-col justify-center gap-2">
        <label>Subject</label>
        <input
          {...register("subject", { required: "Subject is required" })}
          type="text"
          className="p-4 border border-gray-300 rounded-[6px] focus:outline-none"
          placeholder="Enter subject"
        />
        {errors.subject && <small className="text-red-400">{errors.subject.message}</small>}
      </div>

      {/* Message */}
      <div className="flex flex-col justify-center gap-2">
        <label>Message</label>
        <textarea
          {...register("message", {
            required: "Message is required",
            minLength: {
              value: 10,
              message: "Message should be at least 10 characters",
            },
          })}
          className="p-4 border border-gray-300 rounded-[6px] focus:outline-none"
          placeholder="Enter your message here"
        />
        {errors.message && <small className="text-red-400">{errors.message.message}</small>}
      </div>

      <Button type="submit" text="Submit" variant="solid" className="" />
    </form>
  );
}
