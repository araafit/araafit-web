import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import Nav from "../landing/nav";
import {
  GetMeasuredProvider,
  useGetMeasured,
} from "../../pages/get-measured/context/get-measured-context";

/* ------------------------------------------------------------- */

export default function GetMeasuredLayout() {
  return (
    <GetMeasuredProvider>
      <GetMeasuredLayoutInner />
    </GetMeasuredProvider>
  );
}

/**
 * Layout for the measurement flow pages.
 * Adds the landing navbar, shared header, and wraps content in a consistent container.
 */
function GetMeasuredLayoutInner() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentStep, stepTo } = useGetMeasured();

  const handleBack = () => {
    const path = location.pathname;

    // Automated flow (single route with internal steps)
    if (path === "/get-measured" || path === "/get-measured/") {
      if (typeof currentStep === "number" && currentStep > 0) {
        stepTo(currentStep - 1);
        return;
      }
      navigate(-1);
      return;
    }

    // Manual flow: measurement -> gender selection
    if (path.startsWith("/get-measured/manual/measurement")) {
      navigate(`/get-measured/manual${location.search}`);
      return;
    }

    // Manual flow: gender selection -> main get measured
    if (path.startsWith("/get-measured/manual")) {
      navigate("/get-measured");
      return;
    }

    // Summary and any other fallbacks
    if (path.startsWith("/get-measured/summary")) {
      navigate(-1);
      return;
    }

    navigate(-1);
  };

  return (
    <main>
      <Nav />
      <section className="min-h-screen px-0 py-0 md:py-2 md:px-16 overflow-y-scroll relative">
        <div className="w-full min-h-[809px] bg-white flex justify-center border rounded-md p-4 lg:p-14">
          <div className="w-full max-w-5xl">
            <div className="w-full flex items-center justify-start mb-4">
              <button
                type="button"
                className="w-9 h-9 md:w-10 md:h-10 rounded-md border border-[#E8E8E8] flex items-center justify-center bg-white text-neutral-800 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={handleBack}
                title="Go back"
              >
                <ArrowLeftIcon size={20} className="text-neutral-800" />
              </button>
            </div>
            <Outlet />
          </div>
        </div>
      </section>
    </main>
  );
}


