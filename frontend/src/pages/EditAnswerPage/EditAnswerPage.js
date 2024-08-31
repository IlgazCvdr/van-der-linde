import styles from "./EditAnswerPage.module.css";
import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import AuthContext from "../../contexts/AuthContext";
import ModalContext from "../../contexts/ModalContext";
import { apiUrl } from "../../config/Constants";
import axios from "axios";

function EditAnswerPage(){
    

    const {answerId} = useParams();

    const [answerText, setanswerText] = useState(null);

    const authValues = useContext(AuthContext);
    const modalValues = useContext(ModalContext);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(apiUrl + "/community/Q&A/get-answer?answerId=" + answerId).then(response => {
            setanswerText(response.data.text);
        })
    }, [])

    function handleSubmit(event) {
        event.preventDefault();
        if(!answerText) return modalValues.showError("You must enter a answer description.");
        if(answerText.trim() == "") return modalValues.showError("You must enter a answer description.");

        axios.post(apiUrl + "/community/Q&A/update-answer",
            {newTitle: "", newText: answerText, postId: answerId}, 
            {
                headers: {
                    Authorization: "Bearer " + authValues.token
                }
            }
        ).then(response => {
            navigate("/qa");
        }).catch(err => {
            modalValues.showError("Error: unable to update answer");
        })
    }

    return(
        <div className={styles["form-container"]}>
            <h1>Edit Answer</h1>
            <Form className="border p-3 w-75 bg-white" onSubmit={handleSubmit}>
                <Form.Group controlId="answerText">
                    <Form.Control id="answer-text-area" as="textarea" rows={3} placeholder="Describe your answer" className={styles["review-text-input"] + " mt-2"} value={answerText} onChange={(e) => setanswerText(e.target.value)} />
                </Form.Group>
                <Button className="mt-2" variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default EditAnswerPage;