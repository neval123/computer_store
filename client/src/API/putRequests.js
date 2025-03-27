import jwt from "jsonwebtoken";

export async function updateCategory(categoryId,name,keywords) {

    try {

        const response = await fetch("http://localhost:8080/api/category/"+categoryId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
            body:JSON.stringify({
                'categoryId':categoryId,
                'name': name,
                keywords
            })
        });
        const result = await response.json();
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function updateKeyword(keywordId,name) {

    try {

        const response = await fetch("http://localhost:8080/api/keyword/"+keywordId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
            body:JSON.stringify({
                'keywordId':keywordId,
                'name': name
            })
        });
        const result = await response.json();
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function updateProduct(productId,name,price,description,image,categoryId, keywords) {

    try {

        const response = await fetch("http://localhost:8080/api/product/" + productId+"?categoryId="+categoryId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
            body:JSON.stringify({
                'productId': productId,
                'name': name,
                'price' : price,
                'image' : image,
                'description' : description,
                keywords
            })

        });
        const result = await response.json();
        //return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function updateUserData(name, lastName, street, streetNumber, apartmentNumber, city, postalCode, phoneNumber, token) {
    const decode = jwt.decode(token);
    try {

        const response = await fetch("http://localhost:8080/api/user/" + decode['id'], {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
            body: JSON.stringify({
                'name': name,
                'lastName': lastName,
                'street': street,
                'streetNumber': streetNumber,
                'apartmentNumber': apartmentNumber,
                'city': city,
                'postalCode': postalCode,
                'phoneNumber': phoneNumber
            })

        });
        const result = await response.json();
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function payCustomerOrder(totalPrice, token) {
    const decode = jwt.decode(token);
    try {
        const response = await fetch("http://localhost:8080/api/order/pay/" + decode['id'], {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
            body: JSON.stringify({
                'totalPrice': totalPrice,
                'user': {
                    'userId': decode['id']
                }
            })
        });
        const result = await response.json();
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function updateCustomerOrderFinalization(orderId, status) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch("http://localhost:8080/api/order/finalize/" + orderId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({orderId, 'status': status})
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Błąd:', error);
    }
}
export async function updateCustomerOrderItemQuantityAndPrice(itemId, quantity, price, token) {
    try {
        const response = await fetch("http://localhost:8080/api/item/updatequantityandprice", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({itemId, quantity, price})
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Błąd to:', error);
    }
}
export async function cancelCustomerOrder(orderId, token) {
    const decode = jwt.decode(token);
    try {

        const response = await fetch("http://localhost:8080/api/order/" + orderId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
            body: JSON.stringify({
                'user': {
                    'userId': decode['id']
                },
                'status': 'CANCELED'
            })

        });
        const result = await response.json();
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function updateCustomerOrderTotalPrice(orderId, totalPrice, token) {
    try {
        const response = await fetch("http://localhost:8080/api/order/" + orderId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({orderId, totalPrice, 'status': 'COLLECTED'})
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}

export async function adminUpdateCustomerOrderTotalPrice(orderId, totalPrice, token) {
    try {
        const response = await fetch("http://localhost:8080/api/order/admin/" + orderId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({orderId, totalPrice, 'status': 'PAID'})
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}
export async function adminUpdateUserData(name, lastName, email, street, streetNumber, apartmentNumber, city, postalCode, phoneNumber, id, role) {
    try {
        const response = await fetch("http://localhost:8080/api/user/" + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
            body: JSON.stringify({
                'name': name,
                'lastName': lastName,
                'street': street,
                'streetNumber': streetNumber,
                'apartmentNumber': apartmentNumber,
                'city': city,
                'postalCode': postalCode,
                'phoneNumber': phoneNumber,
                'role': role
            })

        });
        const result = await response.json();
        console.log(result);
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}