import { useRoutes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Layout from "../themes";
import ProtectedRoute from "../components/ProtectedRoute";

function Router() {
  const routes = [
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
  ];

  return useRoutes(routes);
}

export default Router;
