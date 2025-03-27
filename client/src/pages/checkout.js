import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/checkout.module.css'
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useAuth} from "@/functions/authContext";
import {updateUserData, payCustomerOrder} from "@/API/putRequests";
import {fetchUserData, fetchCollectedCustomerOrder} from "@/API/getRequests";
import {checkTokenExpiration} from "@/functions/authMethods";
import {sendNotification} from "@/functions/other";
function CheckoutPage() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [street, setStreet] = useState('');
    const [streetNumber, setStreetNumber] = useState('');
    const [apartmentNumber, setApartmentNumber] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const { setNotAdmin, logout } = useAuth();

    const {login} = useAuth();
    useEffect(() => {
        checkTokenExpiration(router,setNotAdmin,logout);
        getOrderAndUserInfo();
    }, []);
    async function getOrderAndUserInfo() {
        if (localStorage.getItem("token")) {
            const token = localStorage.getItem("token");

            try {
                const result2 = await fetchCollectedCustomerOrder(token);
                if(result2 == undefined){
                    router.push("/").then(async () => {
                        await sendNotification("Najpierw skompletuj zamówienie!");
                    });
                }
                const result = await fetchUserData(token);
                setName(result['name']);
                setLastName(result['lastName']);
                    setStreet(result['street']);
                    setStreetNumber(result['streetNumber'] != 0 ? result['streetNumber'] : '');
                    setApartmentNumber(result['apartmentNumber'] != 0 ? result['apartmentNumber'] : '');
                    setCity(result['city']);
                    setPostalCode(result['postalCode']);
                    setPhoneNumber(result['phoneNumber'] != 0 ? result['phoneNumber'] : '');

                setTotalPrice(result2['totalPrice']);
            } catch (error) {
                console.error("Błąd: ", error);
            }

        } else {
            await router.push("/login");
        }
    }
    const payForOrder = async (event) => {
        event.preventDefault();
        await payCustomerOrder(totalPrice,localStorage.getItem("token"));
        await sendNotification("Zamówienie złożone!");
        await router.push("/");
    }
    return (
        <>
            <Head>
                <title>Koszyk</title>
                <meta name="description" content="Aplikacja sklepu komputerowego" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.body}>
                <h3>Dane adresowe:</h3>
                <form onSubmit={payForOrder} className={styles.form}>
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
                        <label htmlFor="street">Ulica:</label>
                        <input
                            type="text"
                            id="street"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="streetNumber">Numer domu:</label>
                        <input
                            type="text"
                            id="streetNumber"
                            value={streetNumber}
                            onChange={(e) => setStreetNumber(e.target.value)}
                            required
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
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="apartmentNumber">Numer mieszkania:</label>
                            <input
                                type="text"
                                id="apartmentNumber"
                                value={apartmentNumber}
                                onChange={(e) => setApartmentNumber(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div>
                            <label htmlFor="phoneNumber">Numer telefonu:</label>
                            <input
                                type="text"
                                id="phoneNumber"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="postalCode">Kod pocztowy:</label>
                            <input
                                type="text"
                                id="postalCode"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <h3>Łączna kwota: {totalPrice} zł</h3>
                    <div>
                        <button type="submit">Zamawiam i płacę</button>
                    </div>
                </form>

            </div>
        </>
    )
}

export default CheckoutPage;