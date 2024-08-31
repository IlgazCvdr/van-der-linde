import { useNavigate } from "react-router-dom";
import styles from "./ForumList.module.css";

function ForumList({ forums }) {
    const navigate = useNavigate();

    return (
        <div className={styles["forum-list"]}>
            {forums ? (
                forums.length > 0 ? (
                    forums.map(forum => (
                        <div key={forum.forumId} onClick={() => navigate(`/forums/${forum.forumPostId}`)} className={styles["forum-card"]}>
                            <div className={styles["forum-title"]}>{forum.title}</div>
                            <div className={styles["forum-author"]}>{forum.author.firstName} {forum.author.lastName}</div>
                        </div>
                    ))
                ) : (
                    <h2>No forums found.</h2>
                )
            ) : (
                <h2>Loading...</h2>
            )}
        </div>
    );
}

export default ForumList;
