import React, { useState } from "react";
import apiHelper from "../helpers/api-helper";
import DEVELOPMENT_CONFIG from "../helpers/config";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import ERROR_MESSAGE from "../helpers/error-helper";

export default function Signup() {
    const [fields, setFields] = useState({
        name: "",
        email: "",
        password: "",
    })
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const success = (msg) => {
        toast.success(msg, {
            autoClose: 5000,
        });
    };

    const handleChange = (e) => {
        setError("");
        const name = e.target.name;
        const value = e.target.value;
        setFields({
            ...fields,
            [name]: value,
        });
    };

    const handleValidation = () => {
        let errors = {};
        let formIsValid = true;
        const { name, email, password } = fields;

        if (!name || name.trim().length === 0) {
            formIsValid = false;
            errors["name"] = ERROR_MESSAGE.EMPTY_NAME;
        }

        if (!email || email.trim().length === 0) {
            formIsValid = false;
            errors["email"] = ERROR_MESSAGE.EMPTY_EMAIL;
        }

        if (!password || password.trim().length === 0) {
            formIsValid = false;
            errors["password"] = ERROR_MESSAGE.EMPTY_PASSWORD;
        }
        setError(errors);
        return formIsValid;
    };

    // SIGNUP USER
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!handleValidation()) {
            return;
        }
        setError("");
        let data = JSON.stringify({
            name: fields?.name,
            email: fields?.email,
            password: fields?.password,
        });
        let result = await apiHelper.postRequest("sign-up", data);
        if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
            navigate("/");
            success(result?.message);
        } else {
            setError(result?.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-between min-h-80 m-16">
            <div className="flex justify-between">
                <p className="text-2xl font-bold text-gray-600 text-center">Log In</p>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-600">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={fields.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter your name"
                    />
                    {error?.name && <p className="text-red-500 text-sm">{error?.name}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={fields.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter your email"
                    />
                    {error?.email && <p className="text-red-500 text-sm">{error?.email}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={fields.password}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter your password"
                    />
                    {error?.password && <p className="text-red-500 text-sm">{error?.password}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
                >
                    Signup
                </button>
                <p className="text-center text-sm text-gray-600">
                    Already have an account? <Link to="/" className="text-blue-600 font-semibold">Log In</Link>
                </p>
            </form>
            <ToastContainer rtl />
        </div>
    );
}
