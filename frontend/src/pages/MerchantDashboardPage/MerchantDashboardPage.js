import { LineChart } from "@mui/x-charts";
import styles from "./MerchantDashboardPage.module.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../config/Constants";
import AuthContext from "../../contexts/AuthContext";
import { ListGroup } from "react-bootstrap";

function MerchantDashboardPage() {

    const authValues = useContext(AuthContext);

    const [xAxis, setXAxis] = useState([]);
    const [values, setValues] = useState([]);
    const [products, setProducts] = useState(null);
    console.log(authValues);

    useEffect(() => {
        axios.get(apiUrl + "/product/get-last-10-review?merchantId=" + authValues.user.id).then(response => {
            const reviewList = response.data;
            const x = [];
            const y = [];
            reviewList.forEach((r, i) => {
                x.push(i);
                y.push(r.rating);
            })
            setXAxis(x);
            setValues(y);
        }).catch(err => {
            console.log(err);
        })

        axios.get(apiUrl + "/product/get-products-sorted-by-rating?merchantId=" + authValues.user.id).then(response => {
            setProducts(response.data);
        }).catch(err => {
            console.log(err);
        })
    }, [])

    return (
        <div>
            <div>
                <h1>Last Ratings</h1>
                <LineChart
                    xAxis={[{ data: xAxis }]}
                    series={[
                        {
                            data: values,
                        },
                    ]}
                    width={500}
                    height={300}
                />
            </div>

            <div>
                <h1>Best Products</h1>
                <ListGroup>
                    {(() => {
                        if(!products) return;
                        return products.map(p => {
                            return (
                                <ListGroup.Item>{p.name}</ListGroup.Item>
                            )
                        })
                    })()}
                </ListGroup>
            </div>
        </div>
    )
}

export default MerchantDashboardPage;