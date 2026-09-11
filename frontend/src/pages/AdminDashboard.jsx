import { useEffect, useState } from "react";

import NotificationTable from "../components/NotificationTable";
import TemplateModal from "../components/TemplateModal";

import {
    getTriggers,
    getTemplates,
    toggleTemplate,
} from "../services/api";


function AdminDashboard() {

    const [triggers, setTriggers] = useState([]);
    const [templates, setTemplates] = useState([]);

    const [selectedTrigger, setSelectedTrigger] =
        useState(null);

    const [selectedChannel, setSelectedChannel] =
        useState(null);

    const [selectedTemplate, setSelectedTemplate] =
        useState(null);

    const [loading, setLoading] = useState(true);

    // Create Trigger states
    const [showCreateTrigger, setShowCreateTrigger] =
        useState(false);

    const [triggerName, setTriggerName] =
        useState("");

    const [triggerDescription, setTriggerDescription] =
        useState("");

    const [triggerActive, setTriggerActive] =
        useState(true);

    const [creatingTrigger, setCreatingTrigger] =
        useState(false);


    async function loadData() {

        try {

            const [
                triggerData,
                templateData,
            ] = await Promise.all([
                getTriggers(),
                getTemplates(),
            ]);

            setTriggers(triggerData);
            setTemplates(templateData);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }
    }


    useEffect(() => {
        loadData();
    }, []);


    function handleEdit(
        trigger,
        channel,
        template
    ) {

        setSelectedTrigger(trigger);
        setSelectedChannel(channel);
        setSelectedTemplate(template);

    }


    async function handleToggle(id) {

        try {

            await toggleTemplate(id);

            await loadData();

        } catch (error) {

            alert(error.message);

        }
    }


    function closeModal() {

        setSelectedTrigger(null);
        setSelectedChannel(null);
        setSelectedTemplate(null);

    }


    function closeCreateTriggerModal() {

        setShowCreateTrigger(false);

        setTriggerName("");
        setTriggerDescription("");
        setTriggerActive(true);

    }


    async function handleCreateTrigger(event) {

        event.preventDefault();

        if (!triggerName.trim()) {

            alert("Please enter a trigger name.");

            return;
        }


        try {

            setCreatingTrigger(true);


            const response = await fetch(
                "http://127.0.0.1:8000/api/triggers/",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        name: triggerName.trim(),
                        description:
                            triggerDescription.trim(),
                        is_active: triggerActive,
                    }),
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    data.message ||
                    "Failed to create trigger."
                );

            }


            alert("Trigger created successfully.");


            closeCreateTriggerModal();

            await loadData();


        } catch (error) {

            console.error(error);

            alert(error.message);


        } finally {

            setCreatingTrigger(false);

        }
    }


    if (loading) {

        return (
            <div className="loading">
                Loading notification settings...
            </div>
        );
    }


    return (
        <div className="dashboard">

            {/* HEADER */}

            <div className="dashboard-header">

                <div>

                    <h1>
                        Notification Settings
                    </h1>

                    <p>
                        Manage notification templates
                        and delivery channels.
                    </p>

                </div>


                <button
                    className="create-trigger-button"
                    onClick={() =>
                        setShowCreateTrigger(true)
                    }
                >
                    + Create Trigger
                </button>

            </div>


            {/* NOTIFICATION TABLE */}

            <NotificationTable
                triggers={triggers}
                templates={templates}
                onEdit={handleEdit}
                onToggle={handleToggle}
            />


            {/* TEMPLATE MODAL */}

            {selectedTrigger && (

                <TemplateModal
                    trigger={selectedTrigger}
                    channel={selectedChannel}
                    template={selectedTemplate}
                    onClose={closeModal}
                    onSaved={() => {
                        closeModal();
                        loadData();
                    }}
                />

            )}


            {/* CREATE TRIGGER MODAL */}

            {showCreateTrigger && (

                <div className="modal-overlay">

                    <div className="modal">

                        <div className="modal-header">

                            <h2>
                                Create Trigger
                            </h2>

                            <button
                                className="modal-close"
                                onClick={
                                    closeCreateTriggerModal
                                }
                            >
                                ×
                            </button>

                        </div>


                        <form
                            onSubmit={
                                handleCreateTrigger
                            }
                        >

                            <div className="form-group">

                                <label>
                                    Trigger Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Example: Login"
                                    value={triggerName}
                                    onChange={(event) =>
                                        setTriggerName(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    placeholder="Example: Notification sent when a user logs in."
                                    value={
                                        triggerDescription
                                    }
                                    onChange={(event) =>
                                        setTriggerDescription(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>


                            <div className="form-checkbox">

                                <input
                                    type="checkbox"
                                    checked={triggerActive}
                                    onChange={(event) =>
                                        setTriggerActive(
                                            event.target.checked
                                        )
                                    }
                                />

                                <label>
                                    Enable trigger
                                </label>

                            </div>


                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={
                                        closeCreateTriggerModal
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="save-button"
                                    disabled={
                                        creatingTrigger
                                    }
                                >
                                    {creatingTrigger
                                        ? "Creating..."
                                        : "Create Trigger"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}


export default AdminDashboard;