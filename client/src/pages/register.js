import {useEffect, useState} from 'react';
import styles from '@/styles/account.module.css'
import {useRouter} from "next/navigation";
import {useAuth} from "@/functions/authContext";
import {sendNotification} from "@/functions/other";

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [street, setStreet] = useState('');
    const [streetNumber, setStreetNumber] = useState('');
    const [apartmentNumber, setApartmentNumber] = useState('');
    const [city, setCity] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const router = useRouter();
    const { setNotAdmin, logout, login, isLoggedIn} = useAuth();
    useEffect(() => {
        if (isLoggedIn) {
            router.push('/');
        }
    }, [isLoggedIn, router]);
    const tryRegister = async (e) => {
        e.preventDefault();
        const userData = {
            email: email,
            password: password,
            name: name,
            lastName: lastName,
            role: "USER",
            postalCode: postalCode,
            city: city,
            streetNumber: streetNumber,
            apartmentNumber: apartmentNumber,
            phoneNumber: phoneNumber,
            street: street
        };
        try {
            const response = await fetch('http://localhost:8080/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData),
            });
            if (response.ok) {
                const result = await response.json();
                localStorage.removeItem("token");
                router.push("/login");
            }
            else if(response.status===409) {
                await sendNotification("Podany adres e-mail jest już w użyciu!");
            }
            else{
                console.log('Rejestracja nie powiodła się');
            }
        } catch (error) {
            console.error('Wystąpił błąd:', error);
        }
    };

    return (
        <div className={styles.body}>
            <h2>Rejestracja</h2>
            <form onSubmit={tryRegister} className={styles.form}>
                <div className={styles.formRow}>
                    <div>
                        <label htmlFor="name">Imię:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
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
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Hasło:</label>
                        <input
                            type="password"
                            id="password"
                            minLength={8}
                            maxLength={32}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        />
                    </div>
                    <div>
                        <label htmlFor="street">Ulica:</label>
                        <input
                            type="text"
                            id="street"
                            value={street}
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
                            onChange={(e) => setStreetNumber(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="apartmentNumber">Numer mieszkania:</label>
                        <input
                            type="text"
                            id="apartmentNumber"
                            value={apartmentNumber}
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
                            onChange={(e) => setPostalCode(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber">Numer telefonu:</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>

                </div>
                <div>
                    <button className={styles.basicButton} type="submit">Zarejestruj się</button>
                </div>
            </form>
        </div>
    );
}

export default RegisterPage;