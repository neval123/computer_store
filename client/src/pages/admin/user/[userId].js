import Head from 'next/head'
import {Inter} from 'next/font/google'
import styles from '@/styles/account.module.css'
import {useEffect, useState} from "react";
import {fetchUserData, adminFetchUserData,adminFetchUserFinishedCustomerOrders, fetchCustomerOrderItemsByOrder} from "@/API/getRequests";
import {adminUpdateUserData} from "@/API/putRequests";
import {useRouter} from "next/router";
import {checkTokenExpiration} from "@/functions/authMethods";
import {useAuth} from "@/functions/authContext";
import {sendNotification} from "@/functions/other";
import CustomizedPagination from "@/components/CustomizedPagination";
function UserIdPage() {
    const [infoVisible, setInfoVisible] = useState(false);
    const { isAdmin, setNotAdmin, logout } = useAuth();

    let firstTime = true;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [street, setStreet] = useState('');
    const [streetNumber, setStreetNumber] = useState('');
    const [apartmentNumber, setApartmentNumber] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [editing, setEditing] = useState(false);
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const router = useRouter();
    const { userId } = router.query;
    const [data, setData] = useState([]);

    useEffect(() => {
        checkTokenExpiration(router,setNotAdmin,logout);
        checkAdminStatus();
    }, [userId]);
    const checkAdminStatus = async () => {
        const adminCheck = await getUserRole();
        if (isAdmin || adminCheck) {
            if(userId){
                getUserInfo();

            }
        } else {
            router.back();
        }
    };
    const getUserRole = async ()=>{
        const result = await fetchUserData(localStorage.getItem("token"));
        if(result['role']=="ADMIN"){
            return true;
        }else{
            return false;
        }
    }
    async function getUserInfo() {
        const token = localStorage.getItem("token");
        try {
            const result = await adminFetchUserData(userId);
            setEmail(result['email']);
            setName(result['name']);
            setLastName(result['lastName']);
            setCity(result['city']);
            setStreet(result['street']);
            setPhoneNumber(result['phoneNumber'] != 0 ? result['phoneNumber'] : "");
            setStreetNumber(result['streetNumber'] != 0 ? result['streetNumber'] : "");
            setApartmentNumber(result['apartmentNumber'] != 0 ? result['apartmentNumber'] : "");
            setPostalCode(result['postalCode']);
            result['role']=="ADMIN"?setIsUserAdmin(true):setIsUserAdmin(false);
        } catch (error) {
            console.error("Błąd: ", error);
        }
    }
    const getOrders = async () => {
        if (firstTime) {
            firstTime = false;
            setInfoVisible(!infoVisible);
            const result = await adminFetchUserFinishedCustomerOrders(userId);
            setTotalPages(result['totalPages']);

            if(result != undefined) {
                const content = result['content'];
                for (const order of content) {
                    let productValue = await fetchCustomerOrderItemsByOrder(order['orderId']);
                    let formattedProductValue = [];
                    if (productValue['content'] && productValue['content'].length == 0) {
                        formattedProductValue = productValue['content'];
                    } else {
                        formattedProductValue = productValue['content'].map(item => item['product']['name']).join("; ");

                    }
                    let formattedPaymentDate = new Date(order['paymentDate']).toLocaleString();
                    let formattedAcceptDate = order['acceptDate'] ? new Date(order['acceptDate']).toLocaleString() : '-';
                    setData(prevData => [...prevData, {
                        id: order['orderId'],
                        price: order['totalPrice'] + " zł",
                        paidDate: formattedPaymentDate,
                        status: formatOrderStatus(order['status']),
                        acceptDate: formattedAcceptDate,
                        products: formattedProductValue
                    }]);
                }
            } else
                {
                    await sendNotification("Użytkownik nie złożył jeszcze żadnych zamówień");
                }
        } else {
            setInfoVisible(!infoVisible);
        }
    }
    const changePage = async (page) => {
        setPageNumber(page-1);
        await getOrders(page-1);
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
            await adminUpdateUserData(name, lastName,email, street, streetNumber,apartmentNumber, city, postalCode, phoneNumber, userId, isAdmin ? 'ADMIN' : 'USER');
            setEditing(!editing);
        }else{
            setEditing(!editing)
        }
    }
    return (
        <>
            <Head>
                <title>Użytkownik</title>
                <meta name="description" content="Aplikacja sklepu komputerowego"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <div className={styles.buttons}>
                <button onClick={() => router.back()}>Powrót</button>
            </div>
            <div className={styles.body}>

                <h4>Informacje o koncie</h4>
                <div className={styles.formRow}>
                    <div>
                        <label htmlFor="name">Imię:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            disabled={!editing}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName">Nazwisko:</label>
                        <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            disabled={!editing}

                            onChange={(e) => setLastName(e.target.value)}
                            required
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
                            disabled={true}

                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber">Numer telefonu:</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            value={phoneNumber}
                            disabled={!editing}

                            onChange={(e) => setPhoneNumber(e.target.value)}
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
                            disabled={!editing}

                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="street">Ulica:</label>
                        <input
                            type="text"
                            id="street"
                            value={street}
                            disabled={!editing}

                            onChange={(e) => setStreet(e.target.value)}
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
                            disabled={!editing}

                            onChange={(e) => setStreetNumber(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="apartmentNumber">Numer mieszkania:</label>
                        <input
                            type="text"
                            id="apartmentNumber"
                            value={apartmentNumber}
                            disabled={!editing}
                            onChange={(e) => setApartmentNumber(e.target.value)}
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
                            disabled={!editing}

                            onChange={(e) => setPostalCode(e.target.value)}
                        />
                    </div>
                    <div className={styles.checkBoxContainer}>
                        <label htmlFor="admin">Admin?</label>
                        <input className={styles.checkbox}
                               type="checkbox"
                               id="admin"
                               checked={isUserAdmin}
                               disabled={!editing}

                               onChange={(e) => setIsUserAdmin(e.target.checked)}
                        />
                    </div>

                </div>
                <div>
                    <button className={styles.basicButton}
                            onClick={saveData}>{editing ? 'Zapisz zmiany' : 'Edytuj dane'}</button>
                </div>
                <div>
                    <button className={styles.basicButton} onClick={getOrders}>Zamówienia użytkownika</button>
                </div>
                <div hidden={!infoVisible} className={styles.tableContainer}>
                    <table>
                    <thead>
                        <tr>
                            <th>Id zamówienia</th>
                            <th>Cena</th>
                            <th>Data złożenia zamówienia</th>
                            <th>Data potwierdzenia zamówienia</th>
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
                                    <button  onClick={() => router.push(`/order/${row.id}`)}>Szczegóły</button>
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

export default UserIdPage;