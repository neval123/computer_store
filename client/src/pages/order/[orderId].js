import Head from 'next/head'
import Image from 'next/image'
import {Inter} from 'next/font/google'
import styles from '@/styles/orderId.module.css'
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {checkTokenExpiration} from "@/functions/authMethods";
import {useAuth} from "@/functions/authContext";
import {sendNotification} from "@/functions/other";
import {fetchCustomerOrderItemsByOrder, fetchOrderById} from "@/API/getRequests";
import CustomizedPagination from "@/components/CustomizedPagination";
import {updateCustomerOrderTotalPrice} from "@/API/putRequests";
function OrderIdPage() {
    const router = useRouter();
    const { setNotAdmin, logout } = useAuth();

    const { orderId } = router.query;
    const [orderData,setOrderData] = useState([]);
    const [products,setProducts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    const [totalPages, setTotalPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    useEffect(() => {
        checkTokenExpiration(router,setNotAdmin,logout);
        getOrderInfo(pageNumber);
    }, []);
    async function getOrderInfo() {
        if (localStorage.getItem("token")) {
            const token = localStorage.getItem("token");
            try {
                const result = await fetchOrderById(orderId);
                setOrderData(result);
                await getOrderItems(pageNumber);
                setTotalPrice(result['totalPrice']);
            } catch (error) {
                console.error("Błąd: ", error);
            }

        } else {
            router.push("/login").then(async () => {
                await sendNotification("Zaloguj się!");
            });
        }
    }
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
    const changePage = async (page) => {
        await getOrderItems(page - 1);
        setPageNumber(page - 1);
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
                    </tr>
                    </thead>
                    <tbody>
                    {products.map((row, index) => (
                        <tr key={index}>
                            <td><Image src={`${backendUrl}${row.image}`} alt={''} height={100} width={100}/></td>
                            <td>{row.name} </td>
                            <td>{row.quantity}</td>
                            <td>{row.price * row.quantity} zł</td>
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