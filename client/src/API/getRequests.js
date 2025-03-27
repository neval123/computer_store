import jwt from "jsonwebtoken";

export async function fetchCategories(pageNumber, pageSize) {

    try {

        const response = await fetch("http://localhost:8080/api/category?page="+pageNumber+"&size="+pageSize, {
            method: 'GET',

        });
        const result = await response.json();
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function fetchCategoriesByKeyword(keywordId,pageNumber, pageSize) {

    try {

        const response = await fetch("http://localhost:8080/api/category/bykeyword/"+keywordId+"?page="+pageNumber+"&size="+pageSize, {
            method: 'GET',

        });
        const result = await response.json();
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function fetchKeywordsByCategory(categoryId) {

    try {

        const response = await fetch("http://localhost:8080/api/keyword/bycategory/"+categoryId, {
            method: 'GET',

        });
        const result = await response.json();
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function fetchCategoryByProduct(productId) {

    try {

        const response = await fetch("http://localhost:8080/api/category/byproduct/"+productId, {
            method: 'GET',

        });
        const result = await response.json();
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function fetchKeywordsByProduct(productId) {

    try {

        const response = await fetch("http://localhost:8080/api/keyword/byproduct/"+productId, {
            method: 'GET',

        });
        const result = await response.json();
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function fetchProductsBySearchedKeywordName(name) {
    const url = `http://localhost:8080/api/product/bykeyword?name=${name}`;
    try {

        const response = await fetch(url, {
            method: 'GET',

        });
        const result = await response.json();
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function fetchProductsBySearchedName(text,page,size) {
    const url = `http://localhost:8080/api/product/bysearch?name=${text}&page=${page}&size=${size}`;
    try {

        const response = await fetch(url, {
            method: 'GET',

        });
        const result = await response.json();
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function fetchCategoriesByName() {

    try {

        const response = await fetch("http://localhost:8080/api/category/byname", {
            method: 'GET',

        });
        const result = await response.json();
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function fetchCategory(categoryId) {

    try {

        const response = await fetch("http://localhost:8080/api/category/"+categoryId, {
            method: 'GET',

        });
        const result = await response.json();
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function fetchProductsByCategory(categoryId, pageNumber, pageSize, sortType) {

    try {

        const response = await fetch("http://localhost:8080/api/product/bycategory/" + categoryId+"?page="+pageNumber+"&size="+pageSize+"&type="+sortType, {
            method: 'GET',

        });
        const result = await response.json();
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function fetchKeywords(pageNumber, pageSize) {

    try {

        const response = await fetch("http://localhost:8080/api/keyword?page="+pageNumber+"&size="+pageSize, {
            method: 'GET',

        });
        const result = await response.json();
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function fetchKeyword(keywordId) {

    try {

        const response = await fetch("http://localhost:8080/api/keyword/"+keywordId, {
            method: 'GET',

        });
        const result = await response.json();
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function fetchUserData(token) {
    const decode = jwt.decode(token);
    try {

        const response = await fetch("http://localhost:8080/api/user/" + decode['id'], {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
        });
        const result = await response.json();
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function fetchUsersData(pageNumber, pageSize) {
    try {
        const response = await fetch("http://localhost:8080/api/user?page=" + pageNumber + "&size=" + pageSize, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
        });
        const result = await response.json();
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function fetchProduct(productId) {
    try {
        const response = await fetch("http://localhost:8080/api/product/" + productId, {
            method: 'GET'
        });
        const result = await response.json();
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function checkCategoryName(name) {

    try {

        const response = await fetch("http://localhost:8080/api/category/namecheck/"+name, {
            method: 'GET',

        });
        const result = await response.json();
        if(response.status===409) {
            return "error";
        }else{
            return result;
        }
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function checkIfProductAdded(product, orderId, token) {

    const decode = jwt.decode(token);
    const url = `http://localhost:8080/api/item/added?productId=${product[0]['id']}&orderId=${orderId}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        });
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function fetchOrderById(orderId) {
    try {
        const response = await fetch("http://localhost:8080/api/order/" + orderId, {
            method: 'GET',
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
export async function fetchUserCustomerOrders(token) {
    const decode = jwt.decode(token);
    try {

        const response = await fetch("http://localhost:8080/api/order/byuser/" + decode['id'], {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
        });
        const result = await response.json();
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function fetchUserFinishedCustomerOrders(pageNumber, pageSize) {

    const token = localStorage.getItem("token");
    const decode = jwt.decode(token);
    try {

        const response = await fetch("http://localhost:8080/api/order/finished/" + decode['id'] + "?page=" + pageNumber + "&size=" + pageSize, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
        });
        const result = await response.json();
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function fetchProducts(pageNumber, pageSize, type) {
    try {

        const response = await fetch("http://localhost:8080/api/product?page=" + pageNumber + "&size=" + pageSize + "&type=" + type, {
            method: 'GET',
        });
        const result = await response.json();
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function fetchCollectedCustomerOrder(token) {
    const decode = jwt.decode(token);
    try {

        const response = await fetch("http://localhost:8080/api/order/collected/" + decode['id'], {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
        });
        let result = await response.json();
        if (response.status == 404) {
            result = undefined;
        }
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function fetchCollectedCustomerOrderItems(token,page,size) {
    const decode = jwt.decode(token);
    try {

        const response = await fetch("http://localhost:8080/api/item/collected/" + decode['id']+"?page="+page+"&size="+size, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
        });
        let result = await response.json();
        if (response.status == 404) {
            result = undefined;
        }
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function fetchCustomerOrderItemsByOrder(orderId,page=0,size=100) {
    try {

        const response = await fetch("http://localhost:8080/api/item/byorder/" + orderId+"?page="+page+"&size="+size, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
        });
        let result = await response.json();
        if (response.status == 404) {
            result = undefined;
        }
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function fetchAllCustomerOrders(pageNumber, pageSize) {
    try {
        const response = await fetch("http://localhost:8080/api/order?page=" + pageNumber + "&size=" + pageSize, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
        });
        let result = await response.json();
        if (response.status == 404) {
            result = undefined;
        }
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function adminFetchUserFinishedCustomerOrders(id) {
    try {

        const response = await fetch("http://localhost:8080/api/order/finished/" + id, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
        });
        const result = await response.json();
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}
export async function adminFetchUserData(id) {
    try {

        const response = await fetch("http://localhost:8080/api/user/" + id, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
        });
        const result = await response.json();
        return result;
    } catch (e) {
        console.error("Wystąpił błąd: ", e);
    }
}