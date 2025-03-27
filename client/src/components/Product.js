import styles from '@/styles/product.module.css';
import Image from "next/image";
import {useState} from "react";
import {useRouter} from "next/router";
import Link from "next/link";
import {sendNotification} from "@/functions/other";
import {createCustomerOrder, createCustomerOrderItem} from "@/API/postRequests";
import {fetchCollectedCustomerOrder, checkIfProductAdded} from "@/API/getRequests";
import {updateCustomerOrderTotalPrice} from "@/API/putRequests";

const Product = (props) => {
    const { productId, name, description ,price, image } = props['props'];
    const [quantity, setQuantity] = useState(1);
    let orderToCollectId = 0;
    let productAlreadyAdded = false;
    const router = useRouter();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

    const addToCart = async () => {
        if(localStorage.getItem('token')){
            const token = localStorage.getItem('token');
            let totalPrice = 0;
            const product = [{ 'id': productId, 'price': price }];
            const orderToCollectResult = await fetchCollectedCustomerOrder(token);
            if(orderToCollectResult==undefined){
                orderToCollectId = await createCustomerOrder(product, token);
            }else
            {
                orderToCollectId = orderToCollectResult['orderId'];
                totalPrice = orderToCollectResult['totalPrice'];
                const checkResult = await checkIfProductAdded(product,orderToCollectId,token)
                if(checkResult){
                    productAlreadyAdded = true;
                }else{
                    productAlreadyAdded = false;
                }
            }
            if(!productAlreadyAdded){
                const result = await createCustomerOrderItem(product, orderToCollectId, token,quantity);
                await updateCustomerOrderTotalPrice(orderToCollectId, totalPrice + parseFloat((quantity*price).toFixed(2)), token);
                await sendNotification("Dodano produkt do koszyka!");

            }else{
                await sendNotification("Produkt znajduje się już w koszyku!");
            }
        }else {
            router.push("/login").then(async () => {
                await sendNotification("Zaloguj się, aby dodać produkt do koszyka!");
            });
        }
    }
    return (
        <div className={styles.outerContainer}>
            <Image src={`${backendUrl}${image}`} alt={""} width={120} height={120}/>
            <div className={styles.textContainer}>
                <div className={styles.headerContainer}>
                    <Link href={`/product/${productId}`}>{name}</Link>
                    <h3>{price} zł</h3>
                </div>
                <div className={styles.buttonContainer}>
                    <input
                        type="number"
                        min="1"
                        max="99"
                        value={quantity}
                        onChange={(e) => e.target.value>0 && e.target.value<100 ? setQuantity(e.target.value):e.target.value=1}
                    />

                    <button onClick={addToCart}>
                        <Image src={"/cart.png"} alt={""} width={25} height={25}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Product;