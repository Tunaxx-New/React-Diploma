import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../apis/api";
import { useAsyncError } from '../commons';
import { Table } from "../components";

const UpdPageProfile = ({ userId, type }) => {
  const [formData, setFormData] = useState({
  });
  const [activeSetting, setActiveSetting] = useState(type);
  const [successMessage, setSuccessMessage] = useState(undefined);
  const throwAsyncError = useAsyncError();

  const handleSetActiveSetting = (setting) => {
    const tabs = document.querySelectorAll('.list-group-item');
    tabs.forEach(tab => {
      if (tab.id === `tab-${setting}`) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    setActiveSetting(setting);
  };

  useEffect(() => {
    setActiveSetting(type);
    const fetchData = async () => {
      try {
        const data = await api('/api/private/profile', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        });

        setFormData(data);
      } catch (error) {
        throwAsyncError(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    handleSetActiveSetting(activeSetting);
  }, []);

  const [errors, setErrors] = useState({});

  function dateToFull(dateString) {
    const date = new Date(dateString);
    // Extract the date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1; padStart ensures two digits
    const day = String(date.getDate()).padStart(2, '0'); // padStart ensures two digits

    // Extract the time components
    const hours = String(date.getHours()).padStart(2, '0'); // padStart ensures two digits
    const minutes = String(date.getMinutes()).padStart(2, '0'); // padStart ensures two digits
    const seconds = String(date.getSeconds()).padStart(2, '0'); // padStart ensures two digits
    const milliseconds = String(date.getMilliseconds()).padStart(6, '0'); // padStart ensures three digits

    // Create the formatted date string
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
    return formattedDate;
  }

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    // Split the name attribute value by dot
    const nameParts = name.split('.');

    // Check if there are multiple parts (nested property)
    if (nameParts.length > 1) {
      // Create a nested object structure
      const nestedObject = {
        [nameParts.slice(1).join('.')]: type === "checkbox" ? checked : type === "date" ? dateToFull(value) : value
      };

      // Check if buyer already exists in formData
      if (formData[`${activeSetting}`]) {
        // If buyer exists, update the nested property
        setFormData({
          ...formData,
          [activeSetting]: {
            ...formData[`${activeSetting}`],
            ...nestedObject
          }
        });
      } else {
        // If buyer doesn't exist, create it as an object and set the nested property
        setFormData({
          ...formData,
          [activeSetting]: {
            ...nestedObject
          }
        });
      }
    } else {
      // If it's not a nested property, update directly
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : type === "date" ? dateToFull(value) : value
      });
    }

  };

  const validate = (formData) => {
    const newErrors = {};
    const lengthRegex = /^.{3,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!lengthRegex.test(formData.name)) {
      newErrors.firstName = "First name must be at least 3 characters long.";
    }

    if (!lengthRegex.test(formData.surname)) {
      newErrors.lastName = "Last name must be at least 3 characters long.";
    }

    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Email is not valid.";
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate(formData.buyer);
    if (Object.keys(validationErrors).length === 0) {
      try {
        await api(`/api/private/${activeSetting}/profile/change`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData[`${activeSetting}`])
        });

        document.querySelector('.success-message').style.animation = 'animation: fadeInOut 2s linear';
        setSuccessMessage(`Your ${activeSetting} updated successfuly!`);
        setTimeout(() => {
          setSuccessMessage(undefined);
        }, 2000);

      } catch (error) {
        console.log(error);
        throwAsyncError(error);
      }
    } else {
      setErrors(validationErrors);
    }
  }

  /*
  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      const message = `
        First Name: ${formData.firstName}\n
        Last Name: ${formData.lastName}\n
        Email: ${formData.email}\n
        Phone: ${formData.phone}\n
        Subscribe: ${formData.subscribe ? "Yes" : "No"}
      `;
      alert(message);
      // Updating state to force re-render
      setFormData({ ...formData });
    } else {
      setErrors(validationErrors);
    }

  };
  */

  // enable server
  // const handleSubmit = () => {
  //   const validationErrors = validate();
  //   if (Object.keys(validationErrors).length === 0) {
  //     // Отправка на сервер Изменение профиля
  //    const response = await fetch(http://localhost:8080/api/private/buyer/change/,  {
  //         method: "GET",
  //         // mode: "cors",
  //         headers: {
  //           "Authorization": token_,
  //           "Content-Type": "application/json",
  //         },
  //        body: {
  //         "id": 0,
  //         "name": ${formData.firstName},
  //          ....
  //       }
  //       });
  //    //
  //     setFormData({ ...formData });
  //   } else {
  //     setErrors(validationErrors);
  //   }
  // };


  return (
    <div>
      <div className={`success-message ${successMessage ? 'animate' : ''}`} style={{ opacity: 0 }}>{successMessage}</div>
      {formData.id &&
        <div>
          <style>
            {`body{
    background:#eee;    
}
.widget-author {
  margin-bottom: 58px;
}
.author-card {
  position: relative;
  padding-bottom: 48px;
  background-color: #fff;
  box-shadow: 0 12px 20px 1px rgba(64, 64, 64, .09);
}
.author-card .author-card-cover {
  position: relative;
  width: 100%;
  height: 100px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.author-card .author-card-cover::after {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  content: '';
  opacity: 0.5;
}
.author-card .author-card-cover > .btn {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 0 10px;
}
.author-card .author-card-profile {
  display: table;
  position: relative;
  margin-top: -22px;
  padding-right: 15px;
  padding-bottom: 16px;
  padding-left: 20px;
  z-index: 5;
}
.author-card .author-card-profile .author-card-avatar, .author-card .author-card-profile .author-card-details {
  display: table-cell;
  vertical-align: middle;
}
.author-card .author-card-profile .author-card-avatar {
  width: 85px;
  border-radius: 50%;
  box-shadow: 0 8px 20px 0 rgba(0, 0, 0, .15);
  overflow: hidden;
}
.author-card .author-card-profile .author-card-avatar > img {
  display: block;
  width: 100%;
}
.author-card .author-card-profile .author-card-details {
  padding-top: 20px;
  padding-left: 15px;
}
.author-card .author-card-profile .author-card-name {
  margin-bottom: 2px;
  font-size: 14px;
  font-weight: bold;
}
.author-card .author-card-profile .author-card-position {
  display: block;
  color: #8c8c8c;
  font-size: 12px;
  font-weight: 600;
}
.author-card .author-card-info {
  margin-bottom: 0;
  padding: 0 25px;
  font-size: 13px;
}
.author-card .author-card-social-bar-wrap {
  position: absolute;
  bottom: -18px;
  left: 0;
  width: 100%;
}
.author-card .author-card-social-bar-wrap .author-card-social-bar {
  display: table;
  margin: auto;
  background-color: #fff;
  box-shadow: 0 12px 20px 1px rgba(64, 64, 64, .11);
}
.btn-style-1.btn-white {
    background-color: #fff;
}
.list-group-item i {
    display: inline-block;
    margin-top: -1px;
    margin-right: 8px;
    font-size: 1.2em;
    vertical-align: middle;
}
.mr-1, .mx-1 {
    margin-right: .25rem !important;
}

.list-group-item.active:not(.disabled) {
    border-color: #e7e7e7;
    background: #fff;
    color: #ac32e4;
    cursor: default;
    pointer-events: none;
}
.list-group-flush:last-child .list-group-item:last-child {
    border-bottom: 0;
}

.list-group-flush .list-group-item {
    border-right: 0 !important;
    border-left: 0 !important;
}

.list-group-flush .list-group-item {
    border-right: 0;
    border-left: 0;
    border-radius: 0;
}
.list-group-item.active {
    z-index: 2;
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
}
.list-group-item:last-child {
    margin-bottom: 0;
    border-bottom-right-radius: .25rem;
    border-bottom-left-radius: .25rem;
}
a.list-group-item, .list-group-item-action {
    color: #404040;
    font-weight: 600;
}
.list-group-item {
    padding-top: 16px;
    padding-bottom: 16px;
    -webkit-transition: all .3s;
    transition: all .3s;
    border: 1px solid #e7e7e7 !important;
    border-radius: 0 !important;
    color: #404040;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .08em;
    text-transform: uppercase;
    text-decoration: none;
}
.list-group-item {
    position: relative;
    display: block;
    padding: .75rem 1.25rem;
    margin-bottom: -1px;
    background-color: #fff;
    border: 1px solid rgba(0,0,0,0.125);
}
.list-group-item.active:not(.disabled)::before {
    background-color: #ac32e4;
}

.list-group-item::before {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background-color: transparent;
    content: '';}

    .no-underline {
      text-decoration: none;
  }
  a{
    color: black;
    text-decoration: none;
  }
  .custom-control-input {
    color: var(--primary-color);
  }
}`}
          </style>
          <link
            href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"
            rel="stylesheet"
          />
          <div className="container mt-5">
            <div className="row">
              <div className="col-lg-4 pb-5">
                {/* <!-- Account Sidebar--> */}
                <div className="author-card pb-3">
                  <div
                    className="author-card-cover"
                  // style="background-image: url(https://bootdey.com/img/Content/flores-amarillas-wallpaper.jpeg);"
                  >
                    <a
                      className="btn btn-style-1 btn-white btn-sm"
                      href="#"
                      data-toggle="tooltip"
                      title=""
                      data-original-title={`You currently have ${formData.buyer.badges.length} Badges points to spend`}
                    >
                      <i className="fa fa-award text-md"></i>&nbsp;{formData.buyer.badges.length} Badges
                    </a>
                  </div>
                  <div className="author-card-profile">
                    <div className="author-card-avatar">
                      <img
                        src="https://bootdey.com/img/Content/avatar/avatar1.png"
                        alt="Daniel Adams"
                      />
                    </div>
                    <div className="author-card-details">
                      <h5 className="author-card-name text-lg">
                        {formData.firstName}
                      </h5>
                      <span className="author-card-position">
                        Registered {new Date(formData.registeredTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="wizard">
                  <nav className="list-group list-group-flush">
                    <a id="tab-user" className="list-group-item bg-bright" href="#" onClick={() => handleSetActiveSetting('user')}>
                      <i className="fe-icon-user text-muted"></i>User profile
                    </a>
                    <a id="tab-buyer" className="list-group-item bg-bright" href="#" onClick={() => handleSetActiveSetting('buyer')}>
                      <i className="fe-icon-user text-muted"></i>Buyer profile
                    </a>
                    <Link to="/orders-list" className="list-group-item bg-middle">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <i className="fe-icon-shopping-bag mr-1 text-muted"></i>
                          <div className=" no-underline d-inline-block font-weight-medium text-uppercase ">
                            Orders List
                          </div>
                        </div>
                        <span className="badge badge-secondary">{}</span>
                      </div>
                    </Link>
                    <a id="tab-seller" className="list-group-item bg-bright" href="#" onClick={() => handleSetActiveSetting('seller')}>
                      <i className="fe-icon-user text-muted"></i>Seller profile
                    </a>
                    <Link to="/orders-list" className="list-group-item bg-middle">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <i className="fe-icon-shopping-bag mr-1 text-muted"></i>
                          <div className=" no-underline d-inline-block font-weight-medium text-uppercase ">
                            Product list
                          </div>
                        </div>
                        <span className="badge badge-secondary">6</span>
                      </div>
                    </Link>
                  </nav>
                </div>
              </div>
              {/* <!-- Profile Settings--> */}
              {activeSetting == 'buyer' &&
                <div className="col-lg-8 pb-5">
                  <h1>Buyer</h1>
                  <form className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="account-fn">First Name</label>
                        <input
                          className="form-control"
                          type="text"
                          id="account-fn"
                          name="buyer.name"
                          value={formData.buyer.name}
                          onChange={handleChange}
                          required=""
                        />
                        {errors.firstName && (
                          <div className="text-danger">{errors.firstName}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="account-ln">Last Name</label>
                        <input
                          className="form-control"
                          type="text"
                          id="account-ln"
                          name="buyer.surname"
                          value={formData.buyer.surname}
                          onChange={handleChange}
                          required=""
                        />
                        {errors.lastName && (
                          <div className="text-danger">{errors.lastName}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="account-email">Biography</label>
                        <textarea
                          className="form-control"
                          type="text"
                          id="account-email"
                          name="buyer.bio"
                          value={formData.buyer.bio}
                          onChange={handleChange}
                          disabled=""
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="account-ln">Birthday</label>
                        <input
                          className="form-control"
                          type="date"
                          id="account-ln"
                          name="buyer.birthday"
                          value={formData.buyer.birthday ? new Date(formData.buyer.birthday).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                          onChange={handleChange}
                          required=""
                        />
                        {errors.lastName && (
                          <div className="text-danger">{errors.lastName}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="account-commission">Commission</label>
                        <div class="tooltip-container">
                          <p class="beautiful-text" data-tooltip="Percentage for making purchases">{formData.buyer.commissionPercentage} %</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="account-buyer-id">Buyer id</label>
                        <div class="tooltip-container">
                          <p class="beautiful-text" data-tooltip="Your buyer id">{formData.buyer.id}</p>
                        </div>
                      </div>
                    </div>

                    <label htmlFor="account-cart">Cart info</label>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="account-cart-id">ID</label>
                        <div class="tooltip-container">
                          <p class="beautiful-text" data-tooltip="Your cart id">{formData.buyer.cart.id}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="account-cart">Items count</label>
                        <div class="tooltip-container">
                          <p class="beautiful-text" data-tooltip="Cart items count">{formData.buyer.cart.cartItems.length}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="account-cart">Payment method</label>
                        <div class="tooltip-container">
                          <p class="beautiful-text" data-tooltip="Payment method for order">{formData.buyer.cart.paymentMethod}&nbsp;</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="account-cart">Shipping address</label>
                        <div class="tooltip-container">
                          <p class="beautiful-text" data-tooltip="Shipping address for order">{formData.buyer.cart.shippingAddress}&nbsp;</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <p>You can change your cart in <Link to="/cart" style={{ color: "blue" }}>Cart</Link> page</p>
                    </div>

                    <div className="col-12">
                      <hr className="mt-2 mb-3" />
                      <div className="d-flex flex-wrap justify-content-between align-items-center">
                        <div className="custom-control custom-checkbox d-block">

                        </div>
                        <button
                          className="btn btn-style-1 btn-primary"
                          type="button"
                          onClick={handleSubmit}
                        >
                          Update Profile
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              }
              {activeSetting == 'user' &&
                <div className="col-lg-8 pb-5">
                  <h1>User</h1>
                  <form className="row">
                    <p>ID: {formData.id}</p>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="account-ln">Email</label>
                        <input
                          className="form-control"
                          type="text"
                          id="account-ln"
                          value={formData.email}
                          onChange={(e) => e.stopPropagation()}
                          required=""
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="account-ln">Registered time</label>
                        <input
                          className="form-control beautiful-text" data-tooltip={formData.registeredTime}
                          type="date"
                          id="account-ln"
                          value={new Date(formData.registeredTime).toISOString().split('T')[0]}
                          onChange={(e) => e.stopPropagation()}
                          required=""
                        />
                      </div>
                    </div>
                  </form>

                  <div className="col-md-6 p-2">
                    <div className="custom-control custom-checkbox d-block">
                      <input
                        className="custom-control-input"
                        type="checkbox"
                        name="subscribe"
                        checked={formData.enabled}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="subscribe_me"
                      >
                        Enabled account
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6 p-2">
                    <div className="custom-control custom-checkbox d-block">
                      <input
                        className="custom-control-input"
                        type="checkbox"
                        name="subscribe"
                        checked={formData.credentialsNonExpired}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="subscribe_me"
                      >
                        Non expired credentials
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6 p-2">
                    <div className="custom-control custom-checkbox d-block">
                      <input
                        className="custom-control-input"
                        type="checkbox"
                        name="subscribe"
                        checked={formData.accountNonExpired}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="subscribe_me"
                      >
                        Non expired account
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6 p-2">
                    <div className="custom-control custom-checkbox d-block">
                      <input
                        className="custom-control-input"
                        type="checkbox"
                        name="subscribe"
                        checked={formData.accountNonLocked}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="subscribe_me"
                      >
                        Non locked account
                      </label>
                    </div>
                  </div>
                  <div className="">
                    <Table initialData={formData.roles} initialTableName="Roles"></Table>
                  </div>
                  <div className="">
                    <Table initialData={[...formData.authenticationTransparentPolicies, { "id": "", "name": "", "type": "", "value": "", "createdTime": "" }]} initialTableName="Transparent Policies"></Table>
                  </div>
                </div>
              }
              {activeSetting == 'seller' &&
                <div className="col-lg-8 pb-5">
                  <h1>Seller</h1>
                  <form className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="account-fn">First Name</label>
                        <input
                          className="form-control"
                          type="text"
                          name="seller.name"
                          value={formData.seller.name}
                          onChange={handleChange}
                          required=""
                        />
                        {errors.firstName && (
                          <div className="text-danger">{errors.firstName}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="account-ln">Last Name</label>
                        <input
                          className="form-control"
                          type="text"
                          name="seller.surname"
                          value={formData.seller.surname}
                          onChange={handleChange}
                          required=""
                        />
                        {errors.lastName && (
                          <div className="text-danger">{errors.lastName}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="account-email">Biography</label>
                        <textarea
                          className="form-control"
                          type="text"
                          name="seller.bio"
                          value={formData.seller.bio}
                          onChange={handleChange}
                          disabled=""
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="account-ln">Birthday</label>
                        <input
                          className="form-control"
                          type="date"
                          name="seller.birthday"
                          value={formData.seller.birthday ? new Date(formData.seller.birthday).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                          onChange={handleChange}
                          required=""
                        />
                        {errors.lastName && (
                          <div className="text-danger">{errors.lastName}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="account-commission">Commission</label>
                        <div class="tooltip-container">
                          <p class="beautiful-text" data-tooltip="Percentage for selling purchases">{formData.seller.commissionPercentage} %</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="account-seller-id">Seller id</label>
                        <div class="tooltip-container">
                          <p class="beautiful-text" data-tooltip="Your seller id">{formData.seller.id}</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="account-ln">Registered time</label>
                        <input
                          className="form-control beautiful-text" data-tooltip={formData.registeredTime}
                          type="date"
                          id="account-ln"
                          value={new Date(formData.seller.registeredTime).toISOString().split('T')[0]}
                          onChange={(e) => e.stopPropagation()}
                          required=""
                        />
                      </div>
                    </div>

                    <div className="col-md-12">
                      <Table initialData={formData.seller.products} initialTableName="Roles" initialItemsPerPage={5} ></Table>
                    </div>

                    <div className="col-md-12">
                      <p>You can see your products in <Link to="/" style={{ color: "blue" }}>Seller products</Link> page</p>
                    </div>

                    <div className="col-12">
                      <hr className="mt-2 mb-3" />
                      <div className="d-flex flex-wrap justify-content-between align-items-center">
                        <div className="custom-control custom-checkbox d-block">

                        </div>
                        <button
                          className="btn btn-style-1 btn-primary"
                          type="button"
                          onClick={handleSubmit}
                        >
                          Update Profile
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              }
            </div>
          </div>
        </div>}
    </div>
  );
};

export default UpdPageProfile;
