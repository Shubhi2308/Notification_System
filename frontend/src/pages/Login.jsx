import { useState } from "react";
import { loginUser } from "../services/api";

function Login({ onLogin }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const result = await loginUser(
                email,
                password
            );

            onLogin(result);

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);

        }
    }

    return (
        <div className="login-page">

            <div className="login-card">

                <div className="login-header">

                    <h1>
                        Notification System
                    </h1>

                    <p>
                        Sign in to continue
                    </p>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter your email"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter your password"
                            required
                        />

                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "Login"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;