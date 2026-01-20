import { createBrowserRouter } from "react-router";
import Root from "../layout/Root";
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Terms from "../pages/PrivacyPolicy/Terms";
import Help from "../pages/Help/Help";
import AuthLayout from "../layout/AuthLayout";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import PrivateRoute from "./PrivetRoute";
import Profile from "../pages/Profile/Profile";
import DashboardLayout from "../layout/DashboardLayout";
import DashboardHome from "../pages/Dashboard/DashboardHome";
import AdminRoute from "./AdminRoute"
import BuyerRoute from "./BuyerRoute"
import WorkerRoute from "./WorkerRoute"


// Worker Pages
import TaskList from "../pages/Dashboard/Worker/TaskList"
import TaskDetails from "../pages/Dashboard/Worker/TaskDetails"
import MySubmissions from "../pages/Dashboard/Worker/MySubmissions"
import Withdrawals from "../pages/Dashboard/Worker/Withdrawals"

// Buyer Pages
import AddTask from "../pages/Dashboard/Buyer/AddTask"
import MyTasks from "../pages/Dashboard/Buyer/MyTasks"
import PurchaseCoin from "../pages/Dashboard/Buyer/PurchaseCoin"
import PaymentHistory from "../pages/Dashboard/Buyer/PaymentHistory"
import PaymentSuccess from "../pages/Dashboard/Buyer/PaymentSuccess"
import PaymentCancel from "../pages/Dashboard/Buyer/PaymentCancel"

// Admin Pages
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers"
import ManageTasks from "../pages/Dashboard/Admin/ManageTasks"
import Error from "../components/Error";

export const router = createBrowserRouter([
    {
        path: '/',
        Component: Root,
        errorElement: <Error/>,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: '/about',
                Component: About
            },
            {
                path: '/contact',
                Component: Contact
            },
            {
                path: '/terms/privacy',
                Component: Terms
            },
            {
                path: '/help',
                Component: Help
            },
            {
                path: '/profile',
                element: <PrivateRoute><Profile /></PrivateRoute>
            },
            {
                path: '/settings',
                element: <PrivateRoute><Profile /></PrivateRoute>
            },
        ]
    },
    {
        path: '/',
        Component: AuthLayout,
        children: [
            {
                path: "/login",
                Component: Login
            },
            {
                path: "/register",
                Component: Register
            },
        ]
    },
    {
        path: '/dashboard',
        element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
        children: [
            {
                index: true,
                Component: DashboardHome
            },
            // Worker Routes
            {
                path: 'task-list',
                element: <WorkerRoute><TaskList /></WorkerRoute>
            },
            {
                path: 'task-details/:id',
                element: <WorkerRoute><TaskDetails /></WorkerRoute>
            },
            {
                path: 'my-submissions',
                element: <WorkerRoute><MySubmissions /></WorkerRoute>
            },
            {
                path: 'withdrawals',
                element: <WorkerRoute><Withdrawals /></WorkerRoute>
            },
            // Buyer Routes
            {
                path: 'add-task',
                element: <BuyerRoute><AddTask /></BuyerRoute>
            },
            {
                path: 'my-tasks',
                element: <BuyerRoute><MyTasks /></BuyerRoute>
            },
            {
                path: 'purchase-coin',
                element: <BuyerRoute><PurchaseCoin /></BuyerRoute>
            },
            {
                path: 'payment-history',
                element: <BuyerRoute><PaymentHistory /></BuyerRoute>
            },
            {
                path: 'payment-success',
                element: <BuyerRoute><PaymentSuccess /></BuyerRoute>
            },
            {
                path: 'payment-cancel',
                element: <BuyerRoute><PaymentCancel /></BuyerRoute>
            },
            // Admin Routes
            {
                path: 'manage-users',
                element: <AdminRoute><ManageUsers /></AdminRoute>
            },
            {
                path: 'manage-tasks',
                element: <AdminRoute><ManageTasks /></AdminRoute>
            }
        ]
    }
])
