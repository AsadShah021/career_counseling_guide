import React, { useState } from "react";

const Button = ({ name, Component }) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button onClick={() => setShowModal(true)}>{name}</button>
            {showModal && <Component onClose={() => setShowModal(false)} />}
        </>
    );
};

export default Button;
