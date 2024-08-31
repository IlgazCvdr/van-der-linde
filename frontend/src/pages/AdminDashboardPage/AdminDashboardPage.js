import { useContext, useEffect, useState } from "react";
import styles from "./AdminDashboardPage.module.css";
import axios from "axios";
import { apiUrl } from "../../config/Constants";
import AuthContext from "../../contexts/AuthContext";
import PendingUsersList from "../../components/PendingUsersList/PendingUsersList";
import ModalContext from "../../contexts/ModalContext";
import { Button } from "react-bootstrap";

function AdminDashboardPage(event) {

    const [pendingUsers, setPendingUsers] = useState(null);
    const [requests, setRequest] = useState(null);

    const authValues = useContext(AuthContext);
    const modalValues = useContext(ModalContext);

    function approveUser(userId) {
        axios.post(apiUrl + "/admin/approve", {
            userId: userId
        }, {
            headers: {
                Authorization: "Bearer " + authValues.token
            }
        }).then(response => {
            const newPendingUsers = pendingUsers.filter(u => {
                return u.id != userId;
            });
            setPendingUsers(newPendingUsers);
        })
    }

    function rejectUser(userId) {
        axios.post(apiUrl + "/admin/reject", {
            userId: userId
        }, {
            headers: {
                Authorization: "Bearer " + authValues.token
            }
        }).then(response => {
            const newPendingUsers = pendingUsers.filter(u => {
                return u.id != userId;
            });
            setPendingUsers(newPendingUsers);
        })
    }

    function sendNewPassword(requestId){
        axios.post(apiUrl + "/admin/send-new-password?requestId=" + requestId, null, {
            headers: {
                Authorization: "Bearer " + authValues.token 
            }
        }).then(response => {
            modalValues.showSuccess("New password has been sent to user.");
        }).catch(err => {
            modalValues.showError("Unable to send new password to user.");
        })
    }

    useEffect(() => {
        axios.get(apiUrl + "/admin/pending-users", {
            headers: {
                Authorization: `Bearer ${authValues.token}`
            }
        }).then(response => {
            setPendingUsers(response.data)
        })

        axios.get(apiUrl + "/admin/password-requests", {
            headers: {
                "Authorization": "Bearer " + authValues.token
            }
        }).then(response => {
            setRequest(response.data);
        }).catch(err => {
            setRequest(null);
        })
    }, [])

    return (
        <div className="text-center">
            <h1>Admin Dashboard</h1>
            <br></br>
            <br></br>
            <h2>Pending Users</h2>
            <PendingUsersList rejectUser={rejectUser} approveUser={approveUser} users={pendingUsers}></PendingUsersList>
            <br></br>
            <br></br>
            <h2>Password Reset Requests</h2>
            <div className={styles["password-requests-container"]}>
                {(() => {
                    if(!requests) return <h3>No requests found.</h3>;
                    return requests.map(r => {
                        return (
                            <div className={styles["password-request"]}>
                                <div>{r.email}</div>
                                <div className="d-flex gap-1">
                                    <Button onClick={() => {sendNewPassword(r.id)}}>Send</Button>
                                </div>
                            </div>
                        )
                    })
                })()}
            </div>
        </div>
    )
}

export default AdminDashboardPage;