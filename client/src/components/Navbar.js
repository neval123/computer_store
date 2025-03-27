import Link from 'next/link';
import styles from '@/styles/navbar.module.css';
import {useEffect, useState} from "react";
import Image from "next/image";
import {fetchUserData} from "@/API/getRequests";
import {useAuth} from "@/functions/authContext";
import {checkTokenExpiration} from "@/functions/authMethods";
import {useRouter} from "next/router";

const Navbar = () => {
    const [hide,setHide] = useState(true);
    const {isLoggedIn, logout, login, setAdmin, setNotAdmin, isAdmin} = useAuth();
    const router = useRouter();
    async function checkUserRole() {
        if (localStorage.getItem("token")) {
            const token = localStorage.getItem("token");
            try {
                const result = await fetchUserData(token);
                if(result['role']=="ADMIN") {
                    setAdmin(true);
                }
                setHide(false);
            } catch (error) {
                console.error("Błąd: ", error);
            }

        }
    }
    useEffect(() => {
        checkTokenExpiration(router,setNotAdmin,logout);
        if (localStorage.getItem("token")) {
            login();
        }
        checkUserRole();
    },[isLoggedIn]);
    const handleLogout = () => {
        localStorage.removeItem("token");
        setHide(true);
        setNotAdmin();
        logout();
    };
    return (
        <div className={styles.navbar}>
            <div className={styles.imagePosition}>
                <Image src={"/logo.png"} alt={"Sklep komputerowy"} width={50} height={50}/>
                <h3>Sklep komputerowy</h3>
                <Image src={"/logo2.png"} alt={"Sklep"} width={50} height={50}/>

            </div>
            <div className={styles.loginLink}>
                <Link hidden={!isAdmin} href="/admin">Panel administratora</Link>

                <Link href="/">Katalog</Link>
                <Link href="/search">Szukaj</Link>



                <Link href="/cart">Koszyk</Link>
                <Link href="/account">Konto</Link>
                <Link onClick={handleLogout} hidden={!isLoggedIn} href="/">Wyloguj się</Link>

                <Link hidden={isLoggedIn} href="/login">Zaloguj się</Link>
            </div>
        </div>
    );
};

export default Navbar;