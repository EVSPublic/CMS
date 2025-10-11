import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { icons } from "@/components/Base/Lucide";

export interface Menu {
  icon: keyof typeof icons;
  title: string;
  badge?: number;
  pathname?: string;
  subMenu?: Menu[];
  ignore?: boolean;
  brandRestriction?: "Ovolt" | "Sharz.net"; // Only show for specific brand
}

export interface SideMenuState {
  menu: Array<Menu | string>;
}

const initialState: SideMenuState = {
  menu: [
    "ANA",
    {
      icon: "Home",
      pathname: "/",
      title: "Dashboard",
    },
    "İÇERİK YÖNETİMİ",
    {
      icon: "Image",
      pathname: "/media-gallery",
      title: "Medya Galerisi",
    },
    {
      icon: "FileText",
      title: "Sayfa İçeriği",
      subMenu: [
        {
          icon: "Home",
          pathname: "/content/index",
          title: "Ana Sayfa"
        },
        {
          icon: "Info",
          pathname: "/content/hakkimizda",
          title: "Hakkımızda",
        },
        {
          icon: "Lamp",
          pathname: "",
          title: "Çözümler",
          subMenu: [
            {
              icon: "User",
              pathname: "/content/cozumler/bireysel",
              title: "Bireysel Çözümler",
            },
            {
              icon: "Building",
              pathname: "/content/cozumler/kurumsal",
              title: "Kurumsal Çözümler",
            }
          ]
        },
        {
          icon: "CreditCard",
          pathname: "/content/tarifeler",
          title: "Tarifeler",
        },
        {
          icon: "MessageCircle",
          pathname: "/content/iletisim",
          title: "İletişim",
        },
        {
          icon: "Map",
          pathname: "/content/istasyon-haritasi",
          title: "İstasyon Haritası",
        },
      ],
    },
    {
      icon: "Megaphone",
      title: "Duyurular",
      pathname: "/announcements",
      brandRestriction: "Ovolt",
    },
    {
      icon: "Users",
      title: "Partnerlik",
      pathname: "/partnership",
    },
    {
      icon: "FileText",
      title: "Statik Sayfalar",
      pathname: "/static-pages",
    },
    {
      icon: "Smartphone",
      title: "Mobil Uygulamalar",
      pathname: "/applications",
    },
    "SİSTEM YÖNETİMİ",
    {
      icon: "UserCog",
      title: "Kullanıcı Yönetimi",
      pathname: "/users",
    },
    {
      icon: "Activity",
      title: "Loglar",
      pathname: "/logs",
    },
  ],
};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {},
});

export const selectSideMenu = (state: RootState) => state.sideMenu.menu;

export default sideMenuSlice.reducer;
