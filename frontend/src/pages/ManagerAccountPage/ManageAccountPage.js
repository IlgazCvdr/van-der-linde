import { useContext, useEffect, useState } from "react";
import styles from "./ManageAccountPage.module.css";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useParams, useRevalidator } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../config/Constants";
import AuthContext from "../../contexts/AuthContext";
import ModalContext from "../../contexts/ModalContext";

function ManageAccountPage() {

    const { userId } = useParams();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [image, setImage] = useState(null);

    const authValues = useContext(AuthContext);
    const modalValues = useContext(ModalContext);

    const navigate = useNavigate();

    function submitHandler(e) {
        e.preventDefault()

        if (password != confirmPassword) {
            return modalValues.showError("Passwords do not match");
        }

        axios.post(apiUrl + "/user/update", {
            userId: userId,
            firstName: firstName,
            lastName: lastName,
            password: password,
            confirmPassword: confirmPassword,
            image: image
        }, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + authValues.token
            }
        }).then(response => {
            navigate("/user/" + userId);
        }).catch(err => {
            modalValues.showError("Unable to manage the user");
        })
    }

    useEffect(() => {
        axios.get(apiUrl + "/user/get?userId=" + userId).then(response => {
            const user = response.data;
            setFirstName(user.firstName);
            setLastName(user.lastName);
        })
    }, []);

    function handleFileChange(event) {
        setImage(event.target.files[0]);
    }

    function onDeleteClick() {
        axios.post(apiUrl + "/user/delete?userId=" + userId, null, {
            headers: {
                Authorization: "Bearer " + authValues.token
            }
        }).then(response => {
            if (userId == authValues.user.id) {
                authValues.user = null;
                authValues.token = null;
            }
            modalValues.showSuccess("User has been deleted.");
            navigate("/");
        }).catch(err => {
            modalValues.showError("Unable to delete the user.");
        })
    }

    function onBanClick() {
        axios.post(apiUrl + "/admin/ban", {
            userId: userId
        }, {
            headers: {
                Authorization: "Bearer " + authValues.token
            }
        }).then(response => {
            modalValues.showSuccess("User has been banned.");
            navigate("/user/" + userId);
        }).catch(err => {
            modalValues.showError("Unable to ban user.");
        })
    }

    return (
        <div className={styles["form-container"]}>
            <h1>Manage Account</h1>
            <Form onSubmit={submitHandler} className="p-3 w-100 border bg-white">
                <Form.Group className="mb-3" controlId="formFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control autoComplete="off" value={firstName} onChange={(e) => { setFirstName(e.target.value) }} type="text" placeholder="Enter new first name" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control autoComplete="off" value={lastName} onChange={(e) => { setLastName(e.target.value) }} type="text" placeholder="Enter new last name" />
                </Form.Group>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Profile Image</Form.Label>
                    <Form.Control type="file" onChange={handleFileChange} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                        type="password"
                        placeholder="Enter new password"
                        name="password"
                        autoComplete="off"
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value) }}
                        type="password"
                        placeholder="Confirm new password"
                        name="confirmPassword"
                        autoComplete="off"
                    />
                </Form.Group>
                <div className="d-flex flex-row justify-content-between">
                    <Button className="" variant="primary" type="submit">
                        Submit
                    </Button>
                    <div className="d-flex gap-1">
                        {(() => {
                            if (!authValues.user) return;
                            if (!authValues.user.id == userId || authValues.user.roleNames.includes("admin")) {
                                return (
                                    <Button onClick={onBanClick} variant="danger">
                                        Ban User
                                    </Button>
                                )
                            }
                        })()}
                        <Button onClick={onDeleteClick} className="" variant="danger">
                            Delete Account
                        </Button>
                    </div>
                </div>
            </Form>
        </div>
    )
}

export default ManageAccountPage;