import { useState } from "react";
import { Link } from "react-router-dom";
import GenderCheckbox from "../GenderCheckbox";
import { ADD_USER } from '../../utils/mutations';
import { useMutation } from '@apollo/client';

const SignupForm = () => {
	const [inputs, setInputs] = useState({
		fullName: "",
		username: "",
		password: "",
		confirmPassword: "",
		gender: "",
	});

	const [addUser, { loading, error }] = useMutation(ADD_USER);

	const handleCheckboxChange = (gender) => {
		setInputs({ ...inputs, gender });
	};

	const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs({ ...inputs, [name]: value });
    };

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (inputs.password !== inputs.confirmPassword) {
			alert('Passwords do not match');
		}

		try {
			const { data } = await addUser({
				variables: { ...inputs }
			});
			console.log('Signup Success', data);
		} catch (err) {
			console.error('Signup error', err)
		}
	};

	return (
        <div>
            <h1>Sign Up For Yap</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        <span>Full Name</span>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Full Name"
                            value={inputs.fullName}
                            onChange={handleInputChange}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        <span>Username</span>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={inputs.username}
                            onChange={handleInputChange}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        <span>Password</span>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter Password"
                            value={inputs.password}
                            onChange={handleInputChange}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        <span>Confirm Password</span>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={inputs.confirmPassword}
                            onChange={handleInputChange}
                        />
                    </label>
                </div>

                <GenderCheckbox onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender} />

                <button type="submit" disabled={loading}>
                    {loading ? 'Signing Up...' : 'Sign Up'}
                </button>

                {error && <p>Error signing up: {error.message}</p>}

                <div>
                    <Link to="/login">Login</Link>
                </div>
            </form>
        </div>
    );
};
export default SignupForm;