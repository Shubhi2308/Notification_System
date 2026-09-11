import { useState } from "react";
import OneSignal from "react-onesignal";

import Login from "./pages/Login";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import { getOneSignalSubscriptionId } from "./onesignal";

import {
    saveOneSignalSubscription,
    logoutUser
} from "./services/api";

function App() {

    const [user, setUser] = useState(null);

    const [page, setPage] = useState("login");

    async function handleLogin(result) {

    setUser(result.user);
    setPage("home");

    console.log(
        "Login notification result:",
        result.notification
    );

    try {

        const subscriptionId =
    await getOneSignalSubscriptionId();

        console.log(
            "OneSignal Subscription ID:",
            subscriptionId
        );

        if (subscriptionId) {

            const saved =
                await saveOneSignalSubscription(subscriptionId);

            console.log(
                "OneSignal subscription saved:",
                saved
            );

        } else {

            console.log(
                "No OneSignal subscription ID found."
            );

        }

    } catch (error) {

        console.error(
            "Failed to save OneSignal subscription:",
            error
        );

    }
}

    async function handleLogout() {

    try {

        const result = await logoutUser();

        console.log(
            "Logout notification result:",
            result.notification
        );

        setUser(null);
        setPage("login");

    } catch (error) {

        console.error(
            "Logout failed:",
            error
        );

        alert(error.message);

    }

}

    if (page === "login") {

        return (
            <Login
                onLogin={handleLogin}
            />
        );
    }

    if (page === "home") {

        return (
            <div>

                <nav className="navbar">

                    <div className="navbar-brand">
                        Notification System
                    </div>

                    <div className="navbar-actions">

                        <button
                            onClick={() =>
                                setPage("home")
                            }
                        >
                            Home
                        </button>

                        <button
                            onClick={() =>
                                setPage("admin")
                            }
                        >
                            Admin Dashboard
                        </button>

                    </div>

                </nav>

                <Home
                    user={user}
                    onLogout={handleLogout}
                />

            </div>
        );
    }

    if (page === "admin") {

        return (
            <div>

                <nav className="navbar">

                    <div className="navbar-brand">
                        Notification System
                    </div>

                    <div className="navbar-actions">

                        <button
                            onClick={() =>
                                setPage("home")
                            }
                        >
                            Home
                        </button>

                        <button
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </div>

                </nav>

                <AdminDashboard />

            </div>
        );
    }

    return null;
}

export default App;