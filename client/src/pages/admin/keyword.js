import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/admin.keyword.module.css'
import {useEffect, useState} from "react";
import {checkTokenExpiration} from "@/functions/authMethods";
import {useRouter} from "next/router";
import {deleteKeyword} from "@/API/deleteRequests";
import CustomizedPagination from "@/components/CustomizedPagination";
import {fetchKeywords, fetchUserData} from "@/API/getRequests";
import {createKeyword} from "@/API/postRequests";
import {useAuth} from "@/functions/authContext";
import {sendNotification} from "@/functions/other";
function KeywordPage() {

    const [keywordName, setKeywordName] = useState("");
    const [keywords, setKeywords] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    let alreadyAdded = false;
    const { isAdmin, setNotAdmin, logout } = useAuth();

    const router = useRouter();
    useEffect(() => {
        checkTokenExpiration(router,setNotAdmin,logout);
        checkAdminStatus();
    }, []);
    const checkAdminStatus = async () => {
        const adminCheck = await getUserInfo();
        if (isAdmin || adminCheck) {
            await getKeywords(pageNumber);
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
    const getKeywords = async (pageNumber)=>{
        const result = await fetchKeywords(pageNumber, 10);
        setTotalPages(result['totalPages']);
        setKeywords(result['content']);
    }
    const changePage = async (page) => {
        setPageNumber(page-1);
        await getKeywords(page-1);
    }
    const removeKeyword = async (keywordId) =>{
        const result = await deleteKeyword(keywordId);
        if(result == "error"){
            await sendNotification("Naruszono więzy integralności!");
        }else{
            await  sendNotification("Usunięto słowo kluczowe!");
        }
        if (keywords.length === 1 && pageNumber > 0) {
            setPageNumber(pageNumber - 1);
        }
        await getKeywords(pageNumber > 0 ? pageNumber - 1 : 0);
    }

    const addKeyword = async (e) =>{
        alreadyAdded = false;
        e.preventDefault();
        keywords.forEach(keyword =>{
            if(keyword['name']==keywordName){
                alreadyAdded = true;
            }
        });
        if(!alreadyAdded){
            const result = await createKeyword(keywordName);
            await sendNotification("Dodano słowo kluczowe!");
            await getKeywords(pageNumber);
        }else{
            await sendNotification("Słowo kluczowe o podanej nazwie już istnieje!");
        }

    };
    const keywordDetails = (keywordId) =>{
        router.push(`/admin/keyword/${keywordId}`);
    }
    return (
        <>
            <Head>
                <title>Panel administratora</title>
                <meta name="description" content="Aplikacja sklepu komputerowego" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>
                <div className={styles.buttons}>
                    <button onClick={()=>router.push("/admin")}>Powróć</button>
                </div>
                <div className={styles.body}>
                    <table>
                        <thead>
                        <tr>
                            <th>Id słowa kluczowego</th>
                            <th>Nazwa</th>
                            <th>Informacje</th>
                            <th>Usuń</th>
                        </tr>
                        </thead>
                        <tbody>
                        {keywords.map((row, index) => (
                            <tr key={index}>
                                <td>{row.keywordId}</td>
                                <td>{row.name}</td>
                                <td>
                                    <button onClick={() => keywordDetails(row.keywordId)}>Szczegóły</button>
                                </td>
                                <td>
                                    <button onClick={() => removeKeyword(row.keywordId)} className={styles.cancelButton}><Image src={"/trash.png"} alt={''}height={25}width={25}/></button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className={styles.paginationContainer}>

                        <CustomizedPagination totalPages={totalPages} onPageChange={changePage}/>
                    </div>
                    <form className={styles.form} onSubmit={addKeyword}>
                        <div>
                            <label htmlFor="keywordName">Nazwa słowa kluczowego do dodania:</label>

                            <input
                                type="text"
                                id="keywordName"
                                onChange={(e) => setKeywordName(e.target.value)}
                                required
                            />

                        </div>
                        <button type="submit">Dodaj słowo kluczowe</button>
                    </form>

                </div>
            </div>
        </>
    )
}

export default KeywordPage;