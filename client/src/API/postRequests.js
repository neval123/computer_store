import jwt from "jsonwebtoken";

export async function createCategory(categoryName, keywords) {
    try {
        const response = await fetch("http://localhost:8080/api/category" , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
            body:JSON.stringify({
                'name': categoryName,
                keywords
            })

        });
        const result = await response.json();
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function createKeyword(keywordName) {

    try {
        const response = await fetch("http://localhost:8080/api/keyword" , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
            body:JSON.stringify({
                'name': keywordName
            })

        });
        const result = await response.json();
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function createImage(image, productId) {
    const formData = new FormData();
    formData.append('image', image);

    try {
        const response = await fetch("http://localhost:8080/api/product/image/"+productId , {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
            body: formData
        });
        const result = await response.json();//.json();
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function createProduct(name,price,description, categoryId, keywords) {

    try {
        const response = await fetch("http://localhost:8080/api/product?categoryId="+categoryId , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
            body:JSON.stringify({
                'name': name,
                'description': description,
                'price': price,
                keywords
            })

        });
        const result = await response.json();
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function createCustomerOrder(product, token) {
    const decode = jwt.decode(token);
    try {
        const response = await fetch("http://localhost:8080/api/order", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
            body: JSON.stringify({
                'totalPrice': product[0]['price'],
                'user': {
                    'userId': decode['id']
                },
                'status': 'COLLECTED'
            })

        });
        const result = await response.json();
        if (response.status === 201) {
            const orderId = result['orderId'];
            return orderId;
        } else {
            return undefined;
        }
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function createCustomerOrderItem(product, orderId, token, quantity) {

    try {
        const response = await fetch("http://localhost:8080/api/item", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
            body: JSON.stringify({
                'price': product[0]['price'] * quantity,
                'product': {
                    'productId': product[0]['id']
                },
                'customerOrder': {
                    'orderId': orderId
                },
                'quantity': quantity

            })
        });
        const result = await response.json();
        return result;

    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function createUser(name, lastName, email, password, role) {
    const userData = {
        email: email,
        password: password,
        name: name,
        lastName: lastName,
        role: role
    };
    try {
        const response = await fetch('http://localhost:8080/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
            body: JSON.stringify(userData),
        });
        if (response.ok) {
            const result = await response.json();
        } else {
            throw new Error('Tworzenie uzytkownika nie powiodło się');
        }
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
};