import { useNavigate } from "react-router-dom";
import LandingLayout from "../layouts/landing/landing-layout";
import Button from "../shared-components/button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <LandingLayout>
      <div className="bg-white min-h-[70vh] flex flex-col items-center justify-center px-5 py-16 lg:px-28">
        <div className="text-center">
          <h1 className="text-[8rem] md:text-[10rem] font-bold text-neutral-900 leading-none">
            404
          </h1>
          <p className="text-2xl font-medium text-neutral-800 mt-4">
            Page Not Found
          </p>
          <p className="text-neutral-600 font-light mt-2 mb-8 max-w-md mx-auto">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          <Button
            type="button"
            variant="solid"
            className="bg-primary-950"
            text="Go Back Home"
            onClick={() => navigate("/")}
          />
        </div>
      </div>
    </LandingLayout>
  );
};

export default NotFound;
