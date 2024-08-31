import { useContext, useState } from "react";
import styles from "./ForgotPassword.module.css";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { apiUrl } from "../../config/Constants";
import { useNavigate } from "react-router-dom";
import ModalContext from "../../contexts/ModalContext";


function ForgotPasswordPage() {

    const [email, setEmail] = useState("");

    const navigate = useNavigate();
    const modalValues = useContext(ModalContext);

    function handleSubmit(event){
        event.preventDefault();

        axios.post(apiUrl + "/user/forgot-password?email=" + email).then(response => {
            modalValues.showSuccess("Password reset request has been sent to system admin. You will receive an email when your request is accepted.");
        }).catch(err => {
            modalValues.showError("Unable to reset password")
        })
    }

    return (
        <div className={styles["form-container"]}>
            <h1>Forgot Password</h1>
            <Form className="border p-3 w-75 bg-white h-100" onSubmit={handleSubmit}>
                <Form.Group className="" controlId="formPassword">
                <Form.Label>Email</Form.Label>
                <Form.Control id="email" placeholder="Enter your email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                </Form.Group>
                <Button className="mt-2" variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default ForgotPasswordPage;