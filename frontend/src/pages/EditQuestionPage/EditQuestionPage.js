import styles from "./EditQuestionPage.module.css";
import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import AuthContext from "../../contexts/AuthContext";
import ModalContext from "../../contexts/ModalContext";
import { apiUrl } from "../../config/Constants";
import axios from "axios";

function EditQuestionPage(){
    

    const {questionId} = useParams();

    const [questionTitle, setQuestionTitle] = useState(null);
    const [questionText, setQuestionText] = useState(null);

    const authValues = useContext(AuthContext);
    const modalValues = useContext(ModalContext);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(apiUrl + "/community/Q&A/get-question?questionId=" + questionId).then(response => {
            setQuestionText(response.data.text);
            setQuestionTitle(response.data.title);
        })
    }, [])

    function handleSubmit(event) {
        event.preventDefault();
        if(!questionTitle) return modalValues.showError("You must enter a question title.");
        if(!questionText) return modalValues.showError("You must enter a question description.");
        if(questionTitle.trim() == "") return modalValues.showError("You must enter a question title.");
        if(questionText.trim() == "") return modalValues.showError("You must enter a question description.");

        axios.post(apiUrl + "/community/Q&A/update-question",
            {newTitle: questionTitle, newText: questionText, postId: questionId}, 
            {
                headers: {
                    Authorization: "Bearer " + authValues.token
                }
            }
        ).then(response => {
            navigate("/qa");
        }).catch(err => {
            modalValues.showError("Error: unable to update question");
        })
    }

    return(
        <div className={styles["form-container"]}>
            <h1>Edit Question</h1>
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

export default EditQuestionPage;