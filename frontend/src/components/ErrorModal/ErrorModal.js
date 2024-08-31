// ErrorModal.js
import React, { useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import ModalContext from "../../contexts/ModalContext";
import styles from "./ErrorModal.module.css";

function ErrorModal() {
    const { errorShow, errorMessage, closeError } = useContext(ModalContext);

    return (
        <Modal show={errorShow} onHide={closeError} centered>
            <Modal.Body className={styles.errorBody}>
                <div className={styles.errorIcon}>!</div>
                <p>{errorMessage}</p>
            </Modal.Body>
            <Modal.Footer className={styles.errorFooter}>
                <Button variant="secondary" onClick={closeError}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ErrorModal;
