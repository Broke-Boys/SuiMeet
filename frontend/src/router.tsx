import { createBrowserRouter,  } from "react-router-dom";
import { Main, ProfileView } from "./pages/desktop/main";
import { Login, SignUp } from "./pages/desktop/signUp";
import { Profile } from "./pages/desktop/profile/profile";
import App from './App'


const router = createBrowserRouter([
    {
        'path': '/sign-up',
        'element': <SignUp />
    },
    {
        'path': '/login',
        'element': <Login />
    },
    {
        'path': '/user/:addr',
        'element': <Profile />
    },
    {
        'path': '/user/:addr/:action',
        'element': <Profile />
    },
    {
        'path': '/:action',
        'element': <Main />
    },
    {
        'path': '/profile/:action',
        'element': <Main />
    },
    {
        'path': '',
        'element': <App />
    }
])

export default router;