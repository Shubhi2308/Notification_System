function Toggle({ checked, onChange }) {
    return (
        <button
            type="button"
            className={`toggle ${checked ? "active" : ""}`}
            onClick={onChange}
        >
            <span className="toggle-circle"></span>

            <span className="toggle-text">
                {checked ? "ON" : "OFF"}
            </span>
        </button>
    );
}

export default Toggle;