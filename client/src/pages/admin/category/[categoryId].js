import Head from 'next/head'
import Image from 'next/image'
import {Inter} from 'next/font/google'
import styles from '@/styles/category.module.css'
import {useEffect, useState} from "react";
import {fetchUserData
} from "@/API/getRequests";
import {fetchCategory, fetchKeywords} from "@/API/getRequests";
import {useRouter} from "next/router";
import {checkTokenExpiration} from "@/functions/authMethods";
import {fetchProductsByCategory} from "@/API/getRequests";
import {updateCategory} from "@/API/putRequests";
import CustomizedPagination from "@/components/CustomizedPagination";
import {useAuth} from "@/functions/authContext";
import CustomizedSelect from "@/components/CustomizedSelect";
function CategoryIdPage() {
    const router = useRouter();
    const {isAdmin, setNotAdmin, logout } = useAuth();

    const { categoryId } = router.query;
    const [categoryName, setCategoryName] = useState("");
    const [products, setProducts] = useState([]);
    const [editing, setEditing] = useState(false);
    const [keywords, setKeywords] = useState([]);
    const [categoryKeywords, setCategoryKeywords] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

    useEffect(() => {
        checkTokenExpiration(router,setNotAdmin,logout);
        checkAdminStatus();

    }, [categoryId]);
    const checkAdminStatus = async () => {
        const adminCheck = await getUserInfo();
        if (isAdmin || adminCheck) {
            if(categoryId){
                getCategory(categoryId);
                getKeywords();
                getCategoryProducts(categoryId,pageNumber,6);
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
    const getCategory= async (categoryId)=>{
        const result = await fetchCategory(categoryId);
        setCategoryName(result['name']);
        const keywords = result['keywords'];
        setCategoryKeywords(keywords.map(keyword =>({
            value: keyword.keywordId,
            label: keyword.name
        })));
    }
    const keywordOptions = keywords.map(keyword => ({
        value: keyword.keywordId,
        label: keyword.name
    }));
    const getCategoryProducts= async ()=>{
        const result = await fetchProductsByCategory(categoryId,pageNumber,6);
        setProducts(result['content']);
        setTotalPages(result['totalPages']);

    }
    const handleKeywordSelection = (selectedOptions) => {
        const selectedKeywords = selectedOptions.map(option => ({
            value: option.value,
            label: option.label
        }));
        setCategoryKeywords(selectedKeywords);
    };
    const getKeywords = async () => {
        const result = await fetchKeywords(0,100);
        setKeywords(result['content']);
    }
    const changePage = async (page) =>{
        setPageNumber(page-1);
        const productResult = await fetchProductsByCategory(categoryId,page-1, 6);
        setProducts(productResult['content']);
    }
    const modifyCategory = async () =>{
        if(editing){
            const formattedKeywords = categoryKeywords.map(keyword => {
                return { keywordId: keyword.value, name: keyword.label };
            });
            await updateCategory(categoryId, categoryName, formattedKeywords);
        }
        setEditing(!editing);
    }
    const handleProductSelect = (productId) => {
        router.push(`/admin/product/${productId}`);
    };
    return (
        <>
            <Head>
                <title>Kategoria</title>
                <meta name="description" content="Aplikacja sklepu komputerowego"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <div className={styles.buttons}>
                <button onClick={() => router.back()}>Powrót</button>
            </div>
            <div className={styles.body}>

                <div>
                    <label htmlFor="categoryName">Nazwa kategorii:</label>
                    <input
                        type="text"
                        id="categoryName"
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                        value={categoryName}
                        disabled={!editing}
                    />
                    <CustomizedSelect
                        value={categoryKeywords}
                        options={keywordOptions}
                        isDisabled={!editing}
                        onChange={handleKeywordSelection}
                        placeholder="Wybierz słowa kluczowe..."
                    />
                    <button name={"dataEdit"} className={styles.basicButton}
                            onClick={modifyCategory}>{editing ? 'Zapisz zmiany' : 'Edytuj dane'}</button>
                </div>
                <table>
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Zdjęcie</th>
                        <th>Nazwa</th>
                        <th>Cena</th>
                        <th>Modyfikuj</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map((row, index) => (
                        <tr key={index}>
                            <td>{row.productId}</td>
                            <td><Image src={`${backendUrl}${row.image}`} alt={''} height={100} width={100}/></td>
                            <td>{row.name} </td>
                            <td>{row.price} zł</td>
                            <td>
                                <button onClick={() => handleProductSelect(row.productId)}>Modyfikuj produkt</button>
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

export default CategoryIdPage;