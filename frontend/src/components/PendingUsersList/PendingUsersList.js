import { Button } from "react-bootstrap";
import styles from "./PendingUsersList.module.css";
import axios from "axios";
import { apiUrl } from "../../config/Constants";
import { useContext } from "react";
import AuthContext from "../../contexts/AuthContext";

function PendingUsersList({ users, approveUser, rejectUser }) {

    return (
        <div className={styles["user-list-container"] + " "}>
            {(() => {
                if(!users) return;
                if(users.length == 0) return <h3>No pending users found</h3>;
                return users.map(u => {
                    let accountType = "User";
                    if(u.roleNames.includes("merchant")) accountType = "Merchant"
                    return (
                        <div className={styles["user-card"]}>
                            <div className={styles["name"]}>{u.firstName + " " + u.lastName}</div>
                            <div className={styles["account-type"]}>{accountType}</div>
                            <div className={styles["email"]}>{u.email}</div>
                            <div className="d-flex gap-1">
                                <Button onClick={() => {approveUser(u.id)}}>Approve</Button>
                                <Button onClick={() => {rejectUser(u.id)}} variant="danger">Reject</Button>
                            </div>
                        </div>
                    )
                })
            })()}
        </div>
    )
}

export default PendingUsersList;