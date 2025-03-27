import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/admin.user.module.css'

import {useRouter} from "next/router";
import {checkTokenExpiration} from "@/functions/authMethods";
import {useEffect, useState} from "react";
import CustomizedPagination from "@/components/CustomizedPagination";
import {deleteUser} from "@/API/deleteRequests";
import {fetchUserData, fetchUsersData} from "@/API/getRequests";
import {createUser} from "@/API/postRequests";
import {useAuth} from "@/functions/authContext";
import {sendNotification} from "@/functions/other";

function UserPage() {
    const router = useRouter();
    const [addActive, setAddActive] = useState(false);
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [street, setStreet] = useState('');
    const [streetNumber, setStreetNumber] = useState('');
    const [users,setUsers] = useState([]);
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const {isAdmin, setNotAdmin, logout } = useAuth();


    useEffect(() => {
        checkTokenExpiration(router,setNotAdmin,logout);
        checkAdminStatus();
    }, []);
    const checkAdminStatus = async () => {
        const adminCheck = await getUserInfo();
        if (isAdmin || adminCheck) {
            getUsers(pageNumber);

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
    const getUsers = async (pageNumber) => {
        const result = await fetchUsersData(pageNumber,6);
        const content = result['content'];
        setTotalPages(result['totalPages']);
        const newUsers = content.map(user => ({
            id: user['userId'],
            name: user['name'],
            lastName: user['lastName'],
            email: user['email'],
            role: user['role']
        }));
        setUsers(newUsers);
    }
    const addUser = async (e) =>{
        e.preventDefault();
        await createUser(name, lastName, email, password, isUserAdmin ? 'ADMIN' : 'USER');
        await  sendNotification("Dodano użytkownika!");
        getUsers(pageNumber);

    }
    const changePage = async (page) =>{
        setPageNumber(page-1);
        await getUsers(page-1);
    }
    const handleUserSelect = (userId) => {
        router.push(`/admin/user/${userId}`);
    };
    const removeUser = async (userId) =>{
        const result = await deleteUser(userId);
        if(result == "error"){
            await sendNotification("Naruszono więzy integralności!");
        }else{
            await sendNotification("Usunięto użytkownika!");

        }
        if (users.length === 1 && pageNumber > 0) {
            setPageNumber(pageNumber - 1);
        }
        await getUsers(pageNumber > 0 ? pageNumber - 1 : 0);
    }
    return (
        <>
            <Head>
                <title>Panel administratora</title>
                <meta name="description" content="Aplikacja sklepu komputerowego" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.buttons}>
                <button onClick={()=>router.push("/admin")}>Powróć</button>
                <button onClick={()=>setAddActive(false)}>Modyfikuj użytkowników</button>
                <button onClick={()=>setAddActive(true)}>Dodaj użytkownika</button>
            </div>
            <div className={styles.body}>


                {addActive ? (<div>
                        <form onSubmit={addUser} className={styles.form}>
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
                                    <label htmlFor="postalCode">Kod pocztowy:</label>
                                    <input
                                        type="text"
                                        id="postalCode"
                                        value={postalCode}
                                        onChange={(e) => setPostalCode(e.target.value)}
                                    />
                                </div>

                            </div>
                            <div className={styles.formRow}>

                                <div className={styles.checkBoxContainer}>
                                    <label htmlFor="admin">Admin?</label>
                                    <input className={styles.checkbox}
                                           type="checkbox"
                                           id="admin"
                                           checked={isUserAdmin}
                                           onChange={(e) => setIsUserAdmin(e.target.checked)}
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
                                <button type={"submit"}>Dodaj użytkownika</button>
                            </div>

                        </form>
                    </div>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>Id użytkownika</th>
                            <th>E-mail</th>
                            <th>Imię</th>
                            <th>Nazwisko</th>
                            <th>Uprawnienia</th>
                            <th>Dodatkowe informacje</th>
                            <th>Usuń</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((row, index) => (
                            <tr key={index}>
                                <td>{row.id}</td>
                                <td>{row.email}</td>
                                <td>{row.name}</td>
                                <td>{row.lastName}</td>
                                <td>{row.role}</td>
                                <td><button onClick={()=>handleUserSelect(row.id)}>Przejdź do edycji</button></td>
                                <td>
                                    <button onClick={() => removeUser(row.id)}
                                            className={styles.cancelButton}><Image src={"/trash.png"} alt={''}
                                                                                   height={25} width={25}/></button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                )}

            </div>
            {!addActive && <div className={styles.paginationContainer}>
        <CustomizedPagination totalPages={totalPages} onPageChange={changePage}/>
    </div>}
        </>
    )
}
export default UserPage;