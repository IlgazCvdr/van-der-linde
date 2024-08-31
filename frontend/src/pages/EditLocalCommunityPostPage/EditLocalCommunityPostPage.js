import { useContext, useState } from "react";
import styles from "./EditLocalCommunityPostPage.module.css";
import AuthContext from "../../contexts/AuthContext";
import ModalContext from "../../contexts/ModalContext";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { apiUrl } from "../../config/Constants";
import axios from "axios";

function EditLocalCommunityPostPage() {

    const authValues = useContext(AuthContext);
    const modalValues = useContext(ModalContext);

    const navigate = useNavigate();

    const [text, setText] = useState("");
    const [image, setImage] = useState(null);

    const { postId } = useParams();

    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData();
        formData.set("title", "dummy");
        formData.set("text", text);
        formData.set("postId", postId);
        formData.set("image", image);
        axios.post(apiUrl + "/community/LocalCommunities/update-local-community-post", formData, {
            headers: {
                Authorization: "Bearer: " + authValues.token,
                "Content-Type": "multipart/form-data"
            }
        }).then(response => {
            modalValues.showSuccess("Post has been updated.");
            navigate("/local-communities");
        }).catch(err => {
            modalValues.showError("Unable to update the post.");
        })
    }

    function handleFileChange(event){
        setImage(event.target.files[0]);
    }

    return (
        <div className={styles["form-container"]}>
            <h1>Edit Post</h1>
            <Form className="border p-3 w-75 bg-white" onSubmit={handleSubmit}>
                <Form.Group controlId="answerText">
                    <Form.Control id="answer-text-area" as="textarea" rows={3} placeholder="Enter your post" className={styles["review-text-input"] + " mt-2"} value={text} onChange={(e) => setText(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="formFile" className="mt-2">
                    <Form.Control type="file" onChange={handleFileChange} />
                </Form.Group>
                <Button className="mt-2" variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default EditLocalCommunityPostPage;