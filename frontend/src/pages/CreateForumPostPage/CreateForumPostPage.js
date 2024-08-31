import { useContext, useState } from "react";
import styles from "./CreateForumPostPage.module.css";
import { Form, Button } from "react-bootstrap";
import AuthContext from "../../contexts/AuthContext";
import axios from "axios";
import { apiUrl } from "../../config/Constants";
import { useNavigate } from "react-router-dom";
import ModalContext from "../../contexts/ModalContext";

function CreateForumPostPage() {
    const [postTitle, setPostTitle] = useState("");
    const [postText, setPostText] = useState("");

    const authValues = useContext(AuthContext);
    const modalValues = useContext(ModalContext);
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        if (!postTitle.trim() || !postText.trim()) {
            modalValues.showError("Both title and description are required.");
            return;
        }

        axios.post(
            apiUrl + "/community/forum/create-post",
            { title: postTitle, text: postText },
            {
                headers: {
                    Authorization: "Bearer " + authValues.token,
                },
            }
        )
        .then((response) => {
            navigate("/forums");
        })
        .catch((error) => {
            modalValues.showError("Error: unable to create post");
        });
    }

    return (
        <div className={styles["form-container"]}>
            <h1>Create a New Forum Post</h1>
            <Form className="border p-3 w-75 bg-white" onSubmit={handleSubmit}>
                <Form.Control
                    id="postTitle"
                    placeholder="Enter post title"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                />
                <Form.Group controlId="postText">
                    <Form.Control
                        id="post-text-area"
                        as="textarea"
                        rows={3}
                        placeholder="Describe your post"
                        className={styles["review-text-input"] + " mt-2"}
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                    />
                </Form.Group>
                <Button className="mt-2" variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
}

export default CreateForumPostPage;
