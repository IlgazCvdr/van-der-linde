import { useNavigate, useParams } from "react-router-dom";
import styles from "./ForumPage.module.css";
import axios from "axios";
import { apiUrl } from "../../config/Constants";
import { useContext, useEffect, useState } from "react";
import { Button, Form, Dropdown } from "react-bootstrap";
import AuthContext from "../../contexts/AuthContext";
import ModalContext from "../../contexts/ModalContext";

function ForumPage() {
    const { postId: ForumPostId } = useParams();

    const [post, setPost] = useState(null);
    const [replyText, setReplyText] = useState("");

    const navigate = useNavigate();

    const authValues = useContext(AuthContext);
    const modalValues = useContext(ModalContext);

    useEffect(() => {
        axios.get(apiUrl + "/community/forum/get-forum-post?postId=" + ForumPostId)
            .then(response => {
                setPost(response.data);
            })
            .catch(error => {
                console.error("Error fetching forum post:", error);
            });
    }, [ForumPostId]);

    function submitReply() {
        if (!replyText) {
            return modalValues.showError("You need to enter a reply.");
        }

        axios.post(apiUrl + "/community/forum/create-reply-post", {
            title:"dummy",
            text: replyText,
            replyTo: ForumPostId
            
        }, {
            headers: {
                Authorization: "Bearer " + authValues.token
            }
        })
        .then(response => {
            window.location.reload();
        })
        .catch(err => {
            modalValues.showError("Error: unable to submit reply");
        });
    }

    function handlePostDelete() {
        axios.delete(apiUrl + "/community/forum/delete-post", {
            data: { deleteId: ForumPostId },
            headers: {
                Authorization: "Bearer " + authValues.token
            }
        })
        .then(response => {
            navigate("/forums");
        })
        .catch(err => {
            modalValues.showError("Unable to delete the post.");
        });
    }

    function handleReplyDelete(replyId) {
        axios.delete(apiUrl + "/community/forum/delete-reply-post", {
            data: { deleteId: replyId },
            headers: {
                Authorization: "Bearer " + authValues.token
            }
        })
        .then(response => {
            window.location.reload();
        })
        .catch(err => {
            modalValues.showError("Unable to delete the reply.");
        });
    }

    return (
        <div>
            {post && (
                <div>
                    <div className={styles["post"]}>
                        <div className="d-flex flex-row">
                            <div className={styles["post-title"]}>{post.title}</div>
                            {authValues.user && (authValues.user.id === post.author.id || authValues.user.roleNames.includes("admin")) && (
                                <div className={styles["post-button-container"]}>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => { navigate("/forums/edit-post/" + ForumPostId) }}>Edit</Dropdown.Item>
                                            <Dropdown.Item onClick={handlePostDelete}>Delete</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            )}
                        </div>
                        <div className={styles["post-text"]}>{post.text}</div>
                        <div className={styles["post-author"]}>
                            <div className={styles["author-text"]} onClick={() => { navigate("/user/" + post.author.id) }}>
                                {post.author.firstName + " " + post.author.lastName}
                            </div>
                        </div>
                    </div>
                    <div className="mt-3">
                        {post.forumReplies.map(reply => (
                            <div className={styles["reply"]} key={reply.forumReplyPostId}>
                                <div className="d-flex flex-row justify-content-between">
                                    <div className={styles["reply-text"]}>{reply.text}</div>
                                    {authValues.user && (authValues.user.id === reply.author.id || authValues.user.roleNames.includes("admin")) && (
                                        <div className={styles["reply-button-container"]}>
                                            <Dropdown>
                                                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() => { navigate("/forums/edit-reply/" + reply.forumReplyPostId) }}>Edit</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => {handleReplyDelete(reply.forumReplyPostId)}}>Delete</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                    )}
                                </div>
                                <div className={styles["reply-author"]}>
                                    <div className={styles["author-text"]} onClick={() => { navigate("/user/" + reply.author.id) }}>
                                        {reply.author.firstName + " " + reply.author.lastName}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div>
                        {authValues.user && (
                            <div>
                                <Form.Control id="reply-text-area" as="textarea" rows={3} placeholder="Enter your reply" className={styles["reply-text-input"]} value={replyText} onChange={(e) => setReplyText(e.target.value)} />
                                <div onClick={submitReply} className="d-flex flex-row justify-content-end">
                                    <Button className="mt-1">Submit</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ForumPage;
