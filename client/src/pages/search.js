import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/search.module.css'
import {useEffect, useState} from "react";
import Product from "@/components/Product";
import {checkTokenExpiration} from "@/functions/authMethods";
import {useRouter} from "next/router";
import {fetchProducts, fetchProductsBySearchedKeywordName, fetchProductsBySearchedName} from "@/API/getRequests";
import {useAuth} from "@/functions/authContext";
import CustomizedPagination from "@/components/CustomizedPagination";
function SearchPage() {
    const [searchText, setSearchText] = useState("");
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const { setNotAdmin, logout } = useAuth();

    const router = useRouter();

    useEffect(() => {
        checkTokenExpiration(router,setNotAdmin,logout);
    }, []);
    const searchProduct = async (name, page) => {
        const products = await fetchProductsBySearchedName(name, page, 4);
        setProducts(products['content']);
        setTotalPages(products['totalPages']);
    }
    const handleInputChange = (e) => {
        setSearchText(e.target.value);
        if (e.target.value.length > 2) {
            searchProduct(e.target.value, pageNumber);
        } else {
            setProducts([]);
        }
    };
    const changePage = async (page) => {
        setPageNumber(page - 1);
        await searchProduct(searchText, page - 1);
    };
    return (
        <>
            <Head>
                <title>Wyszukaj produkt</title>
                <meta name="description" content="Aplikacja sklepu komputerowego" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={styles.body}>
                <div className={styles.searchContainer}>
                    <h3>Wyszukaj produkt po nazwie:</h3>
                    <label htmlFor="searchText">Wprowadź minimum 3 znaki:</label>
                    <input
                        type="text"
                        id="searchText"
                        value={searchText}
                        onChange={handleInputChange}

                    />
                </div>
                <div className={styles.grid}>

                    {products.map(product => (
                        <Product
                            key={product.id}
                            props={product}
                        />
                    ))}
                </div>
                <div className={styles.paginationContainer}>
                    <CustomizedPagination totalPages={totalPages}  currentPage={pageNumber + 1} onPageChange={changePage}/>
                </div>
            </div>
        </>
    )
}

export default SearchPage;