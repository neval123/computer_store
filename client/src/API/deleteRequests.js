import jwt from "jsonwebtoken";

export async function deleteCategory(categoryId){

    try {
        const response = await fetch("http://localhost:8080/api/category/" + categoryId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        });
        if (response.ok) {
            return "Usunieto kategorie";
        } else {
            return "error";
        }
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function deleteKeyword(keywordId){

    try {

        const response = await fetch("http://localhost:8080/api/keyword/" + keywordId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }

        });
        if (response.ok) {
            return "Usunieto slowo kluczowe";
        } else {
            return  "error";
        }
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function deleteUser(userId){

    try {

        const response = await fetch("http://localhost:8080/api/user/" + userId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }

        });
        if (response.ok) {
            return "Usunieto uzytkownika";
        } else {
            return  "error";
        }
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function deleteProduct(productId){

    try {
        const response = await fetch("http://localhost:8080/api/product/" + productId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        });
        if (response.ok) {
            return "Usunieto produkt";
        } else {
            return  "error";
        }
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function deleteCustomerOrderItem(itemId) {
    try {

        const response = await fetch("http://localhost:8080/api/item/" + itemId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }

        });
        const result = await response.json();
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function deleteCustomerOrder(orderId) {
    try {

        const response = await fetch("http://localhost:8080/api/order/" + orderId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        });
        if (response.ok) {
            return "Usunieto zamowienie";
        } else {
            return  "error";
        }
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function deleteCustomerOrderWithItems(orderId) {
    try {

        const response = await fetch("http://localhost:8080/api/order/withitems/" + orderId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        });
        if (response.ok) {
            return "Usunieto zamowienie i jego elementy";
        } else {
            return  "error";
        }
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}