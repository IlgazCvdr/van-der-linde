import axios from "axios";
import ForumList from "../../components/ForumList/ForumList";
import { apiUrl } from "../../config/Constants";
import styles from "./ForumsPage.module.css";
import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";

function ForumsPage() {

    const [forums, setForums] = useState(null);

    const navigate = useNavigate();

    const authValues = useContext(AuthContext);

    useEffect(() => {
        axios.get(apiUrl + "/community/forum/get-forum-posts").then(response => {
            setForums(response.data);
        }).catch(err => {
            console.log(err);
        })
    }, []);

    return (
        <div className="w-75 d-flex flex-column align-items-center">
            <h1>Forum Posts</h1>
            {(() => {
                if (!authValues.user) return;
                if (!authValues.token) return;
                return (
                    <div className={"d-grid gap-2 " + styles["create-button-container"]}>
                        <Button onClick={() => { navigate("/forums/create-forum") }} variant="primary" size="lg">
                            Create Forum Post
                        </Button>
                    </div>
                )
            })()}

            <ForumList forums={forums}></ForumList>
        </div>
    )
}

export default ForumsPage;
