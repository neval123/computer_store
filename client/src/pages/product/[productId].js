import Head from 'next/head'
import Image from 'next/image'
import {Inter} from 'next/font/google'
import styles from '@/styles/productId.module.css'
import {useEffect, useState} from "react";
import {fetchProduct, checkIfProductAdded, fetchCollectedCustomerOrder} from "@/API/getRequests";
import {createCustomerOrder, createCustomerOrderItem} from "@/API/postRequests";
import {updateCustomerOrderTotalPrice} from "@/API/putRequests";
import {useRouter} from "next/router";
import {useAuth} from "@/functions/authContext";
import {sendNotification} from "@/functions/other";
function ProductIdPage() {
    const router = useRouter();
    const {setNotAdmin, logout} = useAuth();

    const [editing, setEditing] = useState(false);
    const {productId} = router.query;
    const [productName, setProductName] = useState(null);
    const [productPrice, setProductPrice] = useState(null);
    const [productImage, setProductImage] = useState(null);

    const [productDescription, setProductDescription] = useState(null);
    const [orderTotalPrice, setOrderTotalPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const backendUrl = "http://localhost:8080";

    let orderToCollectId = 0;
    let productAlreadyAdded = false;
    useEffect(() => {
        if (productId) {
            if (localStorage.getItem("token")) {
                getProduct();
            } else {
                router.push("/login");
            }

        }
    }, [productId]);


    const getProduct = async () => {
        const result = await fetchProduct(productId);
        setProductName(result['name']);
        setProductDescription(result['description']);
        setProductPrice(result['price']);
        setProductImage(result['image']);
    }
    const addToCart = async () => {
        if (localStorage.getItem('token')) {
            let totalPrice = 0;
            const product = [{'id': productId, 'price': productPrice}];
            const orderToCollectResult = await fetchCollectedCustomerOrder(localStorage.getItem('token'));
            if (orderToCollectResult == undefined) {
                orderToCollectId = await createCustomerOrder(product, localStorage.getItem('token'));
            } else {
                orderToCollectId = orderToCollectResult['orderId'];
                totalPrice = orderToCollectResult['totalPrice'];
                const checkResult = await checkIfProductAdded(product, orderToCollectId, localStorage.getItem('token'))
                if (checkResult) {
                    productAlreadyAdded = true;
                } else {
                    productAlreadyAdded = false;
                }
            }
            if (!productAlreadyAdded) {
                const result = await createCustomerOrderItem(product, orderToCollectId, localStorage.getItem('token'), quantity);
                await updateCustomerOrderTotalPrice(orderToCollectId, totalPrice + parseFloat((quantity * productPrice).toFixed(2)), localStorage.getItem('token'));
                await sendNotification("Dodano produkt do koszyka!");
            } else {
                await sendNotification("Produkt znajduje się już w koszyku!");
            }
        } else {
            router.push("/login").then(async () => {
                await sendNotification("Zaloguj się, aby dodać produkt do koszyka!");
            });
        }
    }
    return (
        <>
            <Head>
                <title>Produkt</title>
                <meta name="description" content="Aplikacja sklepu komputerowego"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <div className={styles.buttons}>
                <button onClick={() => router.back()}>Powrót do katalogu</button>
            </div>
            <div className={styles.body}>

                <div className={styles.productContainer}>
                    <div className={styles.imageContainer}>
                        {productImage ? (
                            <Image src={`${backendUrl}${productImage}`} alt={productName} width={300} height={300}/>
                        ) : (
                            <p>Ładowanie obrazu...</p>
                        )}                    </div>
                    <div className={styles.infoContainer}>
                        <h2>{productName}</h2>
                        <div className={styles.priceAmountContainer}>
                            <input
                                type="number"
                                min="1"
                                max="99"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                            <p>{productPrice} zł</p>
                        </div>


                        <button className={styles.basicButton} onClick={addToCart}>Dodaj do koszyka</button>
                    </div>

                </div>
                <div className={styles.productDescription}>
                    <p>{productDescription}</p>

                </div>

            </div>

        </>
    )
}

export default ProductIdPage;