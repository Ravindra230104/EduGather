import cookie from 'js-cookie'
import Router from 'next/router'


// set in cookie
export const setCookie = (key,value) => {
    if(typeof window !== 'undefined'){
        cookie.set(key,value,{
            expires:1
        })
    }
}


// remove from cookie
export const removeCookie = (key) => {
    if(typeof window !== 'undefined'){
        cookie.remove(key)
    }
}


// get from cookie such as stored token

export const getCookie = (key, req) => {
    if (typeof window !== 'undefined') {
        return getCookieFromBrowser(key);
    } else {
        return getCookieFromServer(key, req);
    }
};

export const getCookieFromBrowser = (key) => {
    // Ensure 'cookie' is imported correctly and is used appropriately
    return cookie.get(key) || undefined;
};

export const getCookieFromServer = (key, req) => {
    if (!req.headers.cookie) {
        return undefined;
    }

    const cookies = req.headers.cookie.split(';');
    const token = cookies.find(c => c.trim().startsWith(`${key}=`));
    console.log('getCookieFromServer: Token found in cookies:', token);
    
    if (!token) {
        return undefined;
    }

    const tokenValue = token.split('=')[1];
    return tokenValue;
};





// set in localstorage
export const setLocalStorage = (key,value) => {
    if(typeof window !== 'undefined'){
        localStorage.setItem(key,JSON.stringify(value))
    }
}


// remove from localstorage
export const removeLocalStorage = (key) => {
    if(typeof window !== 'undefined'){
        localStorage.removeItem(key)
    }
}


// authenticate user by passing data to cookie and locakstorage during signin
export const authenticate = (response,next) => {
    setCookie('token',response.data.token)
    setLocalStorage('user',response.data.user)
    next()
}


// access user info from localstorage
export const isAuth = () => {
    if(typeof window !== 'undefined'){
        const cookieChecked = getCookie('token')
        if(cookieChecked){
            if(localStorage.getItem('user')){
                return JSON.parse(localStorage.getItem('user'))
            }else{
                return false;
            }
        }
    }
}


export const logout = () => {
    removeCookie('token')
    removeLocalStorage('user')
    Router.push('/login');
}


export const updateUser = (user, next) => {
    if(process.browser){
        if(localStorage.getItem('user')){
            let auth = JSON.parse(localStorage.getItem('user'))
                auth = user
                localStorage.setItem('user',JSON.stringify(auth))
                next()
            
        }
    }
}