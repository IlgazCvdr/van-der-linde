import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import styles from "./CreateLocalCommunityPostPage.module.css";
import { useContext, useState } from "react";
import ModalContext from "../../contexts/ModalContext";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { apiUrl } from "../../config/Constants";

function CreateLocalCommunityPostPage() {

    const authValues = useContext(AuthContext);
    const modalValues = useContext(ModalContext);

    const navigate = useNavigate();

    const { communityId } = useParams();

    const [title, setTitle] = useState("dummy");
    const [postText, setPostText] = useState("");
    const [image, setImage] = useState(null);

    function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.set("image", image);
        formData.set("title", "dummy");
        formData.set("text", postText);
        formData.set("fromCommunity", communityId);

        axios.post(apiUrl + "/community/LocalCommunities/create-local-community-post", formData, {
            headers: {
                Authorization: "Bearer " + authValues.token,
                "Content-Type": "multipart/form-data"
            }
        }).then(response => {
            modalValues.showSuccess("Post has been created.");
            navigate("/local-community/" + communityId);
        }).catch(err => {
            modalValues.showError("Unable to create post.");
        })
    }

    function handleFileChange(event){
        setImage(event.target.files[0]);
    }

    return (
        <div className={styles["form-container"]}>
            <h1>Create Post</h1>
            <Form className="border p-3 w-75 bg-white" onSubmit={handleSubmit}>
                <Form.Group controlId="questionText">
                    <Form.Control id="text-area" as="textarea" rows={3} placeholder="Enter post description" className={styles["text-input"] + " mt-2"} value={postText} onChange={(e) => setPostText(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="formFile" className="mb-2 mt-2">
                    <Form.Control type="file" onChange={handleFileChange} />
                </Form.Group>
                <Button className="" variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default CreateLocalCommunityPostPage;