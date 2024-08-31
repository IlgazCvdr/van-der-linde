import { useContext } from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import styles from "./Layout.module.css";
import AuthContext from "../../contexts/AuthContext";
import ErrorModal from "../ErrorModal/ErrorModal";
import SuccessModal from "../SuccessModal/SuccessModal";
import CategoryMenu from "../CategoryMenu/CategoryMenu";

function Layout(props) {

    return (
        <div>
            <Header></Header>
            <CategoryMenu></CategoryMenu>
            <ErrorModal></ErrorModal>
            <SuccessModal></SuccessModal>
            <div className={styles["content"]}>
                {props.children}
            </div>
            <Footer></Footer>
        </div>
    )
}

export default Layout


