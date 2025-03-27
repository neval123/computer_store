import Head from 'next/head'
import {Inter} from 'next/font/google'
import styles from '@/styles/account.module.css'
import {useEffect, useState} from "react";
import {fetchUserData, fetchCustomerOrderItemsByOrder, fetchUserFinishedCustomerOrders} from "@/API/getRequests"
import {updateUserData} from "@/API/putRequests"
import {useRouter} from "next/router";
import {checkTokenExpiration} from "@/functions/authMethods";
import CustomizedPagination from "@/components/CustomizedPagination";
import {useAuth} from "@/functions/authContext";
import {sendNotification} from "@/functions/other";
function AccountPage() {
    const [infoVisible, setInfoVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [street, setStreet] = useState('');
    const [streetNumber, setStreetNumber] = useState('');
    const [apartmentNumber, setApartmentNumber] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [editing, setEditing] = useState(false);
    const router = useRouter();
    const [data, setData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const { setNotAdmin, logout } = useAuth();

    useEffect(() => {
        if(localStorage.getItem("token")){
            checkTokenExpiration(router,setNotAdmin,logout);
            getAccountInfo();
            getOrders(pageNumber);
        }else{
            router.push("/login");
        }
    }, []);
    async function getAccountInfo() {
        if (localStorage.getItem("token")) {
            const token = localStorage.getItem("token");
            try {
                const result = await fetchUserData(token);
                setEmail(result['email']);
                setName(result['name']);
                setLastName(result['lastName']);
                setCity(result['city']);
                setStreet(result['street']);
                setPhoneNumber(result['phoneNumber'] != 0 ? result['phoneNumber'] : "");
                setStreetNumber(result['streetNumber'] != 0 ? result['streetNumber'] : "");
                setApartmentNumber(result['apartmentNumber'] != 0 ? result['apartmentNumber'] : "");
                setPostalCode(result['postalCode']);
            } catch (error) {
                console.error("Błąd: ", error);
            }
        } else {
            router.push("/login").then(async () => {
                await sendNotification("Zaloguj się!");
            });
        }
    }
    const getOrders = async (page) => {
        const result = await fetchUserFinishedCustomerOrders(page, 10);
        setTotalPages(result['totalPages']);
        let formattedData = [];
        for (const order of result['content']) {
            let productValue = await fetchCustomerOrderItemsByOrder(order['orderId']);
            let formattedProductValue = productValue['content'].length === 0
                ? []
                : productValue['content'].map(item => item['product']['name']).join("; ");
            let formattedPaymentDate = new Date(order['paymentDate']).toLocaleString();
            let formattedAcceptDate = order['acceptDate'] ? new Date(order['acceptDate']).toLocaleString() : '-';
            formattedData.push({
                id: order['orderId'],
                price: order['totalPrice'] + " zł",
                paidDate: formattedPaymentDate,
                acceptDate: formattedAcceptDate,
                status: formatOrderStatus(order['status']),
                products: formattedProductValue
            });
        }
        setData(formattedData);
    }
    const formatOrderStatus = (status) =>{
        switch (status){
            case "PAID":
                return "Zapłacone";
            case "REJECTED":
                return "Odrzucone";
            case "SENT":
                return "Wysłane";
        }
    }
    const saveData = async () => {
        if(editing){
            await updateUserData(name, lastName, street, streetNumber, apartmentNumber, city, postalCode, phoneNumber, localStorage.getItem("token"));
        }
        setEditing(!editing)

    }
    const changePage = async (page) => {
        setPageNumber(page-1);
        await getOrders(page-1);
    }
    return (
        <>
            <Head>
                <title>Konto</title>
                <meta name="description" content="Aplikacja sklepu komputerowego"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <div className={styles.body}>

                <h4>Informacje o koncie</h4>
                <div className={styles.formRow}>
                    <div>
                        <label htmlFor="name">Imię:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={true}
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName">Nazwisko:</label>
                        <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            disabled={true}
                        />
                    </div>
                </div>
                <div className={styles.formRow}>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={true}
                        />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber">Numer telefonu:</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            disabled={!editing}
                        />
                    </div>
                </div>
                <div className={styles.formRow}>
                    <div>
                        <label htmlFor="city">Miasto:</label>
                        <input
                            type="text"
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            disabled={!editing}
                        />
                    </div>
                    <div>
                        <label htmlFor="street">Ulica:</label>
                        <input
                            type="text"
                            id="street"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            disabled={!editing}
                        />
                    </div>

                </div>
                <div className={styles.formRow}>

                    <div>
                        <label htmlFor="streetNumber">Numer domu:</label>
                        <input
                            type="text"
                            id="streetNumber"
                            value={streetNumber}
                            onChange={(e) => setStreetNumber(e.target.value)}
                            disabled={!editing}
                        />
                    </div>
                    <div>
                        <label htmlFor="apartmentNumber">Numer mieszkania:</label>
                        <input
                            type="text"
                            id="apartmentNumber"
                            value={apartmentNumber}
                            onChange={(e) => setApartmentNumber(e.target.value)}
                            disabled={!editing}
                        />
                    </div>

                </div>
                <div className={styles.formRow}>
                    <div>
                        <label htmlFor="postalCode">Kod pocztowy:</label>
                        <input
                            type="text"
                            id="postalCode"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            disabled={!editing}
                        />
                    </div>
                </div>
                <div>
                    <button className={styles.basicButton}
                            onClick={saveData}>{editing ? 'Zapisz zmiany' : 'Edytuj dane'}</button>
                </div>
                <div>
                    <button className={styles.basicButton}
                            onClick={() => setInfoVisible(!infoVisible)}>Twoje zamówienia
                    </button>
                </div>
                <div hidden={!infoVisible} className={styles.tableContainer}>
                    <table>
                        <thead>
                        <tr>
                            <th>Id zamówienia</th>
                            <th>Cena</th>
                            <th>Data złożenia (zapłacenia) zamówienia</th>
                            <th>Data potwierdzenia lub odrzucenia zamówienia</th>
                            <th>Status</th>
                            <th>Produkty</th>
                            <th>Szczegóły</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                <td>{row.id}</td>
                                <td>{row.price}</td>
                                <td>{row.paidDate}</td>
                                <td>{row.acceptDate}</td>
                                <td>{row.status}</td>
                                <td>{row.products}</td>
                                <td>
                                    <button onClick={() => router.push(`/order/${row.id}`)}>Szczegóły</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                </div>
            </div>
            <div className={styles.paginationContainer}>
                {infoVisible && <CustomizedPagination totalPages={totalPages} onPageChange={changePage}/>}
            </div>
        </>
    )
}

export default AccountPage;