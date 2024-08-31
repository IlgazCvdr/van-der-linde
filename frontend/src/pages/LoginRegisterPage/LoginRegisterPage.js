import { apiUrl } from "../../config/Constants";
import styles from "./LoginRegisterPage.module.css";
import { useRef, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Form, ToggleButtonGroup, ToggleButton, Button } from "react-bootstrap";
import ModalContext from "../../contexts/ModalContext";

function LoginRegisterPage() {

    const [formType, setFormType] = useState("login");

    const authValues = useContext(AuthContext);
    const modalValues = useContext(ModalContext);

    function loginTabClick() {
        setFormType("login");
    }

    function registerTabClick() {
        setFormType("register");
    }

    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const firstNameRef = useRef();
    const lastNameRef = useRef();

    let navigate = useNavigate();

    const [accountType, setAccountType] = useState("customer");

    const handleToggleButtonChange = (val) => setAccountType(val);

    async function loginSubmitHandler(event) {
        event.preventDefault();
        const postData = {
            email: emailRef.current.value,
            password: passwordRef.current.value
        }
        axios.post(apiUrl + "/user/login", postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            console.log(response);
            authValues.setToken(response.data.accessToken);
            authValues.setUser(response.data.user);
            localStorage.setItem("token", response.data.accessToken);
            navigate("/");
        }).catch(err => {
            modalValues.showError(err.response.data);
        })

    }

    async function registerSubmitHandler(event) {
        event.preventDefault();

        const postData = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
            confirmPassword: confirmPasswordRef.current.value,
            firstName: firstNameRef.current.value,
            lastName: lastNameRef.current.value,
            accountType: accountType
        }

        console.log(postData);

        if (!postData.email) {
            alert("Email address can't be null");
            return;
        }

        if (!postData.firstName) {
            alert("first name can't be null");
            return;
        }

        if (!postData.lastName) {
            alert("last name can't be null");
            return;
        }

        if (!postData.password) {
            alert("password can't be null");
            return;
        }

        if (postData.password != postData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        axios.post(apiUrl + "/user/register", postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            setFormType("login");
            modalValues.showSuccess("Register request has been sent. You will be able to login when your account is approved.")
        }).catch(err => {
            modalValues.showError(err.response.data);
        })
    }

    if (formType == "login") {
        return (
            <div className={styles["login-register"]}>
                <div className={styles["tab-container"]}>
                    <div onClick={loginTabClick} id="login-tab" className={styles["login-tab"]}>Login</div>
                    <div onClick={registerTabClick} id="register-tab" className={styles["register-tab"] + " " + styles["not-selected"]}>Register</div>
                </div>
                <Form onSubmit={loginSubmitHandler} className="p-3">
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control ref={emailRef} type="email" placeholder="Enter email" />
                    </Form.Group>

                    <Form.Group className="" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            ref={passwordRef}
                            type="password"
                            placeholder="Password"
                            name="password"
                        />
                    </Form.Group>
                    <Form.Text className="text-muted">
                        <div onClick={() => {navigate("/forgot-password")}} className={styles["forgot-password"]}>Forgot Password?</div>
                    </Form.Text>
                    <div className="d-grid gap-2 mt-3">
                        <Button className="" variant="primary" size="lg" type="submit">
                            Login
                        </Button>
                    </div>
                </Form>
            </div>
        )
    } else {
        return (
            <div className={styles["login-register"]}>
                <div className={styles["tab-container"]}>
                    <div onClick={loginTabClick} id="login-tab" className={styles["login-tab"] + " " + styles["not-selected"]}>Login</div>
                    <div onClick={registerTabClick} id="register-tab" className={styles["register-tab"]}>Register</div>
                </div>
                <Form onSubmit={registerSubmitHandler} className="p-3">
                    <Form.Group className="mb-3" controlId="formFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control ref={firstNameRef} type="text" placeholder="Enter first name" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control ref={lastNameRef} type="text" placeholder="Enter last name" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control ref={emailRef} type="email" placeholder="Enter email" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            ref={passwordRef}
                            type="password"
                            placeholder="Password"
                            name="password"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formConfirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            ref={confirmPasswordRef}
                            type="password"
                            placeholder="Confirm password"
                            name="confirmPassword"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formAccountType">
                        <Form.Label>Account Type</Form.Label>
                        <ToggleButtonGroup className="d-block" type="radio" name="options" value={accountType} onChange={handleToggleButtonChange}>
                            <ToggleButton id="tbg-radio-1" value={"customer"}>
                                Customer
                            </ToggleButton>
                            <ToggleButton id="tbg-radio-2" value={"merchant"}>
                                Merchant
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Form.Group>
                    <div className="d-grid gap-2">
                        <Button className="" variant="primary" size="lg" type="submit">
                            Register
                        </Button>
                    </div>
                </Form>
            </div>
        )
    }

}

export default LoginRegisterPage;