import { TrashSimpleIcon } from "@phosphor-icons/react";
import Button from "../../../../shared-components/button";
import ChangePassword from "./change-password";
import ProfileInfo from "./profile-info";
import { useDeleteMe } from "../../../../hooks/users.hooks";
import Spinner from "../../../../shared-components/spinner";

/* ----------------------------------------------------------------------- */

/**
 *
 * @returns ReactElement
 *
 */
export default function ProfileSettings() {
  const deleteMe = useDeleteMe();

  return (
    <div className="w-full flex flex-col gap-6">
      <ProfileInfo />

      <ChangePassword />

      <div className="bg-white flex flex-col lg:flex-row items-start lg:items-center justify-between py-3 lg:py-5 px-4 lg:px-8 rounded-md gap-4 lg:gap-0">
        <div className="w-full lg:max-w-[24.125rem]">
          <h5 className="font-semibold text-neutral-900 mb-3 text-lg lg:text-[1.75rem]">
            Delete Account
          </h5>
          <p className="text-sm lg:text-[0.875rem] text-[#676767]">
            Deleting your account will permanently remove all your information.
            This action cannot be undone.
          </p>
        </div>

        <Button
          className="text-red-500"
          onClick={() => deleteMe.mutate()}
          disabled={deleteMe.isPending}
        >
          <div className="w-full flex items-center gap-2">
            <TrashSimpleIcon />
            <span>Delete account</span>
            <Spinner speed="fast" size="sm" arcColor="#DC2626" isLoading={deleteMe.isPending} />
          </div>
        </Button>
      </div>
    </div>
  );
}
