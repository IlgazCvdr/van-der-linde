import styles from "./EditForumPostPage.module.css";
import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import AuthContext from "../../contexts/AuthContext";
import ModalContext from "../../contexts/ModalContext";
import { apiUrl } from "../../config/Constants";
import axios from "axios";

function EditForumPostPage() {
    const { postId } = useParams(); // Changed ForumPostId to postId

    const [postTitle, setPostTitle] = useState(""); // Changed null to ""
    const [postText, setPostText] = useState(""); // Changed null to ""

    const authValues = useContext(AuthContext);
    const modalValues = useContext(ModalContext);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(apiUrl + "/community/forum/get-forum-post?postId=" + postId).then(response => {
            setPostText(response.data.text);
            setPostTitle(response.data.title);
        })
    }, [postId]); // Added postId to dependency array

    function handleSubmit(event) {
        event.preventDefault();
        if (!postTitle) return modalValues.showError("You must enter a post title.");
        if (!postText) return modalValues.showError("You must enter a post description.");
        if (postTitle.trim() === "") return modalValues.showError("You must enter a post title.");
        if (postText.trim() === "") return modalValues.showError("You must enter a post description.");

        axios.post(apiUrl + "/community/forum/update-post", {
            newTitle: postTitle,
            newText: postText,
            postId: postId
        }, {
            headers: {
                Authorization: "Bearer " + authValues.token
            }
        }).then(response => {
            navigate("/forums");
        }).catch(err => {
            modalValues.showError("Error: unable to update post");
        })
    }

    return (
        <div className={styles["form-container"]}>
            <h1>Edit Forum Post</h1>
            <Form className="border p-3 w-75 bg-white" onSubmit={handleSubmit}>
                <Form.Control id="postTitle" placeholder="Enter post title" value={postTitle} onChange={(e) => { setPostTitle(e.target.value) }} />
                <Form.Group controlId="postText">
                    <Form.Control id="post-text-area" as="textarea" rows={3} placeholder="Describe your post" className={styles["review-text-input"] + " mt-2"} value={postText} onChange={(e) => setPostText(e.target.value)} />
                </Form.Group>
                <Button className="mt-2" variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default EditForumPostPage;
