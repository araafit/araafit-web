// /**
//  * EXAMPLE: How to integrate the Auth System with React Router
//  * 
//  * This file demonstrates how to protect routes and integrate the auth system
//  * with your React Router setup.
//  * 
//  * Remove this file in production!
//  */

// import { createBrowserRouter } from "react-router-dom";
// import { 
//   ProtectedRoute, 
//   AuthOnly, 
//   FullUserOnly, 
//   GuestOnly, 
//   PublicOnly 
// } from "../components/auth/ProtectedRoute";

// // Import your existing pages
// // import { HomePage } from "../pages/landing/home/home";
// // import Login from "../pages/user-auth/login/login";
// // import Register from "../pages/user-auth/register/register";

// /**
//  * Example of how to update your routes.tsx file
//  */


// const exampleRoutes = createBrowserRouter([
//   // Public routes (accessible to everyone)
//   {
//     path: "/",
//     element: <div>HomePage</div>, // Replace with <HomePage />
//   },
//   {
//     path: "about",
//     element: <div>About Page</div>,
//   },
//   {
//     path: "contact", 
//     element: <div>Contact Page</div>,
//   },

//   // Public routes that redirect authenticated users
//   {
//     path: "auth",
//     children: [
//       {
//         path: "login",
//         element: (
//           <PublicOnly>
//             <div>Login Page</div> {/* Replace with <Login userType="guest" /> */}
//           </PublicOnly>
//         ),
//       },
//       {
//         path: "register",
//         element: (
//           <PublicOnly>
//             <div>Register Page</div> {/* Replace with <Register /> */}
//           </PublicOnly>
//         ),
//       },
//       {
//         path: "admin-login",
//         element: (
//           <PublicOnly>
//             <div>Admin Login</div> {/* Replace with <AdminLogin userType="admin" /> */}
//           </PublicOnly>
//         ),
//       },
//     ],
//   },

//   // Guest or unauthenticated routes
//   {
//     path: "get-measured",
//     element: <div>Get Measured - Open to all</div>, // Anyone can access
//   },
//   {
//     path: "shop",
//     element: (
//       <GuestOnly>
//         <div>Guest Shop</div> {/* Only guests and unauthenticated users */}
//       </GuestOnly>
//     ),
//   },
//   {
//     path: "cart",
//     element: (
//       <GuestOnly>
//         <div>Guest Cart</div> {/* Only guests and unauthenticated users */}
//       </GuestOnly>
//     ),
//   },

//   // Protected routes - require authentication
//   {
//     path: "dashboard",
//     element: (
//       <AuthOnly>
//         <div>User Dashboard Layout</div>
//       </AuthOnly>
//     ),
//     children: [
//       {
//         path: "",
//         element: <div>Dashboard Home</div>,
//         index: true,
//       },
//       {
//         path: "shop",
//         element: <div>Authenticated Shop</div>,
//       },
//       {
//         path: "profile",
//         element: (
//           <FullUserOnly>
//             <div>Profile - Full Users Only</div>
//           </FullUserOnly>
//         ),
//       },
//     ],
//   },

//   // Admin routes - require admin access
//   {
//     path: "admin-dashboard",
//     element: (
//       <ProtectedRoute requireAuth={true} adminOnly={true}>
//         <div>Admin Dashboard Layout</div>
//       </ProtectedRoute>
//     ),
//     children: [
//       {
//         path: "overview",
//         element: <div>Admin Overview</div>,
//       },
//       {
//         path: "users",
//         element: <div>User Management</div>,
//       },
//     ],
//   },

//   // Custom protected route examples
//   {
//     path: "premium",
//     element: (
//       <ProtectedRoute 
//         requireAuth={true}
//         requireFullUser={true}
//         redirectTo="/auth/register"
//       >
//         <div>Premium Features - Full Users Only</div>
//       </ProtectedRoute>
//     ),
//   },
// ]);

// /**
//  * Example component showing conditional rendering based on auth state
//  */
// export const ConditionalContentExample = () => {
//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4">Conditional Content Example</h2>
      
//       {/* Show different content based on auth state */}
//       <AuthOnly>
//         <div className="p-4 bg-green-100 rounded mb-4">
//           <h3 className="font-semibold">Authenticated Users Only</h3>
//           <p>This content is only visible to logged-in users.</p>
//         </div>
//       </AuthOnly>

//       <FullUserOnly>
//         <div className="p-4 bg-blue-100 rounded mb-4">
//           <h3 className="font-semibold">Full Users Only</h3>
//           <p>This content is only visible to non-guest users.</p>
//         </div>
//       </FullUserOnly>

//       <GuestOnly>
//         <div className="p-4 bg-yellow-100 rounded mb-4">
//           <h3 className="font-semibold">Guests & Unauthenticated Only</h3>
//           <p>This content is only visible to guests and unauthenticated users.</p>
//         </div>
//       </GuestOnly>

//       {/* Always visible content */}
//       <div className="p-4 bg-gray-100 rounded">
//         <h3 className="font-semibold">Public Content</h3>
//         <p>This content is visible to everyone.</p>
//       </div>
//     </div>
//   );
// };

// /**
//  * Usage patterns for different scenarios:
//  * 
//  * 1. PUBLIC ROUTES (everyone can access):
//  *    - No wrapper needed
//  *    - Example: homepage, about, contact
//  * 
//  * 2. PUBLIC ONLY (redirect authenticated users):
//  *    - Wrap with <PublicOnly>
//  *    - Example: login, register pages
//  * 
//  * 3. AUTHENTICATED ONLY (any logged-in user):
//  *    - Wrap with <AuthOnly>
//  *    - Example: dashboard, user profile
//  * 
//  * 4. FULL USERS ONLY (no guests):
//  *    - Wrap with <FullUserOnly>
//  *    - Example: billing, sensitive data
//  * 
//  * 5. GUESTS & UNAUTHENTICATED ONLY:
//  *    - Wrap with <GuestOnly>
//  *    - Example: guest shopping flow
//  * 
//  * 6. CUSTOM PROTECTION:
//  *    - Use <ProtectedRoute> with custom props
//  *    - Example: admin routes, premium features
//  * 
//  * 7. CONDITIONAL RENDERING:
//  *    - Use auth wrapper components in JSX
//  *    - Example: show different content based on auth state
//  */

