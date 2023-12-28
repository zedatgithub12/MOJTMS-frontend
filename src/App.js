import { lazy, useState } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import { AuthContext } from 'context/context';
import { useEffect } from 'react';
import { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import Loadable from 'ui-component/Loadable';
import NavigationScroll from 'layout/NavigationScroll';
import i18n from './i18n';

// ==============================|| APP ||============================== //

const AuthLogin = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login')));
const AuthRegister = Loadable(lazy(() => import('views/pages/authentication/authentication3/Register')));
const Forgot_Password = Loadable(lazy(() => import('views/pages/authentication/forgot-password')));
const Reset_Password = Loadable(lazy(() => import('views/pages/authentication/reset-password')));
const NotFound = Loadable(lazy(() => import('views/notfound')));

const queryClient = new QueryClient();

const App = () => {
    const customization = useSelector((state) => state.customization);
    const location = useLocation();
    const navigate = useNavigate();
    const path = location.pathname;
    const pathIndex = path.lastIndexOf('/') + 1;
    const id = path.substring(pathIndex);
    const token = path.substring(pathIndex);

    const [loged, setLoged] = useState(false);

    useEffect(() => {
        if (path === `/training/shared/${id}` && !loged) {
            sessionStorage.setItem('t_id', id);
        } else if (loged && location.pathname === `/training/shared/${id}`) {
            navigate('training/session/detail', { state: { id: id } });
        }

        if (path === `/backend/api/training/shared/${id}` && !loged) {
            sessionStorage.setItem('t_id', id);
        } else if (loged && path === `/backend/api/training/shared/${id}`) {
            navigate('training/session/detail', { state: { id: id } });
        }

        return () => {};
    }, [path, id, loged]);

    const RefreshWindow = async () => {
        window.location.reload();
    };

    const authContext = useMemo(
        () => ({
            SignIn: async (status, users) => {
                if (status === 'Signed') {
                    const ttl = new Date(users.expires_in * 1000); // TTL in seconds
                    const expirationTime = ttl.getTime(); // Calculate expiration time in milliseconds

                    sessionStorage.setItem('user', JSON.stringify(users));
                    sessionStorage.setItem('token', users.token);
                    sessionStorage.setItem('tokenExpiration', expirationTime);

                    const t_id = sessionStorage.getItem('t_id'); //check if there is an id of  externally opened link stored in sessionStorage
                    //if the training id is found navigate to the training session detail page
                    if (t_id) {
                        navigate('/training/session/detail', { state: { id: id } });
                        sessionStorage.removeItem('t_id');
                        await RefreshWindow();
                        setLoged(true);
                        return;
                    }

                    await RefreshWindow();
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
            },

            getRole: () => {
                const userData = sessionStorage.getItem('user');
                const user = JSON.parse(userData);
                return user.user.role;
            }
        }),
        [id]
    );

    useEffect(() => {
        var tokens = sessionStorage.getItem('token');
        if (tokens !== null) {
            setLoged(true);
        }
        return () => {};
    }, [loged]);

    return (
        <I18nextProvider i18n={i18n}>
            <StyledEngineProvider injectFirst>
                <AuthContext.Provider value={authContext}>
                    <QueryClientProvider client={queryClient}>
                        <ThemeProvider theme={themes(customization)}>
                            <HelmetProvider>
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
                                    ) : location.pathname === `/training/shared/${id}` ? (
                                        <AuthLogin />
                                    ) : location.pathname === `/backend/api/training/shared/${id}` ? (
                                        <AuthLogin />
                                    ) : location.pathname === '/' ? (
                                        <AuthLogin />
                                    ) : (
                                        <NotFound />
                                    )}
                                </NavigationScroll>
                            </HelmetProvider>
                        </ThemeProvider>
                    </QueryClientProvider>
                </AuthContext.Provider>
            </StyledEngineProvider>
        </I18nextProvider>
    );
};

export default App;
