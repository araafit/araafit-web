import { useState, useEffect } from "react";
import Button from "../../../shared-components/button";
import { PencilSimpleIcon, EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import AvatarBadge from "../customers/customers-avatar";
import { useAdminProfile, useUpdateAdminProfile, useUpdateAdminPassword } from "../../../hooks/admin-settings.hooks";
import { toast } from "react-hot-toast";
import Spinner from "../../../shared-components/spinner";

export default function ManageOrdersRequests() {
  // Profile Info State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // Password State
  const [formValues, setFormValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Password Visibility Toggles
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // API hooks
  const { data: adminProfile, isLoading: profileLoading, error: profileError } = useAdminProfile();
  const updateProfileMutation = useUpdateAdminProfile();
  const updatePasswordMutation = useUpdateAdminPassword();

  // Prefill form data when profile is loaded
  useEffect(() => {
    if (adminProfile) {
      setFormData({
        firstName: adminProfile.firstName,
        lastName: adminProfile.lastName,
        email: adminProfile.email,
      });
    }
  }, [adminProfile]);

  // Helpers
  const allFieldsFilled =
    formValues.currentPassword &&
    formValues.newPassword &&
    formValues.confirmPassword;

  const passwordsMatch = formValues.newPassword === formValues.confirmPassword;

  // Handlers
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateProfileMutation.mutateAsync(formData);
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const toggleVisibility = (field: "current" | "new" | "confirm") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allFieldsFilled) return;

    if (!passwordsMatch) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await updatePasswordMutation.mutateAsync({
        currentPassword: formValues.currentPassword,
        newPassword: formValues.newPassword,
      });

      // Reset after success
      setFormValues({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Error updating password:", err);
    }
  };

  // Show loading state while fetching profile
  if (profileLoading) {
    return (
      <div className="bg-white w-full px-4 py-6 flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" speed="fast" />
      </div>
    );
  }

  // Show error state if profile fetch failed
  if (profileError) {
    return (
      <div className="bg-white w-full px-4 py-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-6">
          <p className="text-red-600">Failed to load admin profile. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white w-full px-4 py-6">
        {/* Header */}
        <div className="flex justify-between">
          <h2 className="font-semibold text-[28px] capitalize">
            Manage Profile
          </h2>

          <div
            className="flex gap-1 items-center cursor-pointer"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            <PencilSimpleIcon className="text-[#1C1C1C]" />
            <p className="text-[#1C1C1C] font-light text-sm">
              {isEditing ? "Cancel" : "Edit Info"}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] my-4 bg-[#F0F2F5]" />

        {/* Content */}
        <section className="max-w-[548px] mx-auto">
          <div className="font-inter text-sm text-[#676767] flex items-center gap-2 ">
            <AvatarBadge name={`${formData.firstName} ${formData.lastName}`} />
            Tap to change image
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="bg-white pt-4 p-6 rounded-xl font-light space-y-6"
          >
            {/* First Name */}
            <div className="flex-1">
              <label
                htmlFor="firstName"
                className="block font-light text-sm text-[#676767]"
              >
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleProfileChange}
                disabled={!isEditing}
                required
                className="mt-1 block w-full h-14 px-3  border text-sm text-[#1C1C1C] border-[#D0D5DD] rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            {/* Last Name */}
            <div className="flex-1">
              <label
                htmlFor="lastName"
                className="block font-light text-sm text-[#676767]"
              >
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleProfileChange}
                disabled={!isEditing}
                required
                className="mt-1 block w-full h-14 px-3  border text-sm text-[#1C1C1C] border-[#D0D5DD] rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            {/* Email */}
            <div className="flex-1">
              <label
                htmlFor="email"
                className="block font-light text-sm text-[#676767]"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleProfileChange}
                disabled={!isEditing}
                required
                className="mt-1 block w-full h-14 px-3  border text-sm text-[#1C1C1C] border-[#D0D5DD] rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            {/* Save button */}
            <div className="pt-4">
              <Button
                text={updateProfileMutation.isPending ? "Saving..." : "Save"}
                type="submit"
                variant={isEditing ? "solid" : "outline"}
                className={`w-full h-14 ${
                  isEditing
                    ? ""
                    : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                }`}
                disabled={!isEditing || updateProfileMutation.isPending}
              />
            </div>
          </form>
        </section>
      </div>
      <div className="bg-white w-full px-4 py-6 mt-6">
        <h2 className="font-semibold text-[28px] capitalize">
          Change Password
        </h2>

        <section>
          <div className="w-full h-[1px] my-4 bg-[#F0F2F5]"></div>
          <section className="max-w-[548px] mx-auto">
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              {/* Current Password */}
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block font-light text-sm text-[#676767]"
                >
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.current ? "text" : "password"}
                    name="currentPassword"
                    id="currentPassword"
                    value={formValues.currentPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 block w-full h-14 px-3 pr-10 border text-sm text-[#1C1C1C] border-[#D0D5DD] rounded-lg outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => toggleVisibility("current")}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  >
                    {showPassword.current ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block font-light text-sm text-[#676767]"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    name="newPassword"
                    id="newPassword"
                    value={formValues.newPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 block w-full h-14 px-3 pr-10 border text-sm text-[#1C1C1C] border-[#D0D5DD] rounded-lg outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => toggleVisibility("new")}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  >
                    {showPassword.new ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block font-light text-sm text-[#676767]"
                >
                  Retype New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formValues.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`mt-1 block w-full h-14 px-3 pr-10 border text-sm text-[#1C1C1C] rounded-lg outline-none ${
                      formValues.confirmPassword && !passwordsMatch
                        ? "border-red-500"
                        : "border-[#D0D5DD]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => toggleVisibility("confirm")}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  >
                    {showPassword.confirm ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {formValues.confirmPassword && !passwordsMatch && (
                  <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
                )}
              </div>

              {/* Save Button */}
              <div className="pt-4">
                <Button
                  text={updatePasswordMutation.isPending ? "Updating..." : "Save"}
                  type="submit"
                  variant={allFieldsFilled && passwordsMatch ? "solid" : "outline"}
                  className={`w-full h-14 ${
                    allFieldsFilled && passwordsMatch
                      ? ""
                      : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  }`}
                  disabled={!allFieldsFilled || !passwordsMatch || updatePasswordMutation.isPending}
                />
              </div>
            </form>
          </section>
        </section>
      </div>
    </>
  );
}
