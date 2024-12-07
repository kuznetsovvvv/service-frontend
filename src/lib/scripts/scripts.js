
export function admin_validateForm(admin_phone,admin_password) {
    let errorMessage = '';
    const phoneRegex = /^[+]?\d{11,12}$/;

    if (!phoneRegex.test(admin_phone)) {
        errorMessage = 'Phone number must be 11 or 12 digits long.';
        return { isValid: false, errorMessage: errorMessage };
    }
    if (admin_password.length < 1 || admin_password.length > 40) {
        errorMessage = 'Password must be between 1 and 40 characters long.';
        return { isValid: false, errorMessage: errorMessage };
    }

    return { isValid: true, errorMessage: '' };
}


export async function adminhandleSubmit(admin_phone,admin_password) {
    const validation = login_validateForm(admin_phone,admin_password);
    
    if (!validation.isValid) {
        return { success: false, errorMessage: validation.errorMessage }; 
    }

    const Data = {
        phone: admin_phone,
        password: admin_password
    };
    try {
        const response = await fetch('http://localhost:18080/api/v1/login', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Data)
        });

        if (response.ok) {
            return { success: true };
        } else {
            const errorData = await response.json();
            return { success: false, errorMessage: `HTTP error! status: ${response.status}` };
        }
    } catch (error) {
        console.error('Error with login:', error);
        return { success: false, errorMessage: 'An unexpected error occurred.' };
    }
}







export function login_validateForm(phone,password) {
    let errorMessage = '';
    const phoneRegex = /^[+]?\d{11,12}$/;

    if (!phoneRegex.test(phone)) {
        errorMessage = 'Phone number must be 11 or 12 digits long.';
        return { isValid: false, errorMessage: errorMessage };
    }
    if (password.length < 1 || password.length > 40) {
        errorMessage = 'Password must be between 1 and 40 characters long.';
        return { isValid: false, errorMessage: errorMessage };
    }

    return { isValid: true, errorMessage: '' };
}


export async function handleSubmit(phone,password) {
    const validation = login_validateForm(phone,password);
    
    if (!validation.isValid) {
        return { success: false, errorMessage: validation.errorMessage }; 
    }

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
            return { success: true };
        } else {
            const errorData = await response.json();
            return { success: false, errorMessage: `HTTP error! status: ${response.status}` };
        }
    } catch (error) {
        console.error('Error with login:', error);
        return { success: false, errorMessage: 'An unexpected error occurred.' };
    }
}













export function courier_validateForm(courier_age, courier_phone) {
    let courier_errorMessage = '';

    if (isNaN(parseInt(courier_age)) || parseInt(courier_age) <= 0) {
        courier_errorMessage = 'Age must be a positive number.';
        return { isValid: false, errorMessage: courier_errorMessage };
    }
    const phoneRegex = /^[+]?\d{11,12}$/;
    if (!phoneRegex.test(courier_phone)) {
        courier_errorMessage = 'Phone number must be 11 or 12 digits long.';
        return { isValid: false, errorMessage: courier_errorMessage };
    }

    return { isValid: true, errorMessage: '' };
}

export async function courier_handleSubmit(courier_age, courier_gender, courier_phone, courier_active) {
    const validation = courier_validateForm(courier_age, courier_phone);
    
    if (!validation.isValid) {
        return { success: false, errorMessage: validation.errorMessage }; 
    }

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
            return { success: false, errorMessage: `HTTP error! status: ${response.status}` };
        } else {
            return { success: true };
        }
    } catch (error) {
        console.error('Error adding courier:', error);
        return { success: false, errorMessage: 'An unexpected error occurred.' };
    }
}












