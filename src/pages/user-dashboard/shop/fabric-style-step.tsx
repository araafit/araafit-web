import { useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { FabricRequestStepperLines } from "./fabric-request-stepper";
import { useFabricRequestStore } from "../../../shared-hooks/state-store";
import { useDressStyles } from "../../../hooks/admin-settings.hooks";
import emptyFolder from "../../../assets/icons/empty-state.svg";
import { useFabricRequestContext } from "./use-fabric-request-context";

/* ---------------------------------------------------------------------- */

export function DashboardFabricStyleStepPage() {
  const params = useParams<{ itemName: string }>();
  const rawParam = params.itemName || "";
  const navigate = useNavigate();
  const { basePath } = useFabricRequestContext();

  const {
    fabricId,
    selectedStyleId: storedStyleId,
    setStyleSelection,
  } = useFabricRequestStore((state) => state);

  const {
    data: styles,
    isLoading,
    isError,
    error,
  } = useDressStyles();

  const [selectedStyleId, setSelectedStyleId] = useState<number | undefined>(
    storedStyleId
  );

  const hasStyles = useMemo(
    () => (styles && styles.length > 0) || false,
    [styles]
  );

  const handleSelectStyle = (style: {
    id: number;
    name: string;
    images?: Array<{ url: string }>;
  }) => {
    setSelectedStyleId(style.id);
    setStyleSelection({
      styleId: style.id,
      styleName: style.name,
      styleImageUrl: style.images?.[0]?.url,
    });
  };

  const handleContinue = () => {
    if (!selectedStyleId) return;
    navigate(`${basePath}/fabric/${rawParam}/measurement`);
  };

  // If user hits this page without going through fabric selection, redirect them
  if (!fabricId) {
    return (
      <Navigate
        to={`${basePath}/fabric/${rawParam}/request`}
        replace
      />
    );
  }

  return (
    <section className="min-h-screen bg-[#F5F5F5] flex items-start justify-center px-4 py-6 md:px-8">
      <div className="w-full max-w-[72rem] bg-white rounded-md shadow-sm p-4 md:p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <FabricRequestStepperLines stepIndex={1} />

          <div className="w-full flex items-center justify-evenly gap-5 my-5">
            <button
              type="button"
              onClick={() =>
                navigate(`${basePath}/fabric/${rawParam}/request`)
              }
              className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors"
              title="back to fabrics"
            >
              <ArrowLeftIcon size={18} />
            </button>

            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-semibold text-neutral-900">
                Choose a style
              </h1>
              <span className="text-xs md:text-sm text-neutral-500 mt-0.5">
                Step 2 of 4 · Select the style you&apos;d like us to sew with
                this fabric
              </span>
            </div>
          </div>
        </div>

        {/* Styles grid */}
        <div className="flex flex-col gap-4">
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <p className="text-sm text-neutral-500">
                Loading available styles...
              </p>
            </div>
          )}

          {isError && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-red-600 mb-1">Failed to load styles</p>
                <p className="text-xs md:text-sm text-neutral-500">
                  {error instanceof Error
                    ? error.message
                    : "Please try again later."}
                </p>
              </div>
            </div>
          )}

          {!isLoading && !isError && !hasStyles && (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3 text-center">
                <img
                  src={emptyFolder}
                  alt="No styles found"
                  className="w-24 h-24 object-contain opacity-80"
                />
                <p className="text-sm text-neutral-600">
                  No styles are available yet.
                </p>
                <p className="text-xs text-neutral-500 max-w-xs">
                  Please check back later or contact support if you think this
                  is a mistake.
                </p>
              </div>
            </div>
          )}

          {hasStyles && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {styles?.map((style) => {
                const isSelected = selectedStyleId === style.id;
                const coverImage =
                  style.images?.[0]?.url || (emptyFolder as string);

                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => handleSelectStyle(style)}
                    className={`group flex flex-col rounded-xl border bg-white overflow-hidden text-left transition-all ${
                      isSelected
                        ? "border-primary-500 ring-2 ring-primary-200"
                        : "border-neutral-100 hover:border-primary-200 hover:shadow-sm"
                    }`}
                  >
                    <div className="relative w-full h-44 bg-neutral-100 overflow-hidden">
                      <img
                        src={coverImage}
                        alt={style.name}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-black/10 flex items-start justify-end p-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[11px] font-medium text-primary-600">
                            <CheckCircleIcon size={14} weight="fill" />
                            Selected
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-3 md:p-4 flex flex-col gap-1.5">
                      <h3 className="text-sm md:text-base font-medium text-neutral-900 line-clamp-2">
                        {style.name}
                      </h3>
                      <p className="text-[11px] md:text-xs text-neutral-500">
                        Tap to select this style for your fabric request.
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end pt-4 border-t border-neutral-100 mt-2">
          <button
            type="button"
            className="px-5 py-2.5 rounded-md bg-[#9A6C50] text-white text-sm font-medium hover:bg-[#7B523F] transition-colors disabled:bg-neutral-200 disabled:text-neutral-500 disabled:cursor-not-allowed"
            onClick={handleContinue}
            disabled={!selectedStyleId || isLoading || isError || !hasStyles}
          >
            Continue
          </button>
        </div>
      </div>
    </section>
  );
}

