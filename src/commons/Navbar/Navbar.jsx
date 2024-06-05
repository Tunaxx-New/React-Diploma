import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { UserCard } from '../../components';
import api from '../../apis/api';
import { useAsyncError } from '../../commons';

const Navbar = () => {
    const throwAsyncError = useAsyncError();
    const [formData, setFormData] = useState(undefined);
    useEffect(() => {
        const fetchData = async () => {
            try {
                return await api('/api/private/profile', {
                    method: 'POST',
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            } catch (error) {
                console.log(formData === undefined || formData.id === undefined, "Asd");
                return undefined;
            }
        }
        fetchData().then((data) => setFormData(data));
    }, [])

    const state = useSelector(state => state.handleCart)
    const isLogged = !(formData === undefined || formData.id === undefined);
    return (
        <div className="bg-light">
            <div className="bg-light">
                <nav className="navbar navbar-expand-lg navbar-light sticky-top">
                    <div className="container">
                        <NavLink className="navbar-brand fw-bold fs-4 px-2" to="/"> EcoGreen</NavLink>
                        <button className="navbar-toggler mx-2" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav m-auto my-2 text-center">
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/">Home </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/product">Products</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/about">About</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/contact">Contact</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/profile">Profile</NavLink>
                                </li>
                            </ul>
                            <div className="buttons text-center">
                                {!isLogged ? (
                                    <>
                                        <NavLink to="/login" className="btn btn-outline-dark m-2"><i className="fa fa-sign-in-alt mr-1"></i> Login</NavLink>
                                        <NavLink to="/register" className="btn btn-outline-dark m-2"><i className="fa fa-user-plus mr-1"></i> Register</NavLink>
                                    </>
                                ) : (
                                    <>
                                        <NavLink to="/cart" className="btn btn-outline-dark m-2"><i className="fa fa-cart-shopping mr-1"></i> Cart ({state.length}) </NavLink>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

            </div >
            {isLogged && (
                <div class="container d-flex flex-wrap justify-content-sm-start d-flex justify-content-md-center stick-top">
                    {formData.roles.some(role => role.name === "USER") &&
                        <UserCard imageSource={`./avatars/images/ava_${((formData.id + 20) % 25 + 1).toString().padStart(2, '0')}.gif`} upperText={formData.username ? formData.username : "Unknown"} lowerText="User" link={`/profile?userId=${formData.id}&type=user`}></UserCard>
                    }
                    {formData.buyer &&
                        <UserCard imageSource={`./avatars/images/ava_${(formData.buyer.id % 25 + 1).toString().padStart(2, '0')}.gif`} upperText={formData.buyer.name ? formData.buyer.name : "Unknown"} lowerText="Buyer" link={`/profile?userId=${formData.id}&type=buyer`}></UserCard>
                    }
                    {formData.seller &&
                        <UserCard imageSource={`./avatars/images/ava_${((formData.seller.id + 10) % 25 + 1).toString().padStart(2, '0')}.gif`} upperText={formData.seller.name ? formData.seller.name : "Unknown"} lowerText="Seller" link={`/profile?userId=${formData.id}&type=seller`}></UserCard>
                    }
                    {formData.roles.some(role => role.name === "ADMIN") &&
                        <UserCard imageSource={`./avatars/images/ava_admin.jpg`} upperText={`${formData.username ? formData.username : "Unknown"} ${formData.id}`} lowerText="Admin" link={`/profile?userId=${formData.id}&type=admin`}></UserCard>
                    }
                </div>
            )}
        </div>
    )
}

export default Navbar