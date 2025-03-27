import Head from 'next/head'
import Image from 'next/image'
import {Inter} from 'next/font/google'
import styles from '@/styles/orderId.module.css'
import {useEffect, useState} from "react";

import {
    fetchUserData,
    fetchOrderById,
    fetchCustomerOrderItemsByOrder
} from "@/API/getRequests";
import {deleteCustomerOrder, deleteCustomerOrderItem} from "@/API/deleteRequests";
import {updateCustomerOrderTotalPrice, updateCustomerOrderItemQuantityAndPrice,cancelCustomerOrder,adminUpdateCustomerOrderTotalPrice} from "@/API/putRequests";
import {useRouter} from "next/router";
import {checkTokenExpiration} from "@/functions/authMethods";
import {useAuth} from "@/functions/authContext";
import {sendNotification} from "@/functions/other";
import CustomizedPagination from "@/components/CustomizedPagination";


function OrderIdPage() {
    const router = useRouter();
    const {isAdmin, setNotAdmin, logout} = useAuth();

    const {orderId} = router.query;
    const [orderData, setOrderData] = useState([]);
    const [products, setProducts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [orderAlreadySent, setOrderAlreadySent] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
//    const token = localStorage.getItem("token");
    useEffect(() => {
        checkTokenExpiration(router, setNotAdmin, logout);
        checkAdminStatus();
        getOrderInfo();
    }, [orderId]);
    const checkAdminStatus = async () => {
        const adminCheck = await getUserInfo();
        if (isAdmin || adminCheck) {
            if (orderId) {
                getOrderInfo();
            }

        } else {
            router.back();
        }
    };
    async function getOrderItems(pageNumber){
        if(pageNumber>=0){
            const result = await fetchCustomerOrderItemsByOrder(orderId, pageNumber, 5);
            setTotalPages(result['totalPages']);
            const newProducts = result['content'].map(item => ({
                image: item['product']['image'],
                name: item['product']['name'],
                price: item['product']['price'],
                itemId: item['itemId'],
                quantity: item['quantity']
            }));

            setProducts(newProducts);
        }
    }
    const getUserInfo = async () => {
        const result = await fetchUserData(localStorage.getItem("token"));
        if (result['role'] == "ADMIN") {
            return true;
        } else {
            return false;
        }
    }

    async function getOrderInfo() {
        if (localStorage.getItem("token")) {
            const token = localStorage.getItem("token");
            try {
                const result = await fetchOrderById(orderId);
                setOrderData(result);
                await getOrderItems(pageNumber);


                setTotalPrice(result['totalPrice']);

                if (result['status'] == "SENT" || result['status'] == "REJECTED"|| result['status'] == "CANCELED") {
                    setOrderAlreadySent(true);
                }

            } catch (error) {
                console.error("Błąd: ", error);
            }

        } else {
            router.push("/login").then(async () => {
                await sendNotification("Zaloguj się!");
            });
        }
    }
    const changePage = async (page) => {
        await updateCustomerOrderTotalPrice(orderData['orderId'], totalPrice, localStorage.getItem("token"));
        await getOrderItems(page - 1);
        setPageNumber(page - 1);
    };
    const removeProductFromCart = async (itemId) => {
        const result = await deleteCustomerOrderItem(itemId);

        const updatedProducts = products.filter(product => product.itemId !== itemId);
        const deletedProduct = products.find(product => product.itemId === itemId);

        setProducts(updatedProducts);
        setTotalPrice(parseFloat((totalPrice - deletedProduct['price'] * deletedProduct['quantity']).toFixed(2)));

        await updateCustomerOrderTotalPrice(orderData['orderId'], totalPrice, localStorage.getItem("token"));


        if (updatedProducts.length === 0) {
            if (pageNumber > 0) {
                const page = pageNumber - 1;
                setPageNumber(page);
                await getOrderItems(pageNumber > 0 ? pageNumber - 1 : 0);
            } else {
                setProducts([]);
                await deleteCustomerOrder(orderData['orderId']);
            }

        }
    }
    const changeAmount = async (itemId, newQuantity) => {
        if(newQuantity >0 && newQuantity < 100){
            const productToUpdate = products.find(item => item.itemId === itemId);
            const productPrice = productToUpdate ? productToUpdate.price : null;
            const oldQuantity = productToUpdate ? productToUpdate.quantity : null;

            if (productPrice != null && oldQuantity != null) {
                await updateCustomerOrderItemQuantityAndPrice(itemId, newQuantity, productPrice * newQuantity, localStorage.getItem("token"));
                setProducts(products.map(product =>
                    product.itemId === itemId ? {...product, quantity: newQuantity} : product
                ));
                const price = parseFloat((totalPrice - productPrice * oldQuantity + productPrice * newQuantity).toFixed(2))
                setTotalPrice(price);
                await adminUpdateCustomerOrderTotalPrice(orderData['orderId'], price, localStorage.getItem("token"));
            }
        }

    };

    return (
        <>
            <Head>
                <title>Zamówienie</title>
                <meta name="description" content="Aplikacja sklepu komputerowego"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <div className={styles.buttons}>
                <button onClick={() => router.back()}>Powrót</button>
            </div>
            <div className={styles.body}>
                <table>
                    <thead>
                    <tr>
                        <th>Zdjęcie</th>
                        <th>Produkt</th>
                        <th>Ilość</th>
                        <th>Cena</th>
                        <th>Usuń</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map((row, index) => (
                        <tr key={index}>
                            <td><Image src={`${backendUrl}${row.image}`} alt={''} height={100} width={100}/></td>
                            <td>{row.name} </td>
                            <td>
                                <input
                                    disabled={orderAlreadySent}
                                    type="number"
                                    min="1"
                                    max="99"
                                    value={row.quantity}
                                    onChange={(e) => changeAmount(row.itemId, e.target.value)}
                                /></td>
                            <td>{(row.price * row.quantity).toFixed(2)} zł</td>
                            <td>
                                <button disabled={orderAlreadySent}
                                        onClick={() => removeProductFromCart(row.itemId, localStorage.getItem("token"))}
                                        className={styles.fullButton}><Image src={"/trash.png"} alt={''} height={25}
                                                                             width={25}/></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className={styles.paginationContainer}>
                    <CustomizedPagination totalPages={totalPages} onPageChange={changePage}/>
                </div>
                <div>
                    <h4>Łączna kwota: {totalPrice} zł</h4>
                </div>
            </div>
        </>
    )
}

export default OrderIdPage;