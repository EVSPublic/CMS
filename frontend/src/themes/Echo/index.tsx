import "@/assets/css/vendors/simplebar.css";
import "@/assets/css/themes/echo.css";
import { Transition } from "react-transition-group";
import Breadcrumb from "@/components/Base/Breadcrumb";
import { useState, useEffect, createRef, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { selectSideMenu } from "@/stores/sideMenuSlice";
import {
  selectCompactMenu,
  setCompactMenu as setCompactMenuStore,
} from "@/stores/compactMenuSlice";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { FormattedMenu, linkTo, nestedMenu, enter, leave } from "./side-menu";
import Lucide from "@/components/Base/Lucide";
import users from "@/fakers/users";
import clsx from "clsx";
import SimpleBar from "simplebar";
import { Menu } from "@/components/Base/Headless";
import { logService } from "@/services/logService";

function Main() {
  const dispatch = useAppDispatch();
  const compactMenu = useAppSelector(selectCompactMenu);
  const setCompactMenu = (val: boolean) => {
    localStorage.setItem("compactMenu", val.toString());
    dispatch(setCompactMenuStore(val));
  };
  const [compactMenuOnHover, setCompactMenuOnHover] = useState(false);
  const [activeMobileMenu, setActiveMobileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [formattedMenu, setFormattedMenu] = useState<
    Array<FormattedMenu | string>
  >([]);
  const sideMenuStore = useAppSelector(selectSideMenu);
  const sideMenu = () => nestedMenu(sideMenuStore, location);
  const scrollableRef = createRef<HTMLDivElement>();
  const subMenuRefs = useRef<{ [key: number]: React.RefObject<HTMLUListElement> }>({});
  const thirdLevelMenuRefs = useRef<{ [key: string]: React.RefObject<HTMLUListElement> }>({});

  // Helper function to get or create ref
  const getSubMenuRef = (menuKey: number) => {
    if (!subMenuRefs.current[menuKey]) {
      subMenuRefs.current[menuKey] = createRef<HTMLUListElement>();
    }
    return subMenuRefs.current[menuKey];
  };

  const getThirdLevelMenuRef = (menuKey: number, subMenuKey: number) => {
    const key = `${menuKey}-${subMenuKey}`;
    if (!thirdLevelMenuRefs.current[key]) {
      thirdLevelMenuRefs.current[key] = createRef<HTMLUListElement>();
    }
    return thirdLevelMenuRefs.current[key];
  };

  const [topBarActive, setTopBarActive] = useState(false);
  const [quickSearch, setQuickSearch] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(() => {
    return localStorage.getItem('selectedBrand') || 'Ovolt';
  });

  const handleBrandChange = (brand: string) => {
    const previousBrand = selectedBrand;
    setSelectedBrand(brand);
    localStorage.setItem('selectedBrand', brand);

    // Log brand switch
    logService.logUserAction(
      'brand_switch',
      `Marka değiştirildi: ${previousBrand} → ${brand}`,
      'info'
    );

    // Dispatch custom event to notify content managers
    window.dispatchEvent(new CustomEvent('brandChanged', { detail: { brand } }));

    // Refresh the page to ensure complete reload
    setTimeout(() => {
      window.location.reload();
    }, 100); // Small delay to ensure localStorage is saved
  };

  // Generate breadcrumbs based on current location and menu structure
  const generateBreadcrumbs = (): Array<{ title: string; to: string; active?: boolean }> => {
    const breadcrumbs: Array<{ title: string; to: string; active?: boolean }> = [{ title: `${selectedBrand} Admin`, to: "/" }];

    // Fallback title mapping for better display
    const getTitleFromPath = (pathname: string): string => {
      const titleMap: { [key: string]: string } = {
        '/': 'Dashboard',
        '/media-gallery': 'Medya Galerisi',
        '/content/index': 'Ana Sayfa',
        '/content/hakkimizda': 'Hakkımızda',
        '/content/cozumler/bireysel': 'Bireysel Çözümler',
        '/content/cozumler/kurumsal': 'Kurumsal Çözümler',
        '/content/tarifeler': 'Tarifeler',
        '/content/iletisim': 'İletişim',
        '/content/istasyon-haritasi': 'İstasyon Haritası',
        '/announcements': 'Duyurular',
        '/partnership': 'Partnerlik',
        '/static-pages': 'Statik Sayfalar',
        '/users': 'Kullanıcı Yönetimi',
      };

      return titleMap[pathname] || pathname.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Sayfa';
    };

    // Find current menu item and build path
    const findMenuPath = (menus: Array<FormattedMenu | string>, path: Array<FormattedMenu> = []): Array<FormattedMenu> | null => {
      for (const menu of menus) {
        if (typeof menu !== "string") {
          if (menu.pathname === location.pathname) {
            return [...path, menu];
          }
          if (menu.subMenu) {
            const subPath = findMenuPath(menu.subMenu, [...path, menu]);
            if (subPath) return subPath;
          }
        }
      }
      return null;
    };

    const menuPath = findMenuPath(formattedMenu);
    if (menuPath) {
      menuPath.forEach((menu, index) => {
        // Skip parent menus without pathnames (like "Sayfa İçeriği" parent)
        if (menu.pathname) {
          breadcrumbs.push({
            title: menu.title,
            to: menu.pathname,
            active: index === menuPath.length - 1
          });
        }
      });
    } else {
      // Fallback for pages not in menu
      if (location.pathname !== '/') {
        breadcrumbs.push({
          title: getTitleFromPath(location.pathname),
          to: location.pathname,
          active: true
        });
      }
    }

    return breadcrumbs;
  };

  const toggleCompactMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setCompactMenu(!compactMenu);
  };

  const compactLayout = () => {
    if (window.innerWidth <= 1600) {
      setCompactMenu(true);
    }
  };

  const requestFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    }
  };

  useEffect(() => {
    if (scrollableRef.current) {
      new SimpleBar(scrollableRef.current);
    }

    setFormattedMenu(sideMenu());
    compactLayout();

    window.onresize = () => {
      compactLayout();
    };
  }, [sideMenuStore, location]);

  window.onscroll = () => {
    // Topbar
    if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
      setTopBarActive(true);
    } else {
      setTopBarActive(false);
    }
  };

  return (
    <div
      className={clsx([
        "echo group bg-gradient-to-b from-slate-200/70 to-slate-50 background relative min-h-screen dark:from-darkmode-800/[.95] dark:to-darkmode-900/[.95]",
        "before:content-[''] before:h-[370px] before:w-screen before:bg-gradient-to-t before:from-theme-1/80 before:to-theme-2 [&.background--hidden]:before:opacity-0 before:transition-[opacity,height] before:ease-in-out before:duration-300 before:top-0 before:fixed",
        "after:content-[''] after:h-[370px] after:w-screen [&.background--hidden]:after:opacity-0 after:transition-[opacity,height] after:ease-in-out after:duration-300 after:top-0 after:fixed after:bg-texture-white after:bg-contain after:bg-fixed after:bg-[center_-13rem] after:bg-no-repeat",
        topBarActive && "background--hidden",
      ])}
    >
      <div
        className={clsx([
          "xl:ml-0 shadow-xl transition-[margin,padding] duration-300 xl:shadow-none fixed top-0 left-0 z-50 side-menu group inset-y-0 xl:py-3.5 xl:pl-3.5",
          "after:content-[''] after:fixed after:inset-0 after:bg-black/80 after:xl:hidden",
          { "side-menu--collapsed": compactMenu },
          { "side-menu--on-hover": compactMenuOnHover },
          { "ml-0 after:block": activeMobileMenu },
          { "-ml-[275px] after:hidden": !activeMobileMenu },
        ])}
      >
        <div
          className={clsx([
            "fixed ml-[275px] w-10 h-10 items-center justify-center xl:hidden z-50",
            { flex: activeMobileMenu },
            { hidden: !activeMobileMenu },
          ])}
        >
          <a
            href=""
            onClick={(event) => {
              event.preventDefault();
              setActiveMobileMenu(false);
            }}
            className="mt-5 ml-5"
          >
            <Lucide icon="X" className="w-8 h-8 text-white" />
          </a>
        </div>
        <div
          className={clsx([
            "h-full box bg-white/[0.95] rounded-none xl:rounded-xl z-20 relative w-[275px] duration-300 transition-[width] group-[.side-menu--collapsed]:xl:w-[91px] group-[.side-menu--collapsed.side-menu--on-hover]:xl:shadow-[6px_0_12px_-4px_#0000000f] group-[.side-menu--collapsed.side-menu--on-hover]:xl:w-[275px] overflow-hidden flex flex-col",
          ])}
          onMouseOver={(event) => {
            event.preventDefault();
            setCompactMenuOnHover(true);
          }}
          onMouseLeave={(event) => {
            event.preventDefault();
            setCompactMenuOnHover(false);
          }}
        >
          <div
            className={clsx([
              "flex-none hidden xl:flex items-center z-10 px-5 h-[65px] w-[275px] overflow-hidden relative duration-300 group-[.side-menu--collapsed]:xl:w-[91px] group-[.side-menu--collapsed.side-menu--on-hover]:xl:w-[275px]",
            ])}
          >
            <a
              href=""
              className="flex items-center transition-[margin] duration-300 group-[.side-menu--collapsed]:xl:ml-2 group-[.side-menu--collapsed.side-menu--on-hover]:xl:ml-0"
            >
              <div className="flex items-center justify-center w-[34px] rounded-lg h-[34px] bg-gradient-to-b from-theme-1 to-theme-2/80 transition-transform ease-in-out group-[.side-menu--collapsed.side-menu--on-hover]:xl:-rotate-180">
                <div className="w-[16px] h-[16px] relative -rotate-45 [&_div]:bg-white">
                  {selectedBrand === 'Ovolt' ? (
                    <>
                      <div className="absolute w-[21%] left-0 inset-y-0 my-auto rounded-full opacity-50 h-[75%]"></div>
                      <div className="absolute w-[21%] inset-0 m-auto h-[120%] rounded-full"></div>
                      <div className="absolute w-[21%] right-0 inset-y-0 my-auto rounded-full opacity-50 h-[75%]"></div>
                    </>
                  ) : (
                    <div className="text-white text-xs font-bold rotate-45">S</div>
                  )}
                </div>
              </div>
              <div className="ml-3.5 group-[.side-menu--collapsed.side-menu--on-hover]:xl:opacity-100 group-[.side-menu--collapsed]:xl:opacity-0 transition-opacity">
                <select
                  value={selectedBrand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className="font-semibold text-gray-800 dark:text-white bg-transparent border-none text-base focus:outline-none cursor-pointer"
                >
                  <option value="Ovolt">Ovolt</option>
                  <option value="Sharz.net">Sharz.net</option>
                </select>
              </div>
            </a>
            <a
              href=""
              onClick={toggleCompactMenu}
              className="hidden group-[.side-menu--collapsed.side-menu--on-hover]:xl:opacity-100 group-[.side-menu--collapsed]:xl:rotate-180 group-[.side-menu--collapsed]:xl:opacity-0 transition-[opacity,transform] 3xl:flex items-center justify-center w-[20px] h-[20px] ml-auto border rounded-full border-slate-600/40 hover:bg-slate-600/5 dark:border-darkmode-100"
            >
              <Lucide icon="ArrowLeft" className="w-3.5 h-3.5 stroke-[1.3]" />
            </a>
          </div>
          <div
            ref={scrollableRef}
            className={clsx([
              "w-full h-full z-20 px-5 overflow-y-auto overflow-x-hidden pb-3 [-webkit-mask-image:-webkit-linear-gradient(top,rgba(0,0,0,0),black_30px)] [&:-webkit-scrollbar]:w-0 [&:-webkit-scrollbar]:bg-transparent",
              "[&_.simplebar-content]:p-0 [&_.simplebar-track.simplebar-vertical]:w-[10px] [&_.simplebar-track.simplebar-vertical]:mr-0.5 [&_.simplebar-track.simplebar-vertical_.simplebar-scrollbar]:before:bg-slate-400/30",
            ])}
          >
            <ul className="scrollable">
              {/* BEGIN: First Child */}
              {formattedMenu.map((menu, menuKey) =>
                typeof menu == "string" ? (
                  <li className="side-menu__divider" key={menuKey}>
                    {menu}
                  </li>
                ) : (
                  <li key={menuKey}>
                    <a
                      href=""
                      className={clsx([
                        "side-menu__link",
                        { "side-menu__link--active": menu.active },
                        {
                          "side-menu__link--active-dropdown":
                            menu.activeDropdown,
                        },
                      ])}
                      onClick={(event: React.MouseEvent) => {
                        event.preventDefault();
                        linkTo(menu, navigate);
                        // Only update formattedMenu for dropdown toggles, not navigation
                        if (menu.subMenu) {
                          setFormattedMenu([...formattedMenu]);
                        }
                      }}
                    >
                      <Lucide
                        icon={menu.icon}
                        className="side-menu__link__icon"
                      />
                      <div className="side-menu__link__title">{menu.title}</div>
                      {menu.badge && (
                        <div className="side-menu__link__badge">
                          {menu.badge}
                        </div>
                      )}
                      {menu.subMenu && (
                        <Lucide
                          icon="ChevronDown"
                          className="side-menu__link__chevron"
                        />
                      )}
                    </a>
                    {/* BEGIN: Second Child */}
                    {menu.subMenu && (
                      <Transition
                        in={menu.activeDropdown}
                        onEnter={() => {
                          const element = getSubMenuRef(menuKey).current;
                          if (element) enter(element);
                        }}
                        onExit={() => {
                          const element = getSubMenuRef(menuKey).current;
                          if (element) leave(element);
                        }}
                        timeout={300}
                        nodeRef={getSubMenuRef(menuKey)}
                      >
                        <ul
                          ref={getSubMenuRef(menuKey)}
                          className={clsx([
                            "",
                            { block: menu.activeDropdown },
                            { hidden: !menu.activeDropdown },
                          ])}
                        >
                          {menu.subMenu.map((subMenu, subMenuKey) => (
                            <li key={subMenuKey}>
                              <a
                                href=""
                                className={clsx([
                                  "side-menu__link",
                                  { "side-menu__link--active": subMenu.active },
                                  {
                                    "side-menu__link--active-dropdown":
                                      subMenu.activeDropdown,
                                  },
                                ])}
                                onClick={(event: React.MouseEvent) => {
                                  event.preventDefault();
                                  linkTo(subMenu, navigate);
                                  // Only update formattedMenu for dropdown toggles, not navigation
                                  if (subMenu.subMenu) {
                                    setFormattedMenu([...formattedMenu]);
                                  }
                                }}
                              >
                                <Lucide
                                  icon={subMenu.icon}
                                  className="side-menu__link__icon"
                                />
                                <div className="side-menu__link__title">
                                  {subMenu.title}
                                </div>
                                {subMenu.badge && (
                                  <div className="side-menu__link__badge">
                                    {subMenu.badge}
                                  </div>
                                )}
                                {subMenu.subMenu && (
                                  <Lucide
                                    icon="ChevronDown"
                                    className="side-menu__link__chevron"
                                  />
                                )}
                              </a>
                              {/* BEGIN: Third Child */}
                              {subMenu.subMenu && (
                                <Transition
                                  in={subMenu.activeDropdown}
                                  onEnter={() => {
                                    const element = getThirdLevelMenuRef(menuKey, subMenuKey).current;
                                    if (element) enter(element);
                                  }}
                                  onExit={() => {
                                    const element = getThirdLevelMenuRef(menuKey, subMenuKey).current;
                                    if (element) leave(element);
                                  }}
                                  timeout={300}
                                  nodeRef={getThirdLevelMenuRef(menuKey, subMenuKey)}
                                >
                                  <ul
                                    ref={getThirdLevelMenuRef(menuKey, subMenuKey)}
                                    className={clsx([
                                      "",
                                      {
                                        block: subMenu.activeDropdown,
                                      },
                                      { hidden: !subMenu.activeDropdown },
                                    ])}
                                  >
                                    {subMenu.subMenu.map(
                                      (lastSubMenu, lastSubMenuKey) => (
                                        <li key={lastSubMenuKey}>
                                          <a
                                            href=""
                                            className={clsx([
                                              "side-menu__link",
                                              {
                                                "side-menu__link--active":
                                                  lastSubMenu.active,
                                              },
                                              {
                                                "side-menu__link--active-dropdown":
                                                  lastSubMenu.activeDropdown,
                                              },
                                            ])}
                                            onClick={(
                                              event: React.MouseEvent
                                            ) => {
                                              event.preventDefault();
                                              linkTo(lastSubMenu, navigate);
                                              // Third level should only be navigation, no dropdowns
                                            }}
                                          >
                                            <Lucide
                                              icon={lastSubMenu.icon}
                                              className="side-menu__link__icon"
                                            />
                                            <div className="side-menu__link__title">
                                              {lastSubMenu.title}
                                            </div>
                                            {lastSubMenu.badge && (
                                              <div className="side-menu__link__badge">
                                                {lastSubMenu.badge}
                                              </div>
                                            )}
                                          </a>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </Transition>
                              )}
                              {/* END: Third Child */}
                            </li>
                          ))}
                        </ul>
                      </Transition>
                    )}
                    {/* END: Second Child */}
                  </li>
                )
              )}
              {/* END: First Child */}
            </ul>
          </div>
        </div>
        <div className="fixed h-[65px] transition-[margin] duration-100 xl:ml-[275px] group-[.side-menu--collapsed]:xl:ml-[90px] mt-3.5 inset-x-0 top-0">
          <div
            className={clsx([
              "top-bar absolute left-0 xl:left-3.5 right-0 h-full mx-5 group",
              "before:content-[''] before:absolute before:top-0 before:inset-x-0 before:-mt-[15px] before:h-[20px] before:backdrop-blur",
              topBarActive && "top-bar--active",
            ])}
          >
            <div
              className="
                container flex items-center w-full h-full transition-[padding,background-color,border-color] ease-in-out duration-300 box bg-transparent border-transparent shadow-none dark:bg-transparent dark:border-transparent
                group-[.top-bar--active]:box group-[.top-bar--active]:px-5
                group-[.top-bar--active]:bg-transparent group-[.top-bar--active]:border-transparent group-[.top-bar--active]:bg-gradient-to-r group-[.top-bar--active]:from-theme-1 group-[.top-bar--active]:to-theme-2
              "
            >
              <div className="flex items-center gap-1 xl:hidden">
                <a
                  href=""
                  onClick={(event) => {
                    event.preventDefault();
                    setActiveMobileMenu(true);
                  }}
                  className="p-2 text-white rounded-full hover:bg-white/5"
                >
                  <Lucide icon="AlignJustify" className="w-[18px] h-[18px]" />
                </a>
                <a
                  href=""
                  className="p-2 text-white rounded-full hover:bg-white/5"
                  onClick={(e) => {
                    e.preventDefault();
                    setQuickSearch(true);
                  }}
                >
                  <Lucide icon="Search" className="w-[18px] h-[18px]" />
                </a>
              </div>
              {/* BEGIN: Breadcrumb */}
              <Breadcrumb light className="flex-1 hidden xl:block">
                {generateBreadcrumbs().map((breadcrumb, index) => (
                  <Breadcrumb.Link
                    key={index}
                    className="dark:before:bg-chevron-white"
                    to={breadcrumb.to}
                    active={breadcrumb.active}
                  >
                    {breadcrumb.title}
                  </Breadcrumb.Link>
                ))}
              </Breadcrumb>
              {/* END: Breadcrumb */}
              {/* BEGIN: Search */}
              <div
                className="relative justify-center flex-1 hidden xl:flex"
                onClick={() => setQuickSearch(true)}
              >
                <div className="bg-white/[0.12] dark:bg-darkmode-900/30 dark:border-transparent border-transparent border w-[350px] flex items-center py-2 px-3.5 rounded-[0.5rem] text-white/60 cursor-pointer hover:bg-white/[0.15] transition-colors duration-300 hover:duration-100">
                  <Lucide icon="Search" className="w-[18px] h-[18px]" />
                  <div className="ml-2.5 mr-auto">Quick search...</div>
                  <div>⌘K</div>
                </div>
              </div>
              {/* END: Search */}
              {/* BEGIN: Notification & User Menu */}
              <div className="flex items-center flex-1">
                <div className="flex items-center gap-1 ml-auto">
                </div>
                <Menu className="ml-5">
                  <Menu.Button className="overflow-hidden rounded-full w-[36px] h-[36px] border-[3px] border-white/[0.15] image-fit">
                    <img
                      alt="Tailwise - Admin Dashboard Template"
                      src={users.fakeUsers()[0].photo}
                    />
                  </Menu.Button>
                  <Menu.Items className="w-56 mt-1">
                    <Menu.Item
                      onClick={() => {
                        // Clear localStorage
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        localStorage.removeItem('user');
                        
                        navigate("/login");
                      }}
                    >
                      <Lucide icon="Power" className="w-4 h-4 mr-2" />
                      Logout
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </div>
              {/* END: Notification & User Menu */}
            </div>
          </div>
        </div>
      </div>
      <div
        className={clsx([
          "transition-[margin,width] duration-100 xl:pl-3.5 pt-[54px] pb-16 relative z-10 group mode",
          { "xl:ml-[275px]": !compactMenu },
          { "xl:ml-[91px]": compactMenu },
          { "mode--light": !topBarActive },
        ])}
      >
        <div className="px-5 mt-16">
          <div className="container">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
