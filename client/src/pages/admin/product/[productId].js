import Head from 'next/head'
import {Inter} from 'next/font/google'
import styles from '@/styles/admin.product.module.css'
import {useEffect, useState} from "react";
import {
    fetchCategoriesByName, fetchCategoryByProduct,
    fetchKeywordsByCategory,
    fetchKeywordsByProduct,
    fetchProduct, fetchUserData
} from "@/API/getRequests";
import {useRouter} from "next/router";
import {checkTokenExpiration} from "@/functions/authMethods";
import {updateProduct} from "@/API/putRequests";
import {useAuth} from "@/functions/authContext";
import CustomizedSelect from "@/components/CustomizedSelect";
import {createImage} from "@/API/postRequests";


function AdminProductIdPage() {
    const router = useRouter();
    const [editing, setEditing] = useState(false);
    const {productId} = router.query;
    const {isAdmin, setNotAdmin, logout} = useAuth();

    const [productName, setProductName] = useState(null);
    const [productPrice, setProductPrice] = useState(null);
    const [productImageUrl, setProductImageUrl] = useState('');
    const [productImage, setProductImage] = useState(null);
    const [productDescription, setProductDescription] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const [categoryKeywords, setCategoryKeywords] = useState([]);
    const [productKeywords, setProductKeywords] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        checkTokenExpiration(router, setNotAdmin, logout);
        checkAdminStatus();

    }, [productId]);
    const checkAdminStatus = async () => {
        const adminCheck = await getUserInfo();
        if (isAdmin || adminCheck) {
            if (productId) {
                getCategories();
                getProduct();
                getProductsCategory();
                getKeywordsByProduct(productId);
            }

        } else {
            router.back();
        }
    };
    const getUserInfo = async () => {
        const result = await fetchUserData(localStorage.getItem("token"));
        if (result['role'] == "ADMIN") {
            return true;
        } else {
            return false;
        }
    }
    const modifyProduct = async (e) => {
        e.preventDefault();
        if (editing) {
            let formattedKeywords = [];
            if(productKeywords.length > 0){
                formattedKeywords = productKeywords.map(keyword => {
                    return {keywordId: keyword.value, name: keyword.label};
                });
            }
            await updateProduct(productId, productName, productPrice, productDescription, productImageUrl, categoryId, formattedKeywords);
            if(productImage!=null){
                await createImage(productImage, productId);
            }
        }
        setEditing(!editing);
    }
    const getProductsCategory = async () => {
        const result = await fetchCategoryByProduct(productId);
        setCategoryId(result['categoryId']);
        await getKeywordsByCategory(result['categoryId']);

    }
    const getCategories = async () => {
        const result = await fetchCategoriesByName();
        setCategories(result['content']);
    }
    const getKeywordsByCategory = async (categoryId) => {
        const result = await fetchKeywordsByCategory(categoryId);
        if (result !== undefined) {
            setCategoryKeywords(result['content']);
        }
    }
    const getKeywordsByProduct = async (productId) => {
        const result = await fetchKeywordsByProduct(productId);
        const formattedKeywords = result['content'].map((keyword) => ({
            value: keyword.keywordId,
            label: keyword.name,
        }));
        setProductKeywords(formattedKeywords);
    };
    const getProduct = async () => {
        const result = await fetchProduct(productId);
        setProductName(result['name']);
        setProductDescription(result['description']);
        setProductPrice(result['price']);
        setProductImageUrl(result['image']);
    }
    const handleKeywordSelection = (selectedOptions) => {
        const selectedKeywords = selectedOptions.map(option => ({
            value: option.value,
            label: option.label
        }));
        setProductKeywords(selectedKeywords);
    };
    const handleCategorySelection = async (e) => {
        setCategoryId(e.target.value);
        await getKeywordsByCategory(e.target.value);
    }
    const keywordOptions = categoryKeywords.map(keyword => ({
        value: keyword.keywordId,
        label: keyword.name
    }));
    return (
        <>
            <Head>
                <title>Produkt</title>
                <meta name="description" content="Aplikacja sklepu komputerowego"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <div className={styles.buttons}>
                <button onClick={() => router.back()}>Powrót</button>
            </div>
            <div className={styles.body}>

                <div>
                    <form onSubmit={modifyProduct} className={styles.form}>
                        <h3>Zmodyfikuj produkt:</h3>
                        <div className={styles.formRow}>

                            <div>
                                <label htmlFor="name">Nazwa:</label>
                                <input
                                    type="text"
                                    id="name"
                                    onChange={(e) => setProductName(e.target.value)}
                                    value={productName}
                                    required
                                    disabled={!editing}

                                />
                            </div>
                            <div>
                                <label htmlFor="description">Opis:</label>
                                <textarea
                                    type="text"
                                    id="description"
                                    onChange={(e) => setProductDescription(e.target.value)}
                                    required
                                    disabled={!editing}
                                    value={productDescription}
                                />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div>
                                <label htmlFor="image">Obraz:</label>
                                <input
                                    type="file"
                                    id="image"
                                    onChange={(e) => setProductImage(e.target.files[0])}
                                    disabled={!editing}

                                />
                            </div>

                            <div>
                                <label htmlFor="imageUrl">Adres obrazu:</label>
                                <input
                                    type="text"
                                    id="imageUrl"
                                    onChange={(e) => setProductImageUrl(e.target.value)}
                                    required
                                    disabled={!editing}
                                    value={productImageUrl}
                                />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div>
                                <label htmlFor="category">Kategoria:</label>

                                <select className={styles.categoryContainer} id="category"
                                        onChange={(e) => handleCategorySelection(e)}
                                        required disabled={!editing}
                                        value={categoryId}
                                >
                                    {categories.map(category => (
                                        <option key={category.categoryId} value={category.categoryId}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.keywordContainer}>
                                <label htmlFor="keyword">Słowa kluczowe:</label>
                                <div className={styles.keywordChoose}>
                                    <CustomizedSelect
                                        isMulti
                                        value={productKeywords}
                                        options={keywordOptions}
                                        isDisabled={!editing}
                                        onChange={(selectedOptions) => handleKeywordSelection(selectedOptions)}
                                        placeholder="Wybierz słowa kluczowe..."
                                    />
                                </div>
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
                                    disabled={!editing}
                                    value={productPrice}
                                />
                            </div>
                        </div>
                        <div>
                            <button className={styles.basicButton}
                                    type="submit">{editing ? 'Zapisz zmiany' : 'Zmodyfikuj'}</button>

                        </div>


                    </form>
                </div>

            </div>

        </>
    )
}

export default AdminProductIdPage;