export function update_courier_validateForm(update_courier_id,update_courier_active) {
   let update_error_message = ''; // Очищаем сообщение об ошибке

    if (isNaN(parseInt(update_courier_id)) || parseInt(update_courier_id) <= 0) {
        update_error_message = 'Courier id must be a positive number.';
        return { isValid: false, errorMessage: update_error_message };
    }
    if(update_courier_active.length>3 || update_courier_active.length === 0){
        update_error_message = 'Courier active status must be either "+" or "-".';
       return { isValid: false, errorMessage: update_error_message };

    }
    return { isValid: true, errorMessage: '' };
}

export async function update_courier_status(update_courier_id,update_courier_active) {
    const validation = update_courier_validateForm(update_courier_id,update_courier_active);
    
    if (!validation.isValid) {
        return { success: false, errorMessage: validation.errorMessage }; 
    }

    const updateData = {
        courier_id: parseInt(update_courier_id),
        active: update_courier_active
    };
    try {
        const response = await fetch('http://localhost:18080/api/v1/couriers', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, errorMessage: `HTTP error! status: ${response.status}` };

        } else {
            alert('Courier status updated successfully!');
            return { success: true };
        }
    } catch (error) {
        console.error('Error adding user:', error);
        return { success: false, errorMessage: 'An unexpected error occurred.' };
    }
}










export function user_validateForm(user_age,user_gender,user_phone,user_password) {
    let user_errorMessage = '';
    const phoneRegex = /^[+]?\d{11,12}$/;
    if (isNaN(parseInt(user_age)) || parseInt(user_age) <= 0) {
        user_errorMessage = 'Age must be a positive number.';
        return { isValid: false, errorMessage: user_errorMessage  };
    } else if(user_gender.length==0 || user_gender.length>3){
        user_errorMessage = 'Gender must be m or f.';
        return { isValid: false, errorMessage: user_errorMessage  };
    }else if (!phoneRegex.test(user_phone)) {
        user_errorMessage = 'Phone number must be 11 or 12 digits long(with + or no).';
        return { isValid: false, errorMessage: user_errorMessage  };
    } else if (user_password.length == 0 || user_password.length > 40) {
        user_errorMessage = 'Password incorrect.';
        return { isValid: false, errorMessage: user_errorMessage  };
    }

    return { isValid: true, errorMessage: '' };
}

export async function user_handleSubmit(user_age, user_gender,user_phone,user_password) {
    const validation = user_validateForm(user_age,user_gender,user_phone,user_password);
    
    if (!validation.isValid) {
        return { success: false, errorMessage: validation.errorMessage }; 
    }
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
            return { success: false, errorMessage: `HTTP error! status: ${response.status}` };
        } else {
            alert('User added successfully!');
            return { success: true };

        }
    } catch (error) {
        console.error('Error adding user:', error);
        return { success: false, errorMessage: 'An unexpected error occurred.' };
    }
}






export function courieraction_validateForm(courier_action_order_id,courier_action_courier_id,courier_action_action) {
    let errorMessagecourieraction = ''; 
    if (isNaN(parseInt(courier_action_order_id)) || parseInt(courier_action_order_id) <= 0) {
        errorMessagecourieraction = 'Order id be a positive number.';
        return { isValid: false, errorMessage: errorMessagecourieraction  };
    } else if (isNaN(parseInt(courier_action_courier_id )) || parseInt(courier_action_courier_id ) <= 0) {
        errorMessagecourieraction = 'Phone number must be 11 or 12 digits long(with + or no).';
        return { isValid: false, errorMessage: errorMessagecourieraction  };
    }

return { isValid: true, errorMessage: '' };
}

export async function courieraction_handleSubmit(courier_action_order_id,courier_action_courier_id,courier_action_action) {
    const validation = courieraction_validateForm(courier_action_order_id,courier_action_courier_id,courier_action_action);
    
    if (!validation.isValid) {
        return { success: false, errorMessage: validation.errorMessage }; 
    }
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
            return { success: false, errorMessage: `HTTP error! status: ${response.status}` };
        } else {
            return { success: true };

        }
    } catch (error) {
        console.error('Error adding user:', error);
        return { success: false, errorMessage: 'An unexpected error occurred.' };
    }
}










