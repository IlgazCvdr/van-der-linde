import { useNavigate, useParams } from "react-router-dom";
import styles from "./QuestionPage.module.css";
import axios from "axios";
import { apiUrl } from "../../config/Constants";
import { useContext, useEffect, useState } from "react";
import { Button, Form, Dropdown } from "react-bootstrap";
import AuthContext from "../../contexts/AuthContext";
import ModalContext from "../../contexts/ModalContext";

function QuestionPage() {
    const { questionId } = useParams();

    const [question, setQuestion] = useState(null);
    const [inputText, setInputText] = useState("");

    const navigate = useNavigate();

    const authValues = useContext(AuthContext);
    const modalValues = useContext(ModalContext);

    useEffect(() => {
        axios.get(apiUrl + "/community/Q&A/get-question?questionId=" + questionId).then(response => {
            setQuestion(response.data);
        })
    }, [questionId]);

    function submitAnswer() {
        if (!inputText) return modalValues.showError("You need to enter an answer.");
        if (inputText.trim === "") return modalValues.showError("You need to enter an answer.");
        axios.post(apiUrl + "/community/Q&A/create-answer", {
            title: "dummy",
            text: inputText,
            answerTo: questionId
        }, {
            headers: {
                Authorization: "Bearer " + authValues.token
            }
        }).then(response => {
            window.location.reload();
        })
    }

    function handleQuestionDelete() {
        axios.post(apiUrl + "/community/Q&A/delete-question", {
            deleteId: question.questionPostId
        }, {
            headers: {
                Authorization: "Bearer " + authValues.token
            }
        }).then(response => {
            navigate("/qa");
        }).catch(err => {
            modalValues.showError("Unable to delete the question.");
        })
    }

    function handleAnswerDelete(answerId){
        axios.post(apiUrl + "/community/Q&A/delete-answer", {
            deleteId: answerId
        }, {
            headers: {
                Authorization: "Bearer " + authValues.token
            }
        }).then(response => {
            window.location.reload();
        }).catch(err => {
            modalValues.showError("Unable to delete the answer.");
        })
    }

    return (
        <div>
            {(() => {
                if (!question) return <h2>Question not found.</h2>
                return (
                    <div>
                        <div className={styles["question"]}>
                            <div className="d-flex flex-row">
                                <div className={styles["question-title"]}>{question.title}</div>
                                {(() => {
                                    if (!authValues.user) return;
                                    if (authValues.user.id == question.author.id || authValues.user.roleNames.includes("admın") || authValues.user.roleNames.includes("admin")) {
                                        return (
                                            <div className={styles["question-button-container"]}>
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item onClick={() => { navigate("/qa/edit-question/" + questionId) }}>Edit</Dropdown.Item>
                                                        <Dropdown.Item onClick={handleQuestionDelete}>Delete</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        )
                                    }
                                })()}
                            </div>
                            <div className={styles["question-text"]}>{question.text}</div>
                            <div className={styles["question-author"]}><div className={styles["author-text"]} onClick={() => { navigate("/user/" + question.author.id) }}>{question.author.firstName + " " + question.author.lastName}</div></div>

                        </div>
                        <div className="mt-3">
                            {(() => {
                                return question.answers.map(a => {
                                    return (
                                        <div className={styles["answer"]}>
                                            <div className="d-flex flex-row">
                                            <div className={styles["answer-text"]}>{a.text}</div>
                                            {(() => {
                                                if (!authValues.user) return;
                                                if (authValues.user.id == a.author.id || authValues.user.roleNames.includes("admın") || authValues.user.roleNames.includes("admin")) {
                                                    return (
                                                        <div className={styles["question-button-container"]}>
                                                            <Dropdown>
                                                                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu>
                                                                    <Dropdown.Item onClick={() => { navigate("/qa/edit-answer/" + a.answerPostId) }}>Edit</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => {handleAnswerDelete(a.answerPostId)}}>Delete</Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </div>
                                                    )
                                                }
                                            })()}
                                            </div>
                                            <div className={styles["answer-author"]}><div className={styles["author-text"]} onClick={() => { navigate("/user/" + a.author.id) }}>{a.author.firstName + " " + a.author.lastName}</div></div>
                                        </div>
                                    )
                                })
                            })()}
                        </div>
                        <div>
                            {(() => {
                                if (!authValues.user) return;
                                return (
                                    <div>
                                        <Form.Control id="review-text-area" as="textarea" rows={3} placeholder="Enter your answer" className={styles["answer-text-input"]} value={inputText} onChange={(e) => setInputText(e.target.value)} />
                                        <div onClick={submitAnswer} className="d-flex flex-row justify-content-end"><Button className="mt-1">Submit</Button></div>
                                    </div>
                                )
                            })()}
                        </div>
                    </div>
                )
            })()}
        </div>
    )
}

export default QuestionPage;