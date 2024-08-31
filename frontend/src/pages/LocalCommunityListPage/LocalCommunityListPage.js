import { Button } from "react-bootstrap";
import styles from "./LocalCommunityListPage.module.css";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../config/Constants";
import AuthContext from "../../contexts/AuthContext";
import ModalContext from "../../contexts/ModalContext";
import defaultImage from "../../assets/community.jpg";

function LocalCommunityListPage() {

    const navigate = useNavigate();
    const [localCommunities, setLocalCommunities] = useState(null);

    const userValues = useContext(AuthContext);
    const modalValues = useContext(ModalContext);

    useEffect(() => {
        axios.get(apiUrl + "/community/LocalCommunities/get-local-communities").then(response => {
            setLocalCommunities(response.data);
        }).catch(err => {
            console.log(err);
        })
    }, [])

    return (
        <div className="d-flex flex-column align-items-center">
            <h1>Local Communities</h1>
            <div className="d-grid gap-2 w-100">
                <Button size="lg" onClick={() => { navigate("/create-local-community") }}>Create Local Community</Button>
            </div>
            <div className={styles["local-community-list"] + " mt-3"}>
                {(() => {
                    if (!localCommunities) return (<h2>No Community Found</h2>)
                    return localCommunities.map(l => {
                        return (
                            <div onClick={() => { navigate("/local-community/" + l.localCommunityId) }} className={styles["local-community-card"]}>
                                
                                    {(() => {
                                        if (!l.icon) return <img className={styles["community-image"]} src={defaultImage}></img>
                                        return <img className={styles["community-image"]} src={`data:image/jpeg;base64,${l.icon}`}></img>
                                    })()}
                                
                                <div>{l.name}</div>
                            </div>
                        )
                    })
                })()}
            </div>
        </div>
    )
}

export default LocalCommunityListPage;