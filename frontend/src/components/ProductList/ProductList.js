import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductList.module.css";

function ProductList(props) {

    return (
        <div className={styles["product-list"]}>
            {(() => {
                if (props.products) {
                    const productCards = props.products.map(product => {
                        return <ProductCard product={product}></ProductCard>
                    })
                    return productCards;
                }
            })()}
        </div>
    )
}

export default ProductList;