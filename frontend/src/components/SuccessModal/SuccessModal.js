// SuccessModal.js
import React, { useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import ModalContext from "../../contexts/ModalContext";
import styles from "./SuccessModal.module.css";

function SuccessModal() {
    const { successShow, successMessage, closeSuccess } = useContext(ModalContext);

    return (
        <Modal show={successShow} onHide={closeSuccess} centered>
            <Modal.Body className={styles.successBody}>
                <div className={styles.successIcon}>✔</div>
                <p>{successMessage}</p>
            </Modal.Body>
            <Modal.Footer className={styles.successFooter}>
                <Button variant="secondary" onClick={closeSuccess}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default SuccessModal;
