import { useContext, useState } from "react";
import styles from "./CreateQuestion.module.css";
import { Form, Button } from "react-bootstrap";
import AuthContext from "../../contexts/AuthContext";
import axios from "axios";
import { apiUrl } from "../../config/Constants";
import { useNavigate } from "react-router-dom";
import ModalContext from "../../contexts/ModalContext";

function CreateQuestionPage() {

    const [questionTitle, setQuestionTitle] = useState(null);
    const [questionText, setQuestionText] = useState(null);

    const authValues = useContext(AuthContext);
    const modalValues = useContext(ModalContext);

    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        if(!questionTitle) return modalValues.showError("You must enter a question title.");
        if(!questionText) return modalValues.showError("You must enter a question description.");
        if(questionTitle.trim() == "") return modalValues.showError("You must enter a question title.");
        if(questionText.trim() == "") return modalValues.showError("You must enter a question description.");

        axios.post(apiUrl + "/community/Q&A/create-question",
            {title: questionTitle, text: questionText}, 
            {
                headers: {
                    Authorization: "Bearer " + authValues.token
                }
            }
        ).then(response => {
            navigate("/qa");
        }).catch(err => {
            modalValues.showError("Error: unable to create question");
        })
    }

    return (
        <div className={styles["form-container"]}>
            <h1>Create a New Question</h1>
            <Form className="border p-3 w-75 bg-white" onSubmit={handleSubmit}>
                <Form.Control id="questionTitle" placeholder="Enter question title" value={questionTitle} onChange={(e) => {setQuestionTitle(e.target.value)}}/>
                <Form.Group controlId="questionText">
                    <Form.Control id="question-text-area" as="textarea" rows={3} placeholder="Describe your question" className={styles["review-text-input"] + " mt-2"} value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
                </Form.Group>
                <Button className="mt-2" variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default CreateQuestionPage;