import Head from 'next/head'
import {Inter} from 'next/font/google'
import styles from '@/styles/cart.module.css'
import {useEffect, useState} from "react";
import {useRouter} from 'next/router';
import Link from "next/link";
import Image from "next/image";
import {checkTokenExpiration} from "@/functions/authMethods";
import {useAuth} from "@/functions/authContext";
import {sendNotification} from "@/functions/other";
import {fetchCollectedCustomerOrder, fetchCollectedCustomerOrderItems, fetchProducts} from "@/API/getRequests";
import {deleteCustomerOrder, deleteCustomerOrderItem} from "@/API/deleteRequests";
import {
    cancelCustomerOrder,
    updateCustomerOrderItemQuantityAndPrice,
    updateCustomerOrderTotalPrice
} from "@/API/putRequests";
import CustomizedPagination from "@/components/CustomizedPagination";

function CartPage() {
    const [orderData, setOrderData] = useState([]);
    const [products, setProducts] = useState([]);
    const [productInCart, setProductInCart] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const {setNotAdmin, logout} = useAuth();
    const [totalPages, setTotalPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const router = useRouter();
    const backendUrl = "http://localhost:8080";

    useEffect(() => {
        checkTokenExpiration(router, setNotAdmin, logout);
        getCurrentOrderInfo();
    }, []);
    async function getOrderItems(pageNumber){
        if(pageNumber>=0){
            const result = await fetchCollectedCustomerOrderItems(localStorage.getItem("token"), pageNumber, 5);
            setTotalPages(result['totalPages']);
            const newProducts = result['content'].map(item => ({
                image: item['product']['image'],
                name: item['product']['name'],
                price: item['product']['price'],
                itemId: item['itemId'],
                quantity: item['quantity']
            }));

            setProducts(newProducts);
        }
    }
    async function getCurrentOrderInfo() {
        if (localStorage.getItem("token")) {
            try {
                const result = await fetchCollectedCustomerOrder(localStorage.getItem("token"));
                setTotalPrice(result['totalPrice']);
                setOrderData(result);
                if (result == undefined) {
                    setProductInCart(false);
                    await sendNotification("Brak produktów w koszyku!");
                } else {
                    setProductInCart(true);
                    await getOrderItems(pageNumber);
                }
            } catch (error) {
                console.error("Błąd: ", error);
            }

        } else {
            router.push("/login").then(async () => {
                await sendNotification("Zaloguj się!");
            });
        }
    }


    const changePage = async (page) => {
        await updateCustomerOrderTotalPrice(orderData['orderId'], totalPrice, localStorage.getItem("token"));
        await getOrderItems(page - 1);
        setPageNumber(page - 1);
    };
    const removeProductFromCart = async (itemId) => {
        const result = await deleteCustomerOrderItem(itemId);

        const updatedProducts = products.filter(product => product.itemId !== itemId);
        const deletedProduct = products.find(product => product.itemId === itemId);

        setProducts(updatedProducts);
        setTotalPrice(parseFloat((totalPrice - deletedProduct['price'] * deletedProduct['quantity']).toFixed(2)));

        await updateCustomerOrderTotalPrice(orderData['orderId'], totalPrice, localStorage.getItem("token"));

        if (updatedProducts.length === 0) {
            if (pageNumber > 0) {
                const page = pageNumber - 1;
                setPageNumber(page);
                await getOrderItems(pageNumber > 0 ? pageNumber - 1 : 0);
            }else{
                setProductInCart(false);
                setProducts([]);
                await deleteCustomerOrder(orderData['orderId']);
            }
        }
        await sendNotification("Usunięto produkt z koszyka");
    }
    const changeAmount = async (itemId, newQuantity) => {
        if(newQuantity > 0 && newQuantity < 100){
            const productToUpdate = products.find(item => item.itemId === itemId);
            const productPrice = productToUpdate ? productToUpdate.price : null;
            const oldQuantity = productToUpdate ? productToUpdate.quantity : null;

            if (productPrice != null && oldQuantity != null) {
                await updateCustomerOrderItemQuantityAndPrice(itemId, newQuantity, productPrice * newQuantity, localStorage.getItem("token"));
                setProducts(products.map(product =>
                    product.itemId === itemId ? {...product, quantity: newQuantity} : product
                ));
                const price = parseFloat((totalPrice - productPrice * oldQuantity + productPrice * newQuantity).toFixed(2));
                setTotalPrice(price);
                await updateCustomerOrderTotalPrice(orderData['orderId'], price, localStorage.getItem("token"));
            }
        }



    };
    return (
        <>
            <Head>
                <title>Koszyk</title>
                <meta name="description" content="Aplikacja sklepu komputerowego"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            {productInCart ? (
                <div className={styles.body}>
                    <h4>Twój koszyk:</h4>
                    <table>
                        <thead>
                        <tr>
                            <th>Zdjęcie</th>
                            <th>Produkt</th>
                            <th>Ilość</th>
                            <th>Cena</th>
                            <th>Usuń</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((row, index) => (
                            <tr key={index}>
                                <td><Image src={`${backendUrl}${row.image}`} alt={''} height={100} width={100}/></td>
                                <td>{row.name} </td>
                                <td>
                                    <input
                                        type="number"
                                        min="1"
                                        max="99"
                                        value={row.quantity}
                                        onChange={(e) => changeAmount(row.itemId, e.target.value)}
                                    />
                                </td>
                                <td>{(row.price * row.quantity).toFixed(2)} zł</td>
                                <td>
                                    <button
                                        onClick={() => removeProductFromCart(row.itemId, localStorage.getItem("token"))}
                                        className={styles.fullButton}><Image src={"/trash.png"} alt={''} height={25}
                                                                             width={25}/></button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className={styles.paginationContainer}>
                        <CustomizedPagination totalPages={totalPages} onPageChange={changePage}/>
                    </div>
                    <div>
                        <h4>Łączna kwota: {totalPrice} zł</h4>
                    </div>
                    <button onClick={() => router.push("/checkout")}>Przejdź do podsumowania</button>

                    <h5>lub...</h5>
                    <Link href={"/"}>Kontynuuj zakupy</Link>
                </div>
            ) : (
                <div className={styles.centeredContent}>
                    <h2>Brak produktów w koszyku...</h2>
                    <Link href={"/"}>Sprawdź naszą ofertę!</Link>
                </div>
            )}


        </>
    )
}

export default CartPage;