import styles from "./EditForumPostReplyPage.module.css";
import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import AuthContext from "../../contexts/AuthContext";
import ModalContext from "../../contexts/ModalContext";
import { apiUrl } from "../../config/Constants";
import axios from "axios";

function EditForumPostReplyPage() {
    const { replyId: answerPostId } = useParams();

    const [replyText, setReplyText] = useState("");

    const authValues = useContext(AuthContext);
    const modalValues = useContext(ModalContext);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(apiUrl + "/community/forum/get-forum-reply-post?postId=" + answerPostId).then(response => {
            setReplyText(response.data.text);
        })
    }, []);

    function handleSubmit(event) {
        event.preventDefault();
        if (!replyText) return modalValues.showError("You must enter a reply description.");
        if (replyText.trim() === "") return modalValues.showError("You must enter a reply description.");

        axios.post(apiUrl + "/community/forum/update-reply-post",
            {newTitle:"dummy", newText: replyText, postId: answerPostId },
            {
                headers: {
                    Authorization: "Bearer " + authValues.token
                }
            }
        ).then(response => {
            navigate("/forums");
        }).catch(err => {
            modalValues.showError("Error: unable to update reply");
        })
    }

    return (
        <div className={styles["form-container"]}>
            <h1>Edit Reply</h1>
            <Form className="border p-3 w-75 bg-white" onSubmit={handleSubmit}>
                <Form.Group controlId="replyText">
                    <Form.Control id="reply-text-area" as="textarea" rows={3} placeholder="Describe your reply" className={styles["review-text-input"] + " mt-2"} value={replyText} onChange={(e) => setReplyText(e.target.value)} />
                </Form.Group>
                <Button className="mt-2" variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default EditForumPostReplyPage;
