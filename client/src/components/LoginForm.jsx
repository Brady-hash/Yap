import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../utils/mutations';
import Auth from '../utils/auth';

const LoginForm = () => {
    const [userFormData, setUserFormData] = useState({ email: '', password: '' });
    const [showAlert, setShowAlert] = useState(false);
    const [login, { error }] = useMutation(LOGIN);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserFormData({ ...userFormData, [name]: value });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            const { data } = await login({
                variables: {...userFormData}
            });

            console.log(data.login.token)

            Auth.login(data.login.token);
            setShowAlert(false);
        } catch (err) {
            console.error(err);
            setShowAlert(true);
        }

        setUserFormData({ email: '', password: '' });
    };

    return (
        <div>
            {showAlert && (
                <div style={{ backgroundColor: 'red', color: 'white', padding: '10px' }}>
                    {error ? error.message : 'Something went wrong with your login credentials!'}
                </div>
            )}
            <form noValidate onSubmit={handleFormSubmit}>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input
                        type='text'
                        id='email'
                        name='email'
                        placeholder='Your email'
                        onChange={handleInputChange}
                        value={userFormData.email}
                        required
                    />
                </div>

                <div>
                    <label htmlFor='password'>Password</label>
                    <input
                        type='password'
                        id='password'
                        name='password'
                        placeholder='Your password'
                        onChange={handleInputChange}
                        value={userFormData.password}
                        required
                    />
                </div>
                <button
                    disabled={!userFormData.email || !userFormData.password}
                    type='submit'>
                    Submit
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
