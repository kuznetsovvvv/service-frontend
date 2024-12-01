import { onMount } from 'svelte';
import { goto } from '$app/navigation';
import { ArrowRightOutline } from 'flowbite-svelte-icons';
import { Card, Button, Rating, Badge } from 'flowbite-svelte';
import { onDestroy } from 'svelte';
import { userStatus } from '../../lib/store/store.js';
import { json } from '@sveltejs/kit';
import { products } from '../../lib/products/products';






//логин пользователя
let phone = '';
let password = '';
let register = true;
let errorMessage = '';
let responce = '';

$: loggedIn = $userStatus.loggedIn;
$: storephone = $userStatus.storephone;
const unsubscribe = userStatus.subscribe((value) => {});

onDestroy(unsubscribe);

function login_validateForm() {
    const phoneRegex = /^[+]?\d{11,12}$/;

    if (!phoneRegex.test(phone)) {
        errorMessage = 'Phone number must be 11 or 12 digits long.';
        return false;
    }
    if (password.length < 1 || password.length > 40) {
        errorMessage = 'Password must be between 1 and 40 characters long.';
        return false;
    }

    return true;
}

async function handleSubmit() {
    if (!login_validateForm()) return;
    const Data = {
        phone: phone,
        password: password
    };
    try {
        const response = await fetch('http://localhost:18080/api/v1/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Data)
        });

        if (response.ok) {
            responce = await response.json();
            userStatus.setLoggedIn(phone);
            phone = '';
            password = '';
            errorMessage = '';
        } else {
            const errorData = await response.json();
            errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
        }
    } catch (error) {
        console.error('Error with login:', error);
        errorMessage = 'An unexpected error occurred.';
    }
}
function registerClicked() {
    register = !register;
}



//создание заказа
let delivery_address = '';
let order_error='';
function order_validateForm() {

if(cart.length==0){
order_error = 'The cart cannot be empty.';
return false;
}

    if (delivery_address.length < 1 || delivery_address.length > 80) {
        order_error = 'Delivery address must be between 1 and 80 characters long.';
        return false;
    }

    return true;
}

async function order_handleSubmit() {
    if (!order_validateForm()) return;
    const Data = {
        old_phone: storephone,
        delivery_address: delivery_address,
        products: cart
    };
    try {
        const response = await fetch('http://localhost:18080/api/v1/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Data)
        });

        if (response.ok) {
            responce = await response.json();
            cart=[];
            productnames=[];
            order_error='';
        } else {
            const errorData = await response.json();
            order_error = errorData.message || `HTTP error! status: ${response.status}`;
        }
    } catch (error) {
        console.error('Error with login:', error);
        order_error = 'An unexpected error occurred.';
    }
}




//добавить курьера
let courier_age = '';
let courier_gender = '';
let courier_phone = '';
let courier_active = '';
let courier_errorMessage = '';

export function courier_validateForm() {
    courier_errorMessage = ''; // Очищаем сообщение об ошибке

    if (isNaN(parseInt(courier_age)) || parseInt(courier_age) <= 0) {
        courier_errorMessage = 'Age must be a positive number.';
        return false;
    }

    const phoneRegex = /^[+]?\d{11,12}$/;
    if (!phoneRegex.test(courier_phone)) {
        courier_errorMessage = 'Phone number must be 11 or 12 digits long.';
        return false;
    }

    return true;
}

export async function courier_handleSubmit() {
    if (!courier_validateForm()) return; 

    const courierData = {
        age: parseInt(courier_age),
        gender: courier_gender,
        phone: courier_phone,
        active: courier_active
    };

    try {
        const response = await fetch('http://localhost:18080/api/couriers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(courierData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            courier_errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
        } else {
            alert('Courier added successfully!');
            courier_age = '';
            courier_gender = '';
            courier_phone = '';
            courier_active = '';
        }
    } catch (error) {
        console.error('Error adding courier:', error);
        courier_errorMessage = 'An unexpected error occurred.';
    }
}





