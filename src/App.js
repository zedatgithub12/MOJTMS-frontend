import { lazy, useState } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { useLocation } from 'react-router-dom';
// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';

import { AuthContext } from 'context/context';
import { useEffect } from 'react';
import { useMemo } from 'react';

// ==============================|| APP ||============================== //
import Loadable from 'ui-component/Loadable';
const AuthLogin = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login')));
const AuthRegister = Loadable(lazy(() => import('views/pages/authentication/authentication3/Register')));
const Forgot_Password = Loadable(lazy(() => import('views/pages/authentication/forgot-password')));
const Reset_Password = Loadable(lazy(() => import('views/pages/authentication/reset-password')));
const NotFound = Loadable(lazy(() => import('views/notfound')));

const App = () => {
    const customization = useSelector((state) => state.customization);
    const location = useLocation();
    const path = location.pathname;
    const tokenIndex = path.lastIndexOf('/') + 1;
    const token = path.substring(tokenIndex);

    const [loged, setLoged] = useState(false);

    const authContext = useMemo(
        () => ({
            SignIn: async (status, users) => {
                if (status === 'Signed') {
                    const ttl = new Date(users.expires_in * 1000); // TTL in seconds
                    const expirationTime = ttl.getTime(); // Calculate expiration time in milliseconds

                    sessionStorage.setItem('user', JSON.stringify(users));
                    sessionStorage.setItem('token', users.token);
                    sessionStorage.setItem('tokenExpiration', expirationTime);

                    setLoged(true);
                } else {
                    setLoged(false);
                }
            },

            SignOut: async (status) => {
                if (status === 'Signout') {
                    sessionStorage.clear();

                    setLoged(false);
                }
                {
                    setLoged(false);
                }
            },

            getToken: async () => {
                const tokenString = sessionStorage.getItem('token');
                const userToken = JSON.parse(tokenString);
                return userToken;
            },

            getUser: async () => {
                const userString = sessionStorage.getItem('user');
                const userDetails = JSON.parse(userString);
                return userDetails;
            }
        }),
        []
    );

    useEffect(() => {
        var tokens = sessionStorage.getItem('token');
        if (tokens !== null) {
            setLoged(true);
        }
        return () => {};
    }, [loged]);

    return (
        <StyledEngineProvider injectFirst>
            <AuthContext.Provider value={authContext}>
                <ThemeProvider theme={themes(customization)}>
                    <CssBaseline />
                    <NavigationScroll>
                        {loged ? (
                            <Routes />
                        ) : location.pathname === '/pages/register/register' ? (
                            <AuthRegister />
                        ) : location.pathname === '/forgot-password' ? (
                            <Forgot_Password />
                        ) : location.pathname === `/reset-password/${token}` ? (
                            <Reset_Password />
                        ) : location.pathname === '/pages/login/login' ? (
                            <AuthLogin />
                        ) : location.pathname === '/' ? (
                            <AuthLogin />
                        ) : (
                            <NotFound />
                        )}
                    </NavigationScroll>
                </ThemeProvider>
            </AuthContext.Provider>
        </StyledEngineProvider>
    );
};

export default App;
