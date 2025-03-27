import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Product from "@/components/Product";
import {checkTokenExpiration} from "@/functions/authMethods";
import CustomizedPagination from "@/components/CustomizedPagination";
import {fetchCategoriesByName, fetchProducts, fetchProductsByCategory} from "@/API/getRequests";
import {useAuth} from "@/functions/authContext";
export default function CategoryId() {
    const router = useRouter();
    const { setNotAdmin, logout } = useAuth();

    const [categories, setCategories] = useState([]);
    const { categoryId } = router.query;
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentSort, setCurrentSort] = useState('alpha');
    const [pageNumber, setPageNumber] = useState(0);
    const [options, setOptions] = useState([
        { key: 'alpha', value: 'Alfabetycznie [A-Z]' },
        { key: 'desc_alpha', value: 'Alfabetycznie [Z-A]' },
        { key: 'price_low', value: 'Cena: od najniższej' },
        { key: 'price_high', value: 'Cena: od najwyższej' },
    ]);
    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
        setPageNumber(0);
        router.push(`/category/${categoryId}`);
    };

    const changeSort = async (e) => {
        const sortType = e.target.value;
        setCurrentSort(sortType);
        let sortedProducts = [];
        const result = await fetchProductsByCategory(categoryId, pageNumber, 12, sortType);
        sortedProducts = result['content'];
        setProducts(sortedProducts);
    };
    useEffect(() => {
        checkTokenExpiration(router,setNotAdmin,logout);
        getCategoryAndProducts();
    },[categoryId]);
    const changePage = async (page) =>{
        setPageNumber(page-1);
        const productResult = await fetchProductsByCategory(categoryId,page-1, 12,currentSort);
        setProducts(productResult['content']);
    }
    async function getCategoryAndProducts(){
        const categoryResult = await fetchCategoriesByName();
        setCategories(categoryResult['content']);
        const productResult = await fetchProductsByCategory(categoryId,pageNumber, 12, currentSort);
        setProducts(productResult['content']);
        setTotalPages(productResult['totalPages']);
    }

    return (
        <>
            <Head>
                <title>Sklep komputerowy</title>
                <meta name="description" content="Aplikacja sklepu komputerowego" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.container}>
                <div className={styles.sidebar}>
                    <ul>
                        {categories.map(category => (
                            <li key={category['categoryId']}>
                                <button
                                    onClick={() => handleCategorySelect(category['categoryId'])}
                                    className={categoryId == category['categoryId'] ? styles.activeCategory : styles.sidebarButton}
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
