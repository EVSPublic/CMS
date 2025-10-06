import { useRoutes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Layout from "../themes";
import ProtectedRoute from "../components/ProtectedRoute";
import MediaGallery from "../pages/MediaGallery";
import IndexPageEditor from "../pages/ContentEditor/IndexPage";
import AboutPageEditor from "../pages/ContentEditor/AboutPage";
import IndividualSolutionsPageEditor from "../pages/ContentEditor/IndividualSolutionsPage";
import CorporateSolutionsPageEditor from "../pages/ContentEditor/CorporateSolutionsPage";
import TarifelerPageEditor from "../pages/ContentEditor/TarifelerPage";
import IletisimPageEditor from "../pages/ContentEditor/IletisimPage";
import IstasyonHaritasiPageEditor from "../pages/ContentEditor/IstasyonHaritasiPage";
import AnnouncementsPageEditor from "../pages/ContentEditor/AnnouncementsPage";
import PartnershipPageEditor from "../pages/ContentEditor/PartnershipPage";
import ApplicationsPage from "../pages/Applications";
import UserManagementPage from "../pages/UserManagement";
import StaticPageCreator from "../pages/StaticPageCreator";
import LogsPage from "../pages/Logs";

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
          path: "/media-gallery",
          element: <MediaGallery />,
        },
        {
          path: "/content/index",
          element: <IndexPageEditor />,
        },
        {
          path: "/content/hakkimizda",
          element: <AboutPageEditor />,
        },
        {
          path: "/content/cozumler/bireysel",
          element: <IndividualSolutionsPageEditor />,
        },
        {
          path: "/content/cozumler/kurumsal",
          element: <CorporateSolutionsPageEditor />,
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
        {
          path: "/announcements",
          element: <AnnouncementsPageEditor />,
        },
        {
          path: "/partnership",
          element: <PartnershipPageEditor />,
        },
        {
          path: "/applications",
          element: <ApplicationsPage />,
        },
        {
          path: "/users",
          element: <UserManagementPage />,
        },
        {
          path: "/static-pages",
          element: <StaticPageCreator />,
        },
        {
          path: "/logs",
          element: <LogsPage />,
        }
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
