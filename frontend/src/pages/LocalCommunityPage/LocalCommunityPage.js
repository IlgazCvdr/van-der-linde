import { useNavigate, useParams } from "react-router-dom";
import styles from "./LocalCommunityPage.module.css";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../contexts/AuthContext";
import axios from "axios";
import { apiUrl } from "../../config/Constants";
import defaultImage from "../../assets/community.jpg";
import { Button, Dropdown } from "react-bootstrap";
import ModalContext from "../../contexts/ModalContext";

function LocalCommunityPage() {

    const { communityId } = useParams();
    const authValues = useContext(AuthContext);
    const modalValues = useContext(ModalContext);
    const navigate = useNavigate();

    const [community, setCommunity] = useState(null);
    const [communityImage, setCommunityImage] = useState(null);

    useEffect(() => {
        axios.get(apiUrl + "/community/LocalCommunities/get-local-community?communityId=" + communityId).then(response => {
            setCommunity(response.data);
        }).catch(err => {
            setCommunity(null);
            console.log(err);
        })

        axios.get(apiUrl + "/community/LocalCommunities/get-image?communityId=" + communityId, { responseType: "blob" }).then(response => {
            const url = URL.createObjectURL(response.data);
            setCommunityImage(url);
        }).catch(err => {
            setCommunityImage(null);
            console.log(err);
        })
    }, [communityId])

    function handlePostDelete(id) {
        axios.post(apiUrl + "/community/LocalCommunities/delete-local-community-post", {
            deleteId: id
        }, {
            headers: {
                Authorization: "Bearer " + authValues.token
            }
        }).then(response => {
            window.location.reload();
        }).catch(err => {
            modalValues.showError("Unable to delete the post");
        })
    }

    function deleteCommunityHandler(){
        axios.post(apiUrl + "/community/LocalCommunities/delete-local-community", {
            deleteId: communityId   
        }, {
            headers: {
                Authorization: "Bearer " + authValues.token
            }
        }).then(response => {
            modalValues.showSuccess("Community has been deleted.");
            navigate("/local-communities"); 
        }).catch(err => {
            modalValues.showError("Unable to delete community.");
        })
    }

    return (
        <div className="d-flex flex-column align-items-center">
            <div className={styles["community-image-container"]}>
                {(() => {
                    if (!communityImage) return (<img className={styles["community-image"]} src={defaultImage}></img>)
                    return (<img className={styles["community-image"]} src={communityImage}></img>)
                })()}
            </div>
            {(() => {
                if (!community) return;
                return (
                    <div className={styles["community-container"]}>
                        <div className="text-center mt-1 fs-3">
                            {community.name}
                        </div>
                        <Button onClick={() => { navigate("/create-local-community-post/" + communityId) }} size="lg" className="w-100 mt-5">Create Post</Button>
                        {(() => {
                            if(!authValues.user) return;
                            if (authValues.user.roleNames.includes("admin")) {
                                return (
                                    <div>
                                        <Button onClick={() => { navigate("/edit-local-community/" + communityId) }} size="lg" className="w-100 mt-1">Edit Community</Button>
                                        <Button variant="danger" onClick={deleteCommunityHandler} size="lg" className="w-100 mt-1">Delete Community</Button>
                                    </div>
                                )
                            }
                        })()}
                        <div className="mt-3">
                            {(() => {
                                if (!community.communityPosts) return;
                                if (community.communityPosts.length == 0) return;
                                community.communityPosts = community.communityPosts.reverse();
                                return community.communityPosts.map(p => {
                                    return (
                                        <div className={styles["post-card"]}>
                                            <div className="d-flex fs-5 justify-content-between">
                                                <div className={styles["author"]} onClick={() => { navigate("/user/" + p.author.id) }}>{p.author.firstName + " " + p.author.lastName}</div>
                                                {(() => {
                                                    if (!authValues.user) return;
                                                    if (authValues.user.id == p.author.id || authValues.user.roleNames.includes("admin")) {
                                                        return (
                                                            <Dropdown>
                                                                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu>
                                                                    <Dropdown.Item onClick={() => { navigate("/edit-local-community-post/" + p.communityPostId) }}>Edit</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => { handlePostDelete(p.communityPostId) }}>Delete</Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        )
                                                    }
                                                })()}
                                            </div>
                                            <div>{p.text}</div>
                                            {(() => {
                                                if (!p.image) return;
                                                return (
                                                    <div className="d-flex justify-content-center">
                                                        <img className={styles["post-image"]} src={`data:image/jpeg;base64,${p.image}`}></img>
                                                    </div>
                                                )
                                            })()}
                                        </div>
                                    )
                                })
                            })()}
                        </div>
                    </div>
                )
            })()}
        </div>
    )
}

export default LocalCommunityPage;