import Head from 'next/head'
import {Inter} from 'next/font/google'
import styles from '@/styles/Home.module.css'
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Product from "@/components/Product";
import {fetchCategoriesByName, fetchProducts} from "@/API/getRequests";
import {checkTokenExpiration} from "@/functions/authMethods";
import CustomizedPagination from "@/components/CustomizedPagination";
import {useAuth} from "@/functions/authContext";
export default function Home() {
    const router = useRouter();
    const {setNotAdmin, logout} = useAuth();

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const [currentSort, setCurrentSort] = useState('alpha');
    const [options, setOptions] = useState([
        {key: 'alpha', value: 'Alfabetycznie [A-Z]'},
        {key: 'desc_alpha', value: 'Alfabetycznie [Z-A]'},
        {key: 'price_low', value: 'Cena: od najniższej'},
        {key: 'price_high', value: 'Cena: od najwyższej'},
    ]);


    useEffect(() => {

        checkTokenExpiration(router, setNotAdmin, logout);
        getCategoriesAndProducts();
    }, []);
    const handleCategorySelect = (categoryId) => {
        router.push(`/category/${categoryId}`);
    };
    const changePage = async (page) => {
        setPageNumber(page - 1);
        const result = await fetchProducts(page - 1, 12, currentSort);
        setProducts(result['content']);
    };

    async function getCategoriesAndProducts() {
        const categoryResult = await fetchCategoriesByName();
        setCategories(categoryResult['content']);
        const productResult = await fetchProducts(pageNumber, 12, "alpha");
        setProducts(productResult['content']);
        setTotalPages(productResult['totalPages']);
    }

    const changeSort = async (e) => {
        const sortType = e.target.value;
        setCurrentSort(sortType);
        let sortedProducts = [];
        const result = await fetchProducts(pageNumber, 12, sortType);
        sortedProducts = result['content'];
        setProducts(sortedProducts);
    };

    return (
        <>
            <Head>
                <title>Sklep komputerowy</title>
                <meta name="description" content="Aplikacja sklepu komputerowego"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <div className={styles.container}>
                <div className={styles.sidebar}>
                    <ul>
                        {categories.map(category => (
                            <li key={category['categoryId']}>
                                <button
                                    onClick={() => handleCategorySelect(category['categoryId'])}
                                    className={styles.sidebarButton}
                                >
                                    {category.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles.filterAndProductsContainer}>
                    <div className={styles.filterBar}>
                        <div>Sortuj:
                            <select onChange={changeSort}>
                                {options.map(option => (
                                    <option key={option.key} value={option.key}>
                                        {option.value}
                                    </option>
                                ))}
                            </select>
                        </div>
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
                        <CustomizedPagination totalPages={totalPages} onPageChange={changePage}/>
                    </div>
                </div>


            </div>
        </>
    )
}
