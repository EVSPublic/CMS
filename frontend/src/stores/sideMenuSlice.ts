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
}

export interface SideMenuState {
  menu: Array<Menu | string>;
}

const initialState: SideMenuState = {
  menu: [
    "MAIN",
    {
      icon: "Home",
      pathname: "/",
      title: "Dashboard",
    },
    "CONTENT MANAGEMENT",
    {
      icon: "Image",
      pathname: "/media-gallery",
      title: "Media Gallery",
    },
    {
      icon: "FileText",
      title: "Page Content",
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
  ],
};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {},
});

export const selectSideMenu = (state: RootState) => state.sideMenu.menu;

export default sideMenuSlice.reducer;