export  function update_product_validateForm(update_product_id,update_product_name,update_product_price,update_product_count) {
   let update_product_error_message = ''; // Очищаем сообщение об ошибке


    if(isNaN(parseInt(update_product_id)) || parseInt(update_product_id)<0){
        update_product_error_message = 'Product id must be a positive number.';
        return { isValid: false, errorMessage: update_product_error_message  };
    }
    if (update_product_name.length>30 || update_product_name.length === 0) {
        update_product_error_message = 'Name must be under 30 symbols.';
        return { isValid: false, errorMessage: update_product_error_message  };
    }
    if(isNaN(parseInt(update_product_price)) || parseInt(update_product_price)<0){
        update_product_error_message = 'Price must be a positive number.';
        return { isValid: false, errorMessage: update_product_error_message  };
    }
    if(isNaN(parseInt(update_product_count)) || parseInt(update_product_count)<0){
        update_product_error_message = 'Count must be a positive number.';
        return { isValid: false, errorMessage: update_product_error_message  };
    }

    return { isValid: true, errorMessage: ''  };
}

export async function update_product_handleSubmit(update_product_id,update_product_name,update_product_price,update_product_count) {

    const validation = update_product_validateForm(update_product_id,update_product_name,update_product_price,update_product_count);
    
    if (!validation.isValid) {
        return { success: false, errorMessage: validation.errorMessage }; 
    }
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
            return { success: false, errorMessage: `HTTP error! status: ${response.status}` };
        } else {
            return { success: true };
        }
    } catch (error) {
        console.error('Error adding user:', error);
        return { success: false, errorMessage: 'An unexpected error occurred.' };
    }
}









export function delete_product_validateForm(delete_product_id) {
    let delete_product_message = ''; 

    if(isNaN(parseInt(delete_product_id)) || parseInt(delete_product_id)<0){
        delete_product_message = 'Product id must be a positive number.';
        return { isValid: false, errorMessage: delete_product_message };
    }

    return { isValid: true, errorMessage: ''  };
}

export async function delete_product_handleSubmit(delete_product_id) {
    const validation = delete_product_validateForm(delete_product_id);
    
    if (!validation.isValid) {
        return { success: false, errorMessage: validation.errorMessage }; 
    }
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
            return { success: false, errorMessage: `HTTP error! status: ${response.status}` };
        } else {
            return { success: true };
        }
    } catch (error) {
        console.error('Error adding user:', error);
        return { success: false, errorMessage: 'An unexpected error occurred.' };
    }
}








export function update_user_validateForm(update_user_age,update_user_phone) {
    let update_error_message = ''; 
    const phoneRegex = /^[+]?\d{11,12}$/;
    if (isNaN(parseInt(update_user_age)) || parseInt(update_user_age) <= 0) {
        update_error_message = 'Age must be a positive number.';
        return { isValid: false, errorMessage: update_error_message };
    }
    if (!phoneRegex.test(update_user_phone)) {
        update_error_message = 'Phone number must be 11 or 12 digits long.';
        return { isValid: false, errorMessage: update_error_message };
    }

    return { isValid: true, errorMessage: ''  };
}

export async function update_user_status(update_user_age,update_user_phone,storephone) {
    const validation = update_user_validateForm(update_user_age,update_user_phone);
    
    if (!validation.isValid) {
        return { success: false, errorMessage: validation.errorMessage }; 
    }
    const updateData = {
        age: parseInt(update_user_age),
        phone: update_user_phone,
        old_phone: storephone
    };
    try {
        const response = await fetch('http://localhost:18080/api/v1/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, errorMessage: `HTTP error! status: ${response.status}` };
        } else {
            return { success: true };

        }
    } catch (error) {
        console.error('Error adding user:', error);
        return { success: false, errorMessage: 'An unexpected error occurred.' };
    }
}