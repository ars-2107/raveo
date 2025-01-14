import { Divider, ListItemButton, ListItemIcon, ListItemText, Menu, Typography, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setUser } from "../../redux/features/userSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { } from '@fortawesome/free-regular-svg-icons';
import { faLock, faArrowRightFromBracket, faChevronDown, faTv, faUser, faFilm, faList, faBookmark, faComment, faHeart, faGear, faMoneyCheckDollar } from '@fortawesome/free-solid-svg-icons';
import UserAvatar from "./UserAvatar";

const UserMenu = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleMenu = (e) => setAnchorEl(e.currentTarget);
  const isSmallScreen = useMediaQuery('(max-width: 991px)');

  const menu = [
    {
      display: "profile",
      path: "/password-update",
      icon: faUser,
      state: "profile"
    },
    {
      display: "movies",
      path: "/password-update",
      icon: faFilm,
      state: "movies"
    },
    {
      display: "tv shows",
      path: "/password-update",
      icon: faTv,
      state: "tv.shows"
    },
    {
      display: "reviews",
      path: "/my-reviews",
      icon: faComment,
      state: "reviews"
    },
    {
      display: "watchlist",
      path: "/password-update",
      icon: faBookmark,
      state: "watchlist"
    },
    {
      display: "lists",
      path: "/password-update",
      icon: faList,
      state: "lists"
    },
    {
      display: "favourites",
      path: "/password-update",
      icon: faHeart,
      state: "favourites"
    },
    {
      display: "password update",
      path: "/password-update",
      icon: faLock,
      state: "password.update"
    },
    {
      display: "settings",
      path: "/password-update",
      icon: faGear,
      state: "settings"
    },
    {
      display: "subscription",
      path: "/password-update",
      icon: faMoneyCheckDollar,
      state: "subscription"
    },
  ];

  const handleItemClick = (index) => {
    setActiveIndex(index);
    setAnchorEl(null);
  };

  const getItemStyles = (index) => {
    // const isActive = location.pathname === path;
    
    if (hoveredIndex === index) {
      return { color: "#151515", backgroundColor: "#eed110" };
    }
    else if (focusedIndex === index) {
      return { color: "#fff", backgroundColor: "#151515" };
    }
    else if (activeIndex === index) {
      return { color: "#151515", backgroundColor: "#eed110" };
    }
    else {
      return { color: "white", backgroundColor: "transparent" };
    }
  };

  return (
    <>
      {user && (
        <>
          <Typography
            variant="h6"
            sx={{ display: "flex", cursor: "pointer", userSelect: "none", gap: "10px", color: Boolean(anchorEl) ? "#eed110" : "#fff", transition: "all 0.3s", "&:hover": { color: "#eed110" } }}
            onClick={toggleMenu}
          >
            <UserAvatar text={user.displayName} />
            <div style={{ marginTop: "3px", fontSize: "16px", cursor: "pointer", display: isSmallScreen ? "none" : "flex" }}>
              {user.username}
              <FontAwesomeIcon icon={faChevronDown} width={25} style={{ marginTop: "5px", color: "inherit", fontSize: "16px" }} />
            </div>
          </Typography>
          <Menu
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            PaperProps={{ 
              sx: { padding: 0, backgroundColor: "#232323", color: "#fff" }
            }}
            sx={{ marginTop: "20px" }}
          >
            {menu.map((item, index) => (
              <>
                {item.display === "settings" && <Divider sx={{ backgroundColor: "#555" }} />}
                <ListItemButton
                  component={Link}
                  to={item.path}
                  key={index}
                  onMouseEnter={() => {
                    setHoveredIndex(index);
                    setFocusedIndex(null);
                    setActiveIndex(null);
                  }}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex(null)}
                  onClick={() => handleItemClick(index)}
                  sx={{
                    ...getItemStyles(index),
                    "&:hover": {
                      color: "#151515",
                      backgroundColor: "#eed110",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: getItemStyles(index).color }}>
                    <FontAwesomeIcon icon={item.icon} />
                  </ListItemIcon>
                  <ListItemText
                    disableTypography
                    primary={<Typography textTransform="uppercase">{item.display}</Typography>}
                  />
                </ListItemButton>
              </>
            ))}
            <ListItemButton
              onMouseEnter={() => {
                setHoveredIndex(menu.length);
                setFocusedIndex(null);
                setActiveIndex(null);
              }}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setFocusedIndex(menu.length)}
              onBlur={() => setFocusedIndex(null)}
              onClick={() => {
                dispatch(setUser(null));
                handleItemClick(menu.length);
              }}
              sx={{
                ...getItemStyles(menu.length),
                "&:hover": {
                  color: "#151515",
                  backgroundColor: "#eed110",
                },
              }}
            >
              <ListItemIcon sx={{ color: getItemStyles(menu.length).color }}>
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
              </ListItemIcon>
              <ListItemText
                disableTypography
                primary={<Typography textTransform="uppercase">sign out</Typography>}
              />
            </ListItemButton>
          </Menu>
        </>
      )}
    </>
  );
};

export default UserMenu;
