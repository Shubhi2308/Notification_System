import { useEffect, useState } from "react";
import {
    createTemplate,
    updateTemplate,
    testTemplate,
} from "../services/api";

function TemplateModal({
    trigger,
    channel,
    template,
    onClose,
    onSaved,
}) {
    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (template) {
            setTitle(template.title || "");
            setSubject(template.subject || "");
            setBody(template.body || "");
            setIsActive(template.is_active);
        } else {
            setTitle("");
            setSubject("");
            setBody("");
            setIsActive(true);
        }
    }, [template]);

    async function handleSave() {
        if (!body.trim()) {
            setMessage("Message body is required.");
            return;
        }

        setLoading(true);
        setMessage("");

        const data = {
            trigger: trigger.id,
            channel,
            title,
            subject,
            body,
            is_active: isActive,
        };

        try {
            if (template) {
                await updateTemplate(template.id, data);
            } else {
                await createTemplate(data);
            }

            setMessage("Template saved successfully.");

            setTimeout(() => {
                onSaved();
            }, 700);

        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleTestSend() {
        if (!template) {
            setMessage(
                "Save the template first before testing."
            );
            return;
        }

        try {
            const result = await testTemplate(template.id);

            setMessage(
                result.message || "Test notification successful."
            );
        } catch (error) {
            setMessage(error.message);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal">

                <div className="modal-header">
                    <div>
                        <h2>
                            {template ? "Edit" : "Create"}{" "}
                            {channel.replace("_", " ")} Template
                        </h2>

                        <p>
                            Trigger: {trigger.name}
                        </p>
                    </div>

                    <button
                        className="close-button"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                {channel === "EMAIL" && (
                    <div className="form-group">
                        <label>Subject</label>

                        <input
                            value={subject}
                            onChange={(e) =>
                                setSubject(e.target.value)
                            }
                            placeholder="Login Successful"
                        />
                    </div>
                )}

                {channel !== "EMAIL" && (
                    <div className="form-group">
                        <label>Title</label>

                        <input
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            placeholder="Welcome Back"
                        />
                    </div>
                )}

                <div className="form-group">
                    <label>Message</label>

                    <textarea
                        value={body}
                        onChange={(e) =>
                            setBody(e.target.value)
                        }
                        placeholder="Enter notification message..."
                        rows="6"
                    />
                </div>

                <div className="status-row">
                    <span>Status</span>

                    <button
                        type="button"
                        className={`status-button ${
                            isActive ? "enabled" : "disabled"
                        }`}
                        onClick={() =>
                            setIsActive(!isActive)
                        }
                    >
                        {isActive ? "ON" : "OFF"}
                    </button>
                </div>

                {message && (
                    <div className="modal-message">
                        {message}
                    </div>
                )}

                <div className="modal-actions">

                    <button
                        className="secondary-button"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    {template && (
                        <button
                            className="secondary-button"
                            onClick={handleTestSend}
                        >
                            Test Send
                        </button>
                    )}

                    <button
                        className="primary-button"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>

                </div>

            </div>
        </div>
    );
}

export default TemplateModal;