import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Toolbar from "@material-ui/core/Toolbar";
import { useAuth } from "./context/AuthContext";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import LayersIcon from "@material-ui/icons/Layers";
import AssignmentIcon from "@material-ui/icons/Assignment";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";
import Logout from "./authentication/logout";
import LoginIcon from "@mui/icons-material/Login";
import "./SideNavbar.css";
import ContactsIcon from "@mui/icons-material/Contacts";
const SideNavbar = () => {
  const drawerWidth = 240;

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
    },
    toolbar: {
      paddingRight: 2, // keep right padding when drawer closed
      backgroundColor: "#8884d8",
    },
    ["@media only screen and (max-width: 600px)"]: {
      width: "100%",
    },

    toolbarIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 5px",
      ...theme.mixins.toolbar,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 3,
    },
    menuButtonHidden: {
      display: "none",
    },
    title: {
      flexGrow: 1,
    },
    drawerPaper: {
      position: "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      height: 900,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerPaperClose: {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      height: 900,

      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
      // content which is class of main needs to be flex and column direction
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      height: "100vh",
      overflow: "auto",
    },
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
    },
    paper: {
      padding: theme.spacing(2),
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
    },
    fixedHeight: {
      height: 240,
    },
    // added the footer class
    footer: {
      padding: theme.spacing(2),
      marginTop: "auto",
      backgroundColor: "white",
      // just this item, push to bottom
      alignSelf: "flex-end",
    },
  }));
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const { currentUser } = useAuth();

  return (
    <div className="navbar-container">
      {" "}
      <AppBar
        // position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            Elpaso
          </Typography>
          <Typography
            align="right"
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            {currentUser && currentUser.displayName}
            {currentUser && currentUser.name}
          </Typography>
        </Toolbar>
      </AppBar>
      <div style={{ height: "100%" }} className="navbar-paper">
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
          style={{ height: "100%" }}
          PaperProps={{ style: { height: "100%" } }}
          className="drawer-comp"
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          {/* First list of items */}
          <List>
            <div>
              {" "}
              <Link to="/" style={{ color: "black" }}>
                <ListItem button>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" />{" "}
                </ListItem>
              </Link>
              {currentUser && (
                <Link to="/statistics" style={{ color: "black" }}>
                  <ListItem button>
                    <ListItemIcon>
                      <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                  </ListItem>
                </Link>
              )}
              {currentUser && (
                <Link to="/dashboard" style={{ color: "black" }}>
                  <ListItem button>
                    <ListItemIcon>
                      <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Current day" />
                  </ListItem>{" "}
                </Link>
              )}
              <Link to="/information" style={{ color: "black" }}>
                <ListItem button>
                  <ListItemIcon>
                    <LayersIcon />
                  </ListItemIcon>
                  <ListItemText primary="About" />
                </ListItem>
              </Link>{" "}
              <Link to="/contact" style={{ color: "black" }}>
                <ListItem button>
                  <ListItemIcon>
                    <ContactsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Contact" />
                </ListItem>
              </Link>{" "}
              {/* <ListSubheader inset>Saved reports</ListSubheader> */}
              <>{currentUser && <Logout />}</>
              {!currentUser && (
                <Link to="/login" style={{ color: "black" }}>
                  <ListItem button>
                    <ListItemIcon>
                      <LoginIcon />
                    </ListItemIcon>
                    <ListItemText primary="Log In" />
                  </ListItem>{" "}
                </Link>
              )}
            </div>
          </List>
        </Drawer>
      </div>
    </div>
  );
};

export default SideNavbar;
