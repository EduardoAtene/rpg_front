import React from "react";

const NumberStepper = ({ value, onChange }) => {
    const handleIncrease = () => {
        onChange(value + 1);
    };

    const handleDecrease = () => {
        if (value > 0) {
            onChange(value - 1);
        }
    };

    return (
        <div className="d-flex align-items-center">
            <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleDecrease}
            >
                -
            </button>
            <span className="mx-2">{value}</span>
            <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleIncrease}
            >
                +
            </button>
        </div>
    );
};

export default NumberStepper;
