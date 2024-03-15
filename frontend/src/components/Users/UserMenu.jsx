import { ListItemButton, ListItemIcon, ListItemText, Menu, Typography, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setUser } from "../../redux/features/userSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { faLock, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import UserAvatar from "./UserAvatar";

const UserMenu = () => {
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);

  const toggleMenu = (e) => setAnchorEl(e.currentTarget);
  
  const isSmallScreen = useMediaQuery('(max-width: 991px)');

  const menu = [
    // {
    //   display: "favorites",
    //   path: "/favorites",
    //   icon: <FontAwesomeIcon icon={faHeart} style={{color: "#fff"}}/>,
    //   state: "favorite"
    // },
    {
      display: "reviews",
      path: "/reviews",
      icon: <FontAwesomeIcon icon={faComment} style={{color: "#151515"}}/>,
      state: "reviews"
    },
    {
      display: "password update",
      path: "/password-update",
      icon: <FontAwesomeIcon icon={faLock} style={{color: "#151515"}}/>,
      state: "password.update"
    }
  ];

  return (
    <>
      {user && (
        <>
          <Typography
            variant="h6"
            sx={{ display: "flex", cursor: "pointer", userSelect: "none", gap: "30px" ,color: "#fff" }}
            onClick={toggleMenu}
          >
            <div style={{ marginTop: "10px", fontSize: "16px", display: isSmallScreen ? "none" : "flex", }}>{user.displayName}</div>
            <UserAvatar text={user.displayName}/>
          </Typography>
          <Menu
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            PaperProps={{ 
              sx: { padding: 0, backgroundColor: "#fff", color: "#151515"}
            }}
            sx={{
              marginTop: "20px",
            }}
          >
            {menu.map((item, index) => (
              <ListItemButton
                component={Link}
                to={item.path}
                key={index}
                sx={{ "&:focus": {
                    color: "#151515",
                    backgroundColor: "#eed110",
                  }, }}
                onClick={() => setAnchorEl(null)}
              >
                <ListItemIcon x={{ "&:focus": { color: "#151515" } }}>{item.icon}</ListItemIcon>
                <ListItemText disableTypography primary={
                  <Typography textTransform="uppercase">{item.display}</Typography>
                } />
              </ListItemButton>
            ))}
            <ListItemButton
              sx={{ "&:focus": {
                    color: "#151515",
                    backgroundColor: "#eed110",
                  }, }}
              onClick={() => dispatch(setUser(null))}
            >
              <ListItemIcon><FontAwesomeIcon icon={faArrowRightFromBracket} style={{color: "#151515"}}/></ListItemIcon>
              <ListItemText disableTypography primary={
                <Typography textTransform="uppercase">sign out</Typography>
              } />
            </ListItemButton>
          </Menu>
        </>
      )}
    </>
  );
};

export default UserMenu;