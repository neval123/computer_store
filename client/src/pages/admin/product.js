import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/admin.product.module.css'

import {useRouter} from "next/router";
import {checkTokenExpiration} from "@/functions/authMethods";
import {useEffect, useState} from "react";
import CustomizedPagination from "@/components/CustomizedPagination"
import {fetchCategoriesByName, fetchKeywordsByCategory, fetchUserData, fetchProducts} from "@/API/getRequests";
import {deleteProduct} from "@/API/deleteRequests";
import {createImage, createProduct} from "@/API/postRequests";
import {useAuth} from "@/functions/authContext";
import {sendNotification} from "@/functions/other";
import CustomizedSelect from "@/components/CustomizedSelect";

function ProductPage() {
    const router = useRouter();
    const [addActive, setAddActive] = useState(false);
    const [productName, setProductName] = useState(null);
    const [productPrice, setProductPrice] = useState(null);
    const [productImage, setProductImage] = useState(null);
    const [productDescription, setProductDescription] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [productKeywords, setProductKeywords] = useState([]);
    const [productKeywordsNames, setProductKeywordsNames] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const {isAdmin, setNotAdmin, logout } = useAuth();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    const keywordOptions = keywords.map(keyword =>({
        value: keyword.keywordId,
        label: keyword.name
    }));
    useEffect(() => {
        checkTokenExpiration(router,setNotAdmin,logout);
       checkAdminStatus();

    }, []);
    const checkAdminStatus = async () => {
        const adminCheck = await getUserInfo();
        if (isAdmin || adminCheck) {
            getCategories();
            getProducts(pageNumber);
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
        const productResult = await fetchProducts(page-1, 4);
        setProducts(productResult['content']);
    }
    const getKeywordsByCategory = async(categoryId) =>{
        const result = await fetchKeywordsByCategory(categoryId);
        setKeywords(result['content']);
    }
    const addProduct = async (e) => {
        e.preventDefault();
        let formattedKeywords = [];
        if(productKeywords.length>0){
            formattedKeywords = productKeywords.map(keyword=>({
                keywordId:keyword.value,name:keyword.label
            }));
        }
        const newProduct = await createProduct(productName, productPrice, productDescription, categoryId, formattedKeywords);
        await createImage(productImage,newProduct['productId']);
        if (newProduct) {
            //setProducts([...products, newProduct]);
            await getProducts(pageNumber);
            await sendNotification("Dodano produkt!");
            setAddActive(false);
        }
    };
    const getProducts = async (page) =>{
        const result = await fetchProducts(page, 4);
        setTotalPages(result['totalPages']);
        setProducts(result['content']);
    }
    const getCategories = async () =>{
        const result = await fetchCategoriesByName();
        setCategories(result['content']);
    }
    const removeProduct = async (productId) =>{
        const result = await deleteProduct(productId);
        if(result == "error"){
            await sendNotification("Naruszono więzy integralności!");
        }else{
            await sendNotification("Usunięto produkt!");

        }
        if (products.length === 1 && pageNumber > 0) {
            setPageNumber(pageNumber - 1);
        }
        await getProducts(pageNumber > 0 ? pageNumber - 1 : 0);
    }
    const handleProductSelect = (productId) => {
        router.push(`/admin/product/${productId}`);
    };
    const handleCategorySelection = async (e) =>{
        setCategoryId(e.target.value);
        setProductKeywords([]);
        await getKeywordsByCategory(e.target.value);
    }
    const handleKeywordSelection = (selectedOptions) => {
        const selectedKeywords = selectedOptions.map(option => ({
            value: option.value,
            label: option.label
        }));
        setProductKeywords(selectedKeywords);

    };
    return (
        <>
            <Head>
                <title>Panel administratora</title>
                <meta name="description" content="Aplikacja sklepu komputerowego"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <div className={styles.buttons}>
                <button onClick={() => router.push("/admin")}>Powróć</button>
                <button onClick={() => setAddActive(false)}>Modyfikuj produkty</button>
                <button onClick={() => setAddActive(true)}>Dodaj produkt</button>
            </div>
            <div className={styles.body}>
                {addActive ? (<div>
                        <form onSubmit={addProduct} className={styles.form}>
                            <h3>Dodaj nowy produkt:</h3>
                            <div className={styles.formRow}>
                                <div>
                                    <label htmlFor="name">Nazwa:</label>
                                    <input
                                        type="text"
                                        id="name"
                                        onChange={(e) => setProductName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="description">Opis:</label>
                                    <textarea
                                        type="text"
                                        id="description"
                                        onChange={(e) => setProductDescription(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className={styles.formRow}>

                                <div>
                                    <label htmlFor="price">Cena:</label>
                                    <input
                                        type="text"
                                        id="price"
                                        onChange={(e) => setProductPrice(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="image">Obraz:</label>
                                    <input
                                        type="file"
                                        id="image"
                                        onChange={(e) => setProductImage(e.target.files[0])}
                                        required
                                    />
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div>
                                    <label htmlFor="category">Kategoria:</label>

                                    <select className={styles.categoryContainer} id="category"
                                            onChange={(e) => handleCategorySelection(e)}
                                            required>
                                        {categories.map(category => (
                                            <option key={category.categoryId} value={category.categoryId}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="keyword">Słowa kluczowe:</label>
                                    <div className={styles.keywordChoose}>
                                        <CustomizedSelect
                                            value={productKeywords}
                                            options={keywordOptions}
                                            onChange={handleKeywordSelection}
                                            placeholder="Wybierz słowa kluczowe..."
                                        />
                                    </div>
                                </div>


                            </div>
                            <div>
                                <div>
                                    <button className={styles.basicButton} type="submit">Dodaj produkt</button>

                                </div>
                            </div>


                        </form>
                    </div>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Zdjęcie</th>
                            <th>Nazwa</th>
                            <th>Cena</th>
                            <th>Modyfikuj</th>
                            <th>Usuń</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((row, index) => (
                            <tr key={index}>
                                <td>{row.productId}</td>
                                <td> {row.image ? (
                                    <Image src={`${backendUrl}/uploads${row.image}`} alt={row.name} height={100} width={100}/>
                                ) : (
                                    <div>Brak obrazu</div>
                                )}</td>
                                <td>{row.name} </td>
                                <td>{row.price} zł</td>
                                <td>
                                    <button onClick={() => handleProductSelect(row.productId)}>Modyfikuj produkt
                                    </button>
                                </td>
                                <td>
                                    <button onClick={() => removeProduct(row.productId)}
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

export default ProductPage;