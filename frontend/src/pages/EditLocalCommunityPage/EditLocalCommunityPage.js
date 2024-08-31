import styles from "./EditLocalCommunityPage.module.css";
import { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import AuthContext from "../../contexts/AuthContext";
import ModalContext from "../../contexts/ModalContext";
import axios from "axios";
import { apiUrl } from "../../config/Constants";
import { useNavigate, useParams } from "react-router-dom";

function EditLocalCommunityPage() {


    const [name, setName] = useState("");
    const [image, setImage] = useState(null);

    const authValues = useContext(AuthContext);
    const modalValues = useContext(ModalContext);

    const navigate = useNavigate();

    const {communityId} = useParams();

    const handleFileChange = (event) => {
        setImage(event.target.files[0]);
    };

    function handleSubmit(event){
        event.preventDefault();
        const formData = new FormData();
        if(name.trim() == "") return modalValues.showError("You must enter a name.");
        formData.set("name", name);
        formData.set("image", image);
        formData.set("postId", communityId)
        axios.post(apiUrl + "/community/LocalCommunities/update-local-community", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + authValues.token
            }
        }).then(response => {
            modalValues.showSuccess("Local community has been updated.");
            navigate("/local-communities");
        }).catch(err => {
            modalValues.showError("Unable to edit local community.");
        })
    }

    return (
        <div className={styles["form-container"]}>
            <h1>Edit Local Community</h1>
            <Form className="border p-3 w-50" onSubmit={handleSubmit}>
                <Form.Group controlId="productTitle">
                    <Form.Label>Local Community Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter New Local Community Name"
                        value={name}
                        onChange={(e) => { setName(e.target.value) }}
                    />
                </Form.Group>
                <Form.Group controlId="formFile" className="mt-1 mb-3">
                    <Form.Control type="file" onChange={handleFileChange} />
                </Form.Group>
                <Button type="submit">Create</Button>
            </Form>
        </div>
    )
}

export default EditLocalCommunityPage;