import Head from 'next/head'
import Image from 'next/image'
import {Inter} from 'next/font/google'
import styles from '@/styles/category.module.css'
import {useEffect, useState} from "react";
import {checkTokenExpiration} from "@/functions/authMethods";
import {useRouter} from "next/router";
import {deleteCategory} from "@/API/deleteRequests";
import CustomizedPagination from "@/components/CustomizedPagination";
import {checkCategoryName, fetchCategories, fetchKeywords, fetchUserData} from "@/API/getRequests";
import {createCategory} from "@/API/postRequests";
import {useAuth} from "@/functions/authContext";
import CustomizedSelect from "@/components/CustomizedSelect";
import {sendNotification} from "@/functions/other";
function CategoryPage() {

    const [categoryName, setCategoryName] = useState("");
    const [categories, setCategories] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const [addActive, setAddActive] = useState(false);
    const [keywords, setKeywords] = useState([]);
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [keywordNames, setKeywordNames] = useState("");
    const { isAdmin, setNotAdmin, logout } = useAuth();
    const keywordOptions = keywords.map(keyword =>({
        value: keyword.keywordId,
        label: keyword.name
    }));
    let alreadyAdded = false;
    const router = useRouter();
    useEffect(() => {


        checkTokenExpiration(router, setNotAdmin, logout);
        checkAdminStatus();
    }, []);
    const checkAdminStatus = async () => {
        const adminCheck = await getUserInfo();
        if (isAdmin || adminCheck) {
            await getCategories(pageNumber);
            await getKeywords();
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
    const getCategories = async (pageNumber) => {
        const result = await fetchCategories(pageNumber, 6);
        setTotalPages(result['totalPages']);
        setCategories(result['content']);
    }
    const getKeywords = async()=>{
        const result = await fetchKeywords(0,100);
        setKeywords(result['content']);
    }
    const changePage = async (page) => {
        setPageNumber(page - 1);
        await getCategories(page - 1);
    }
    const removeCategory = async (categoryId) => {
        const result = await deleteCategory(categoryId);
        if (result == "error") {
            await sendNotification("Naruszono więzy integralności!");
        } else {
            await sendNotification("Usunięto kategorię!");

        }
        if (categories.length === 1 && pageNumber > 0) {
            setPageNumber(pageNumber - 1);
            await getCategories(pageNumber - 1);
        } else {
            await getCategories(pageNumber);
        }

    }

    const addCategory = async (e) => {
        alreadyAdded = false;
        e.preventDefault();
        const checkResult = await checkCategoryName(categoryName);
        if(checkResult=="error"){
            await sendNotification("Kategoria o podanej nazwie już istnieje!");
        }
        else {
            const convertedKeywords = selectedKeywords.map(keyword=>({keywordId:keyword.value,name:keyword.label}));
            const result = await createCategory(categoryName,convertedKeywords);
            await sendNotification("Dodano kategorię!");
            await getCategories(pageNumber);
        }
        setKeywordNames("");
    };
    const categoryDetails = (categoryId) => {
        router.push(`/admin/category/${categoryId}`);
    }
    const handleKeywordSelection = (selectedOptions) => {
        const selectedKeywords = selectedOptions.map(option => ({
            value: option.value,
            label: option.label
        }));
        setSelectedKeywords(selectedKeywords);
    };

    return (
        <>
            <Head>
                <title>Panel administratora</title>
                <meta name="description" content="Aplikacja sklepu komputerowego"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <div>
                <div className={styles.buttons}>
                    <button onClick={() => router.push("/admin")}>Powrót</button>
                    <button onClick={() => setAddActive(false)}>Modyfikuj kategorie</button>
                    <button onClick={() => setAddActive(true)}>Dodaj kategorię</button>
                </div>
                <div className={styles.body}>
                    {addActive ? (
                        <form className={styles.form} onSubmit={addCategory}>
                            <div>
                                <label htmlFor="categoryName">Nazwa kategorii do dodania:</label>
                                <input
                                    type="text"
                                    id="categoryName"
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    required
                                />
                                <h4>Słowa kluczowe:</h4>
                                <CustomizedSelect
                                    options={keywordOptions}
                                    onChange={handleKeywordSelection}
                                    placeholder="Wybierz słowa kluczowe..."
                                />
                            </div>
                            <button type="submit">Dodaj kategorię</button>
                        </form>
                    ) : (
                        <>
                            <table>
                                <thead>
                                <tr>
                                    <th>Id kategorii</th>
                                    <th>Nazwa</th>
                                    <th>Informacje</th>
                                    <th>Usuń</th>
                                </tr>
                                </thead>
                                <tbody>
                                {categories.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.categoryId}</td>
                                        <td>{row.name}</td>
                                        <td>
                                            <button onClick={() => categoryDetails(row.categoryId)}>Szczegóły</button>
                                        </td>
                                        <td>
                                            <button onClick={() => removeCategory(row.categoryId)}
                                                    className={styles.cancelButton}><Image src={"/trash.png"} alt={''}
                                                                                           height={25} width={25}/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                        </>
                    )}

                </div>
            </div>
            {!addActive && <div className={styles.paginationContainer}>
                <CustomizedPagination totalPages={totalPages} onPageChange={changePage}/>
            </div>}
        </>
    )
}

export default CategoryPage;