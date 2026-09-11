import Toggle from "./Toggle";

function NotificationTable({
    triggers,
    templates,
    onEdit,
    onToggle,
}) {
    const channels = [
        "WHATSAPP",
        "EMAIL",
        "WEB_PUSH",
    ];

    function findTemplate(triggerId, channel) {
        return templates.find(
            (template) =>
                template.trigger === triggerId &&
                template.channel === channel
        );
    }

    return (
        <div className="table-container">

            <table>

                <thead>
                    <tr>
                        <th>Trigger</th>

                        <th>WhatsApp</th>

                        <th>Email</th>

                        <th>Web Push</th>
                    </tr>
                </thead>

                <tbody>

                    {triggers.map((trigger) => (

                        <tr key={trigger.id}>

                            <td>
                                <div className="trigger-name">
                                    {trigger.name}
                                </div>

                                <div className="trigger-description">
                                    {trigger.description}
                                </div>
                            </td>

                            {channels.map((channel) => {

                                const template =
                                    findTemplate(
                                        trigger.id,
                                        channel
                                    );

                                return (
                                    <td key={channel}>

                                        {template ? (
                                            <div className="template-cell">

                                                <button
                                                    className="template-button"
                                                    onClick={() =>
                                                        onEdit(
                                                            trigger,
                                                            channel,
                                                            template
                                                        )
                                                    }
                                                >
                                                    Edit Template
                                                </button>

                                                <Toggle
                                                    checked={
                                                        template.is_active
                                                    }
                                                    onChange={() =>
                                                        onToggle(
                                                            template.id
                                                        )
                                                    }
                                                />

                                            </div>
                                        ) : (

                                            <button
                                                className="create-button"
                                                onClick={() =>
                                                    onEdit(
                                                        trigger,
                                                        channel,
                                                        null
                                                    )
                                                }
                                            >
                                                + Add Template
                                            </button>

                                        )}

                                    </td>
                                );
                            })}

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default NotificationTable;