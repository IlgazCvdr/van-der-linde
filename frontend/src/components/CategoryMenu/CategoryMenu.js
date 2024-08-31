import styles from "./CategoryMenu.module.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiUrl } from "../../config/Constants";
import axios from "axios";


function CategoryMenu() {

    const [categories, setCategories] = useState(null);

    useEffect(() => {
        axios.get(apiUrl + "/product/get-all-categories").then(response => {
            setCategories(response.data);
        }).catch(err => {
          console.log(err);
        })
    }, []);

    return (
        <div className={styles["category-container"]}>
            {(() => {
                if (!categories) return;
                return categories.map(category => {
                    return (
                        <span className={styles["category"]} key={category.id}>
                            <Link to={`/category/${category.name}`} className="text-decoration-none text-dark">
                                {category.name}
                            </Link>
                        </span>)
                })
            })()}
        </div>
    )
}

export default CategoryMenu;