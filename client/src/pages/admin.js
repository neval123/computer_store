import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/admin.module.css'
import {useRouter} from "next/router";
import {useEffect} from "react";
import {checkTokenExpiration} from "@/functions/authMethods";
import {useAuth} from "@/functions/authContext";
function AdminPage() {
    const router = useRouter();
    const {isAdmin,setNotAdmin, logout} = useAuth();
    useEffect(() => {
        checkTokenExpiration(router,setNotAdmin,logout);
        if(!isAdmin){
            router.back();
        }
    }, []);
    return (
        <>
            <Head>
                <title>Panel administratora</title>
                <meta name="description" content="Aplikacja sklepu komputerowego" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.body}>
                <div className={styles.buttonsContainer}>
                    <h3>Wybierz jedną z poniższych sekcji:</h3>
                    <button onClick={() => router.push("/admin/category")}>Kategorie</button>
                    <button onClick={() => router.push("/admin/product")}>Produkty</button>
                    <button onClick={() => router.push("/admin/user")}>Użytkownicy</button>
                    <button onClick={() => router.push("/admin/order")}>Zamówienia</button>
                    <button onClick={() => router.push("/admin/keyword")}>Słowa kluczowe</button>
                </div>

            </div>
        </>
    )
}
export default AdminPage;