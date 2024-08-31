import { useContext, useState } from "react";
import styles from "./CreateLocalCommunityPage.module.css";
import { Button, Form } from "react-bootstrap";
import AuthContext from "../../contexts/AuthContext";
import ModalContext from "../../contexts/ModalContext";
import axios from "axios";
import { apiUrl } from "../../config/Constants";
import { useNavigate } from "react-router-dom";

function CreateLocalCommunityPage() {

    const [name, setName] = useState("");
    const [image, setImage] = useState(null);

    const authValues = useContext(AuthContext);
    const modalValues = useContext(ModalContext);

    const navigate = useNavigate();

    const handleFileChange = (event) => {
        setImage(event.target.files[0]);
    };

    function handleSubmit(event){
        event.preventDefault();
        const formData = new FormData();
        if(name.trim() == "") return modalValues.showError("You must enter a name.");
        formData.set("name", name);
        formData.set("image", image);
        axios.post(apiUrl + "/community/LocalCommunities/create-local-community", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + authValues.token
            }
        }).then(response => {
            modalValues.showSuccess("Local community has been created.");
            navigate("/local-communities");
        }).catch(err => {
            modalValues.showError("Unable to create local community.");
        })
    }

    return (
        <div className={styles["form-container"]}>
            <h1>Create Local Community</h1>
            <Form className="border p-3 w-50" onSubmit={handleSubmit}>
                <Form.Group controlId="productTitle">
                    <Form.Label>Local Community Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Local Community Name"
                        value={name}
                        onChange={(e) => {setName(e.target.value)}}
                    />
                </Form.Group>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="file" onChange={handleFileChange} />
                </Form.Group>
                <Button type="submit">Create</Button>
            </Form>
        </div>
    )
}

export default CreateLocalCommunityPage;