import { useRoutes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Layout from "../themes";
import ProtectedRoute from "../components/ProtectedRoute";
import IndexPageEditor from "../pages/ContentEditor/IndexPage";
import HakkimizdaPageEditor from "../pages/ContentEditor/HakkimizdaPage";
import BireyselPageEditor from "../pages/ContentEditor/BireyselPage";
import KurumsalPageEditor from "../pages/ContentEditor/KurumsalPage";
import TarifelerPageEditor from "../pages/ContentEditor/TarifelerPage";
import IletisimPageEditor from "../pages/ContentEditor/IletisimPage";
import IstasyonHaritasiPageEditor from "../pages/ContentEditor/IstasyonHaritasiPage";

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
        {
          path: "/content/index",
          element: <IndexPageEditor />,
        },
        {
          path: "/content/hakkimizda",
          element: <HakkimizdaPageEditor />,
        },
        {
          path: "/content/bireysel",
          element: <BireyselPageEditor />,
        },
        {
          path: "/content/kurumsal",
          element: <KurumsalPageEditor />,
        },
        {
          path: "/content/tarifeler",
          element: <TarifelerPageEditor />,
        },
        {
          path: "/content/iletisim",
          element: <IletisimPageEditor />,
        },
        {
          path: "/content/istasyon-haritasi",
          element: <IstasyonHaritasiPageEditor />,
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
