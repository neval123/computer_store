import Head from 'next/head'
import {Inter} from 'next/font/google'
import styles from '@/styles/admin.keyword.module.css'
import {useEffect, useState} from "react";

import {
    fetchCategoriesByKeyword,
    fetchKeyword,
    fetchUserData
} from "@/API/getRequests";
import {useRouter} from "next/router";
import {checkTokenExpiration} from "@/functions/authMethods";
import {updateKeyword} from "@/API/putRequests";
import CustomizedPagination from "@/components/CustomizedPagination";
import {useAuth} from "@/functions/authContext";
function KeywordIdPage() {
    const router = useRouter();
    const {isAdmin, setNotAdmin, logout } = useAuth();

    const { keywordId } = router.query;
    const [keywordName, setKeywordName] = useState("")
    const [categories, setCategories] = useState([])
    const [editing, setEditing] = useState(false)
    const [totalPages, setTotalPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);

    useEffect(() => {
        checkTokenExpiration(router,setNotAdmin,logout);
        checkAdminStatus();
    }, [keywordId,pageNumber]);
    const checkAdminStatus = async () => {
        const adminCheck = await getUserInfo();
        if (isAdmin || adminCheck) {
            if(keywordId){
                getKeyword(keywordId);
                getKeywordCategories()
            }

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
    const changePage = async (page) =>{
        setPageNumber(page-1);
        const result = await fetchCategoriesByKeyword(keywordId,page-1, 6);
        setCategories(result['content']);
    }
    const getKeyword= async (keywordId)=>{
        const result = await fetchKeyword(keywordId);
        setKeywordName(result['name']);
    }
    const getKeywordCategories= async ()=>{
        const result = await fetchCategoriesByKeyword(keywordId,pageNumber,6);
        setCategories(result['content']);
        setTotalPages(result['totalPages']);

    }
    const modifyKeyword = async () =>{
        if(editing){
            await updateKeyword(keywordId, keywordName);
        }
        setEditing(!editing);
    }
    const handleCategorySelect = (categoryId) => {
        router.push(`/admin/category/${categoryId}`);
    };
    return (
        <>
            <Head>
                <title>Słowa kluczowe</title>
                <meta name="description" content="Aplikacja sklepu komputerowego"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <div className={styles.buttons}>
                <button onClick={() => router.back()}>Powrót</button>
            </div>
            <div className={styles.body}>

                <div>
                    <label htmlFor="keywordName">Nazwa słowa kluczowego:</label>
                    <input
                        type="text"
                        id="keywordName"
                        onChange={(e) => setKeywordName(e.target.value)}
                        required
                        value={keywordName}
                        disabled={!editing}
                    />
                    <button name={"dataEdit"} className={styles.basicButton}
                            onClick={modifyKeyword}>{editing ? 'Zapisz zmiany' : 'Edytuj nazwę'}</button>
                </div>
                <table>
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nazwa</th>
                        <th>Modyfikuj</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map((row, index) => (
                        <tr key={index}>
                            <td>{row.categoryId}</td>
                            <td>{row.name} </td>
                            <td>
                                <button onClick={() => handleCategorySelect(row.categoryId)}>Modyfikuj kategorię</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className={styles.paginationContainer}>

                    <CustomizedPagination totalPages={totalPages} onPageChange={changePage}/>
                </div>
            </div>

        </>
    )
}

export default KeywordIdPage;