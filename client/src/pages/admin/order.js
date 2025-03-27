import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/category.module.css'
import {useRouter} from "next/router";
import {checkTokenExpiration} from "@/functions/authMethods";
import {useEffect, useState} from "react";
import {fetchUserData, fetchAllCustomerOrders} from "@/API/getRequests";
import {updateCustomerOrderFinalization} from "@/API/putRequests";
import CustomizedPagination from "@/components/CustomizedPagination";
import {useAuth} from "@/functions/authContext";
import Image from "next/image";
import {deleteCustomerOrderWithItems} from "@/API/deleteRequests";
import {sendNotification} from "@/functions/other";
function OrderPage() {
    const router = useRouter();

    const [orders, setOrders] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const { isAdmin,setNotAdmin, logout } = useAuth();

    useEffect(() => {
        checkTokenExpiration(router,setNotAdmin,logout);
        checkAdminStatus();
    }, []);
    const checkAdminStatus = async () => {
        const adminCheck = await getUserInfo();
        if (isAdmin || adminCheck) {
            getOrders(pageNumber);
        } else {
            router.back();
        }
    };
    const getUserInfo = async ()=>{
        const result = await fetchUserData(localStorage.getItem("token"));
        if(result['role']=="ADMIN"){
            return true;
        }else{
            return false;
        }
    }
    const getOrders = async (page) => {
        const result = await fetchAllCustomerOrders(page, 6);
        const content = result['content'];
        setTotalPages(result['totalPages']);
        const newOrders = content.map(order => {
            let formattedPaymentDate = new Date(order['paymentDate']).toLocaleString();
            let formattedAcceptDate = order['acceptDate'] ? new Date(order['acceptDate']).toLocaleString() : '-';
            return {
                id: order['orderId'],
                price: order['totalPrice'] + " zł",
                paidDate: formattedPaymentDate,
                acceptDate: formattedAcceptDate,
                status: order['status'],
            };
        });
        setOrders(newOrders);
    }
    const orderDetails = (orderId) =>{
        router.push(`/admin/order/${orderId}`);
    }
    const acceptOrder = async (orderId) =>{
        await updateCustomerOrderFinalization(orderId, "SENT");
        await getOrders(pageNumber);
    }
    const cancelOrder = async (orderId) =>{
        await updateCustomerOrderFinalization(orderId, "REJECTED");
        await getOrders(pageNumber);

    }
    const removeOrder = async (orderId) => {
        const result = await deleteCustomerOrderWithItems(orderId);
        if (result == "error") {
            await sendNotification("Naruszono więzy integralności!");
        } else {
            await sendNotification("Usunięto zamówienie!");
        }
        if (orders.length === 1 && pageNumber > 0) {
            setPageNumber(pageNumber - 1);
            await getOrders(pageNumber - 1);
        } else {
            await getOrders(pageNumber);
        }

    }
    const changePage = async (page) => {
        const newPage = page - 1;
        setPageNumber(newPage);
        await getOrders(newPage);
    }
    return (
        <>
            <Head>
                <title>Panel administratora</title>
                <meta name="description" content="Aplikacja sklepu komputerowego"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <div className={styles.buttons}>
                <button onClick={() => router.push("/admin")}>Powróć</button>
            </div>
            <div className={styles.body}>
                <table>
                    <thead>
                    <tr>
                        <th>Id zamówienia</th>
                        <th>Cena</th>
                        <th>Data zapłaty za zamówienie</th>
                        <th>Data potwierdzenia zamówienia</th>
                        <th>Status</th>
                        <th>Akceptuj/Odrzuć</th>
                        <th>Informacje</th>
                        <th>Usuń</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((row, index) => (
                        <tr key={index}>
                            <td>{row.id}</td>
                            <td>{row.price}</td>
                            <td>{row.paidDate}</td>
                            <td>{row.acceptDate}</td>
                            <td>{row.status}</td>
                            <td>
                                {row.status !== "SENT" && row.status !== "REJECTED" && row.status !== "COLLECTED" && (
                                    <>
                                        <button className={styles.acceptButton}
                                                onClick={() => acceptOrder(row.id)}>Akceptuj
                                        </button>
                                        <button className={styles.cancelButton}
                                                onClick={() => cancelOrder(row.id)}>Odrzuć
                                        </button>
                                    </>
                                )}
                            </td>
                            <td>
                                <button onClick={() => orderDetails(row.id)}>Szczegóły</button>
                            </td>
                            <button onClick={() => removeOrder(row.id)}
                                    className={styles.cancelButton}><Image src={"/trash.png"} alt={''}
                                                                           height={25} width={25}/>
                            </button>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className={styles.paginationContainer}>
                <CustomizedPagination totalPages={totalPages} onPageChange={changePage}/>
            </div>
        </>
    )
}

export default OrderPage;