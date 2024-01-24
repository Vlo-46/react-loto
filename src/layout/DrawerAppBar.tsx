import {ReactElement, useState, MouseEvent} from "react";

import {
    AppBar,
    Box,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography,
    Button
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';

import {useLocation, useNavigate} from "react-router-dom";

import {IRoutes} from "../interfaces/routes";
import {routes} from '../utils/routes'
import {isAuth} from "../helpers/isAuth";

interface Props {
    window?: () => Window;
    children: ReactElement
}

export default function DrawerAppBar(props: Props) {
    const {window} = props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation()

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const handleNavigate = (route: IRoutes) => (event: MouseEvent<HTMLElement>) => {
        navigate(route.href)
    }

    const handleLogout = () => {
        localStorage.removeItem(process.env.REACT_APP_AUTH_JWT as string)
        navigate('/login')
    }

    const drawer = (
      <Box onClick={handleDrawerToggle} sx={{textAlign: 'center'}}>
          <Typography variant="h6" sx={{my: 2}}>
              MUI
          </Typography>
          <Divider/>
          <List>
              {routes.map((route) => (
                <ListItem key={route.id} disablePadding>
                    <ListItemButton sx={{textAlign: 'center'}} onClick={handleNavigate(route)}>
                        <ListItemText primary={route.name}/>
                    </ListItemButton>
                </ListItem>
              ))}
          </List>
      </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
      <Box sx={{display: 'flex'}}>
          <CssBaseline/>
          <AppBar component="nav">
              <Toolbar>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{mr: 2, display: {sm: 'none'}}}
                  >
                      <MenuIcon/>
                  </IconButton>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{flexGrow: 1, display: {xs: 'none', sm: 'block', cursor: 'pointer'}}}
                    onClick={handleNavigate(routes[0])}
                  >
                      LOTO LOGO
                  </Typography>
                  <Box sx={{display: {xs: 'none', sm: 'block'}}}>
                      {
                          routes.map((route: IRoutes) => (
                            (isAuth() && route.hideAfterLogin) || (!isAuth() && route.needToLogin)
                              ? null
                              : <Button key={route.id}
                                        sx={{
                                            color: '#fff',
                                            fontWeight: route.href === location.pathname ? 'bold' : '100'
                                        }}
                                        onClick={handleNavigate(route)}
                              >
                                  {route.name}
                              </Button>
                          ))
                      }
                      {
                          isAuth()
                            ? <Button sx={{color: '#fff'}} onClick={handleLogout}>
                                LOGOUT
                            </Button>
                            : null
                      }
                  </Box>
              </Toolbar>
          </AppBar>
          <nav>
              <Drawer
                container={container}
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: {xs: 'block', sm: 'none'},
                    '& .MuiDrawer-paper': {boxSizing: 'border-box', width: 240},
                }}
              >
                  {drawer}
              </Drawer>
          </nav>
          <Box component="main" sx={{p: 3, width: "100%"}}>
              <Toolbar/>
              {props.children}
          </Box>
      </Box>
    );
}