//обновить курьера
let update_courier_id = '';
let update_courier_active = '';
let update_error_message = '';

function update_courier_validateForm() {
    update_error_message = ''; // Очищаем сообщение об ошибке

    if (isNaN(parseInt(update_courier_id)) || parseInt(update_courier_id) <= 0) {
        update_error_message = 'Courier id must be a positive number.';
        return false;
    }
    if(update_courier_active.length>3 || update_courier_active.length === 0){
        update_error_message = 'Courier active status must be either "active" or "inactive".';
        update_error_message = 'Courier id must be a positive number.';
        return false;
    }
    return true;
}

async function update_courier_status() {
    if (!update_courier_validateForm()) return;

    const updateData = {
        courier_id: parseInt(update_courier_id),
        active: update_courier_active
    };
    try {
        const response = await fetch('http://localhost:18080/api/v1/couriers:id', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
        if (!response.ok) {
            const errorData = await response.json();
            update_error_message = errorData.message || `HTTP error! status: ${response.status}`;
        } else {
            alert('Courier status updated successfully!');
            update_courier_id = '';
            update_courier_active = '';
        }
    } catch (error) {
        console.error('Error adding user:', error);
        update_error_message = 'An unexpected error occurred.';
    }
}





//зарегать(добавить пользователя)
let user_age = '';
let user_gender = '';
let user_phone = '';
let user_password = '';
let user_errorMessage = '';

function user_validateForm() {
    user_errorMessage = ''; // Очищаем сообщение об ошибке
    const phoneRegex = /^[+]?\d{11,12}$/;
    if (isNaN(parseInt(user_age)) || parseInt(user_age) <= 0) {
        user_errorMessage = 'Age must be a positive number.';
        return false;
    } else if (!phoneRegex.test(user_phone)) {
        user_errorMessage = 'Phone number must be 11 or 12 digits long(with + or no).';
        return false;
    } else if (user_password.length == 0 || user_password.length > 40) {
        user_errorMessage = 'Password incorrect.';
        return false;
    }

    return true;
}

async function user_handleSubmit() {
    if (!user_validateForm()) return; // Прерываем отправку, если форма не прошла валидацию

    const userData = {
        age: parseInt(user_age),
        gender: user_gender,
        phone: user_phone,
        password: user_password
    };

    try {
        const response = await fetch('http://localhost:18080/api/v1/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            user_errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
        } else {
            alert('User added successfully!');
            user_age = '';
            user_gender = '';
            user_phone = '';
            user_password = '';
        }
    } catch (error) {
        console.error('Error adding user:', error);
        user_errorMessage = 'An unexpected error occurred.';
    }
}






//создать действие курьера
let courier_action_order_id = '';
let courier_action_courier_id = '';
let courier_action_action='';
let errorMassagecourieraction = '';
function courieraction_validateForm() {
    errorMassagecourieraction = ''; 
    if (isNaN(parseInt(courier_action_order_id)) || parseInt(courier_action_order_id) <= 0) {
        errorMassagecourieraction = 'Order id be a positive number.';
        return false;
    } else if (isNaN(parseInt(courier_action_courier_id )) || parseInt(courier_action_courier_id ) <= 0) {
        errorMassagecourieraction = 'Phone number must be 11 or 12 digits long(with + or no).';
        return false;
    }
    if (courier_action_action !== '"transfer"' || courier_action_action !== '"deliver"') {
    errorMassagecourieraction = 'Action must be "transfer" or "deliver".';
    return false;
     }
    return true;
}
async function courieraction_handleSubmit() {
    if (!courieraction_validateForm()) return; 

    const Data = {
        order_id: parseInt(courier_action_order_id),
        courier_id: parseInt(courier_action_courier_id),
        action: courier_action_action
    };

    try {
        const response = await fetch('http://localhost:18080/api/v1/order', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            errorMassagecourieraction = errorData.message || `HTTP error! status: ${response.status}`;
        } else {
            courier_action_order_id = '';
            courier_action_courier_id = '';
            courier_action_action='';
        }
    } catch (error) {
        console.error('Error adding user:', error);
        errorMassagecourieraction = 'An unexpected error occurred.';
    }
}







//посмотреть информацию о продукте
let info_product_name = '';
let info_product_data = '';
let product_error_info = '';
function product_info_validateForm() {
    product_error_info = ''; 
    if (info_product_name.length>30 || info_product_name.length===0) {
        errorMassagecourieraction = 'Product must id be a positive number.';
        return false;
    } 
    return true;
}
async function info_product_handleSubmit() {
    if (!product_info_validateForm()) return;
    try {
        const params = new URLSearchParams();
        params.append('name', info_product_name);
        
        const response = await fetch(`http://localhost:18080/api/v1/product?${params}`);

        if (!response.ok) {
            const errorData = await response.json();
            product_error_info = errorData.message || `HTTP error! status: ${response.status}`;
        } else {
            info_product_data = await response.json();
            product_error_info = '';
        }
    } catch (error) {
        console.error('Error fetching user info:', error);
        product_error_info = 'An unexpected error occurred.';
        info_product_data = '';
    }
}


//обновить информацию о продукте
let update_product_id='';
let update_product_name= '';
let update_product_price = '';
let update_product_count='';
let update_product_error_message = '';

function update_product_validateForm() {
    update_product_error_message = ''; // Очищаем сообщение об ошибке


    if(isNaN(parseInt(update_product_id)) || parseInt(update_product_id)<0){
        update_product_error_message = 'Product id must be a positive number.';
        return false;
    }
    if (update_product_name.length>30 || update_product_name.length === 0) {
        update_product_error_message = 'Name must be under 30 symbols.';
        return false;
    }
    if(isNaN(parseInt(update_product_price)) || parseInt(update_product_price)<0){
        update_product_error_message = 'Price must be a positive number.';
       return false;
    }
    if(isNaN(parseInt(update_product_count)) || parseInt(update_product_count)<0){
        update_product_error_message = 'Count must be a positive number.';
        return false;
    }

    return true;
}

async function update_product_handleSubmit() {
    if (!update_product_validateForm()) return;

    const updateData = {
        product_id: parseInt(update_product_id),
        name: update_product_name,
        price: parseInt(update_product_price),
        count: parseInt(update_product_count)
    };
    try {
        const response = await fetch('http://localhost:18080/api/v1/product', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
        if (!response.ok) {
            const errorData = await response.json();
            update_error_message = errorData.message || `HTTP error! status: ${response.status}`;
        } else {
            update_product_id = '';
            update_product_name = '';
            update_product_price = '';
            update_product_count='';
        }
    } catch (error) {
        console.error('Error adding user:', error);
        update_error_message = 'An unexpected error occurred.';
    }
}



//удалить продукт
let delete_product_id='';
let delete_product_message = '';

function delete_product_validateForm() {
    delete_product_message = ''; // Очищаем сообщение об ошибке

    if(isNaN(parseInt(delete_product_id)) || parseInt(delete_product_id)<0){
        delete_product_message = 'Product id must be a positive number.';
        return false;
    }

    return true;
}

async function delete_product_handleSubmit() {
    if (!delete_product_validateForm()) return;

    const deleteData = {
        product_id: parseInt(delete_product_id)
    };
    try {
        const response = await fetch('http://localhost:18080/api/v1/product', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(deleteData)
        });
        if (!response.ok) {
            const errorData = await response.json();
            delete_product_message = errorData.message || `HTTP error! status: ${response.status}`;
        } else {
            delete_product_id
        }
    } catch (error) {
        console.error('Error adding user:', error);
        delete_product_message = 'An unexpected error occurred.';
    }
}




