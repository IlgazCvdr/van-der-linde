import React, { useState, createContext } from "react";

const ModalContext = createContext(null);

export function ModalProvider(props) {
    const [errorShow, setErrorShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successShow, setSuccessShow] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    function showError(text) {
        setErrorMessage(text);
        setErrorShow(true);
    }

    function showSuccess(text) {
        setSuccessMessage(text);
        setSuccessShow(true);
    }

    function closeError() {
        setErrorShow(false);
        setErrorMessage("");
    }

    function closeSuccess() {
        setSuccessShow(false);
        setSuccessMessage("");
    }

    return (
        <ModalContext.Provider
            value={{
                errorShow,
                setErrorShow,
                errorMessage,
                successShow,
                setSuccessShow,
                successMessage,
                showError,
                showSuccess,
                closeError,
                closeSuccess
            }}
        >
            {props.children}
        </ModalContext.Provider>
    );
}

export default ModalContext;
