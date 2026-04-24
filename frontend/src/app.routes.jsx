import {createBrowserRouter} from "react-router";
import Login from "./features/auth/pages/login";
import Register from "./features/auth/pages/register";
import Home from "./features/auth/pages/Home";
import InterviewHome from "./features/interview/pages/InterviewHome";
import InterviewReport from "./features/interview/pages/InterviewReport";
import UserProtected from "./features/auth/components/UserProtected";


export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/",
        // element: <UserProtected>
        //     <Home />
        // </UserProtected>
        element: <Home />
    },
    {
        path: "/home",
        element: <UserProtected><InterviewHome /></UserProtected>
    },
    {
        path: "/interview-report/:interviewId",
        element: <UserProtected><InterviewReport /></UserProtected>
    }
]);