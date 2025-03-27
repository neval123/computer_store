import {useEffect, useState} from 'react';
import styles from '@/styles/login.module.css'
import Link from "next/link";
import {useRouter} from "next/navigation";
import { useAuth } from "@/functions/authContext";
import {fetchUserData} from "@/API/getRequests";
import {sendNotification} from "@/functions/other";

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const {login} = useAuth();
    const {setAdmin, setNotAdmin, logout, isLoggedIn} = useAuth();
    useEffect(() => {
        if (isLoggedIn) {
            router.push('/');
        }
    }, [isLoggedIn, router]);
    const tryLogin = async (e) => {
        e.preventDefault();
        const userData = {
            email: email,
            password: password
        }

        try{
            const response = await fetch("http://localhost:8080/login",
                {
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });
            if(response.status===403){
                await sendNotification("Niepoprawne hasło lub adres e-mail");
            }else{
                let result = await response.json();
                localStorage.removeItem("token");
                localStorage.setItem("token", result['token']);
                login();
                result = await fetchUserData(result['token']);
                result['role'] == "ADMIN" ? setAdmin() : setNotAdmin();
                setEmail(result['email']);
                router.push("/");
            }
        }catch(e){
            console.error("Wystąpił błąd: ", e);
        }
    };

    return (
        <div className={styles.body}>
            <h2>Logowanie</h2>
            <form onSubmit={tryLogin} className={styles.form}>
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <button type="submit">Zaloguj się</button>
                </div>

            </form>
            <h4>Nie posiadasz konta?</h4>
            <Link href="/register" className={styles.link}>Zarejestruj się</Link>
        </div>
    );
}

export default LoginPage;