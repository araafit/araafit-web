import { createBrowserRouter } from "react-router-dom";
import { Landing } from "./landing/home/home";
import Contact from "./landing/contact/contact";
import About from "./landing/about/about";

const pagesRoutes = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
]);

export default pagesRoutes;
