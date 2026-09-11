const API_BASE_URL = "https://notification-system-app.onrender.com";

async function getCsrfToken() {
    const response = await fetch(
        `${API_BASE_URL}/csrf/`,
        {
            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to get CSRF token");
    }

    return response.json();
}

export async function getTriggers() {
    const response = await fetch(`${API_BASE_URL}/triggers/`);

    if (!response.ok) {
        throw new Error("Failed to fetch triggers");
    }

    return response.json();
}

export async function getTemplates() {
    const response = await fetch(`${API_BASE_URL}/templates/`);

    if (!response.ok) {
        throw new Error("Failed to fetch templates");
    }

    return response.json();
}

export async function createTemplate(data) {
    const response = await fetch(`${API_BASE_URL}/templates/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(JSON.stringify(result));
    }

    return result;
}

export async function updateTemplate(id, data) {
    const response = await fetch(
        `${API_BASE_URL}/templates/${id}/`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(JSON.stringify(result));
    }

    return result;
}

export async function toggleTemplate(id) {
    const response = await fetch(
        `${API_BASE_URL}/templates/${id}/toggle/`,
        {
            method: "PATCH",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to toggle template");
    }

    return response.json();
}

export async function testTemplate(id) {
    const response = await fetch(
        `${API_BASE_URL}/templates/${id}/test/`,
        {
            method: "POST",
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(JSON.stringify(result));
    }

    return result;
}

export async function loginUser(email, password) {
    // Get CSRF token first
    const csrfResponse = await fetch(`${API_BASE_URL}/csrf/`, {
        method: "GET",
        credentials: "include",
    });

    const csrfData = await csrfResponse.json();

    if (!csrfResponse.ok) {
        throw new Error(csrfData.error || "Failed to get CSRF token");
    }

    // Now login with the CSRF token
    const response = await fetch(`${API_BASE_URL}/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfData.csrfToken,
        },
        body: JSON.stringify({
            email,
            password,
        }),
        credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || "Login failed");
    }

    return result;
}
export async function logoutUser() {
    // Get CSRF token first
    const csrfResponse = await fetch(`${API_BASE_URL}/csrf/`, {
        method: "GET",
        credentials: "include",
    });

    const csrfData = await csrfResponse.json();

    if (!csrfResponse.ok) {
        throw new Error(csrfData.error || "Failed to get CSRF token");
    }

    // Logout with CSRF token
    const response = await fetch(`${API_BASE_URL}/logout/`, {
        method: "POST",
        headers: {
            "X-CSRFToken": csrfData.csrfToken,
        },
        credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || "Logout failed");
    }

    return result;
}
export async function saveOneSignalSubscription(subscriptionId) {
    const csrfResponse = await fetch(
        `${API_BASE_URL}/csrf/`,
        {
            credentials: "include",
        }
    );

    const csrfData = await csrfResponse.json();

    const response = await fetch(
        `${API_BASE_URL}/save-onesignal-subscription/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfData.csrfToken,
            },
            credentials: "include",
            body: JSON.stringify({
                subscription_id: subscriptionId,
            }),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.error ||
            "Failed to save OneSignal subscription"
        );
    }

    return result;
}