import jwt from "jsonwebtoken";
import {sendNotification} from "@/functions/other";

export function checkTokenExpiration(router,setNotAdmin, logout) {

    const token = localStorage.getItem("token");
    if (token) {
        const decodedToken = jwt.decode(token);
        const currentDate = new Date();
        if (decodedToken.exp * 1000 < currentDate.getTime()) {
            sendNotification("Token wygasł, zaloguj się ponownie!");
            setNotAdmin();
            logout();
            localStorage.removeItem("token");
            router.push("/login");
        }
    }
}


