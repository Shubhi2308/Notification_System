import { logoutUser } from "../services/api";

function Home({ user, onLogout }) {

    async function handleLogout() {

        try {

            await logoutUser();

            onLogout();

        } catch (error) {

            alert(error.message);

        }
    }

    return (
        <div className="home-page">

            <div className="home-card">

                <h1>
                    Welcome, {user?.username}
                </h1>

                <p>
                    You are successfully logged in.
                </p>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </div>
    );
}

export default Home;