import { createBrowserRouter, Navigate } from "react-router";
import Login from "./features/auth/pages/Login.jsx";
import Register from "./features/auth/pages/Register.jsx";
import Protected from "./features/auth/components/protected.jsx";
import Layout from "./components/layout/Layout.jsx";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import Home from "./pages/Home.jsx";
import Features from "./pages/Features.jsx";
import About from "./pages/About.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Skills from "./pages/Dashboard/Skills.jsx";
import Profile from "./pages/Account/Profile.jsx";
import Career from "./pages/Account/Career.jsx";
import Assessment from "./pages/Assessment/Assessment.jsx";
import Roadmap from "./pages/Roadmap/Roadmap.jsx";
import GapAnalysis from "./pages/GapAnalysis/GapAnalysis.jsx";



export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "/features",
                element: <Features />
            },
            {
                path: "/about",
                element: <About />
            }
        ]
    },
    {
        path: "/",
        element: <Protected><DashboardLayout /></Protected>,
        children: [
            {
                path: "home",
                element: <Dashboard />
            },
            {
                path: "account/profile",
                element: <Profile />
            },
            {
                path: "account/career",
                element: <Career />
            },
            {
                path: "skills",
                element: <Skills />
            },
            {
                path: "assessment",
                element: <Assessment />
            },
            {
                path: "gap-analysis",
                element: <GapAnalysis />
            },
            {
                path: "roadmap",
                element: <Roadmap />
            }
        ]
    },
    {
        path: "*",
        element: <Navigate to="/" />
    }
])
