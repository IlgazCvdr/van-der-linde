import { useContext, useEffect, useState } from "react";
import styles from "./UserPage.module.css";
import AuthContext from "../../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import defaultProfileImage from "../../assets/profile.png"
import axios from "axios";
import { apiUrl } from "../../config/Constants";
import { Button } from "react-bootstrap";
import ModalContext from "../../contexts/ModalContext";
import ProductList from "../../components/ProductList/ProductList";

function UserPage(props) {

    let authValues = useContext(AuthContext);
    const modalValues = useContext(ModalContext);

    let { userId } = useParams();

    let navigate = useNavigate();

    const [user, setUser] = useState();
    const [userImage, setUserImage] = useState(null);
    const [products, setProducts] = useState(null);

    useEffect(() => {
        axios.get(apiUrl + "/user/get?userId=" + userId).then(response => {
            ;
            setUser(response.data);
            console.log(response.data)
            if (response.data.roleNames.includes("merchant")) {
                axios.get(apiUrl + "/product/get-merchant-products?merchantId=" + userId).then(response => {
                    setProducts(response.data);
                }).catch(err => {
                    console.log(err);
                })
            }
        }).catch((err) => {
            console.log(err)
        })

        axios.get(apiUrl + "/user/get-image?userId=" + userId, { responseType: "blob" }).then(response => {
            const url = URL.createObjectURL(response.data);
            setUserImage(url);
        }).catch(err => {
            console.log(err);
        })

    }, [userId])

    function createProductClick() {
        navigate("/create-product");
    }

    return (
        <div className={styles["user-container"]}>
            <div className={styles["profile-image-container"]}>
                {(() => {
                    if (!userImage) return (<img className={styles["profile-image"]} src={defaultProfileImage}></img>)
                    return (<img className={styles["profile-image"]} src={userImage}></img>)
                })()}

            </div>
            {(() => {
                if (user) {
                    return (
                        <div className={styles["user-info-container"]}>
                            <div className={styles["info"]}>
                                {(() => {
                                    if (user.roleNames.includes("merchant")) return (
                                        <div>
                                            {(() => {
                                                console.log(user.roleNames)
                                                if (user.roleNames.includes("admin")) {
                                                    return (
                                                        <div className="d-flex justify-content-center">
                                                            <div className="bg-danger text-white px-2 rounded">Admin</div>
                                                        </div>)
                                                } else {
                                                    return (
                                                        <div className="d-flex justify-content-center">
                                                            <div className="bg-warning px-2 rounded">Merchant</div>
                                                        </div>)
                                                }
                                            })()}
                                        </div>
                                    )
                                })()}
                                {(() => {
                                    if (!authValues.user) return;
                                    if (authValues.user.id == userId && user.roleNames.includes("merchant")) {
                                        return (
                                            <Button onClick={createProductClick} variant="primary" className="w-100 mt-2" size="lg">
                                                Create Product
                                            </Button>
                                        )
                                    }
                                })()}
                                {(() => {
                                    if (!authValues.user) return;
                                    if (authValues.user.id == userId || authValues.user.roleNames.includes("admin")) {
                                        return (
                                            <Button onClick={() => { navigate("/manage-account/" + userId) }} variant="primary" className="w-100 mt-2" size="lg">
                                                Manage Account
                                            </Button>
                                        )
                                    }
                                })()}

                                <div className={styles["label"]}>
                                    Name
                                </div>
                                <div className={styles["username"]}>
                                    {user.firstName + " " + user.lastName}
                                </div>
                            </div>
                            <div className={styles["info"]}>
                                <div className={styles["label"]}>
                                    Email Address
                                </div>
                                <div className={styles["email"]}>
                                    {user.email}
                                </div>
                            </div>
                        </div>
                    )
                }
            })()}
            {(() => {
                if (!user) return;
                if (!products) return;
                if (user.roleNames.includes("merchant")) {
                    return (
                        <div className="mt-5 d-flex flex-column align-items-center">
                            <h2>Products</h2>
                            <ProductList products={products}></ProductList>
                        </div>
                    )
                }
            })()}
        </div>
    )
}

export default UserPage;