import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import api from "../../apis/api";
import { useAsyncError } from '../../commons';

// Original class component
const CreateProduct = ({ params }) => {
    const [formData, setFormData] = useState({
        name: ''
    });

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
            if (formData[`${name}`]) {
                // If buyer exists, update the nested property
                setFormData({
                    ...formData,
                    [name]: {
                        ...formData[`${name}`],
                        ...nestedObject
                    }
                });
            } else {
                // If buyer doesn't exist, create it as an object and set the nested property
                setFormData({
                    ...formData,
                    [name]: {
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
        console.log(formData);

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
    };

    // Accessing params from props
    const { id: paramId } = useParams();
    const id = Number(paramId);

    return (
        <div className="create-product">
            <h2>Create New Product</h2>
            <p>Product ID: {id}</p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="category">Name</label>
                    <input
                        type="text"
                        id="category"
                        name="category"
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">Create Product</button>
            </form>
        </div>
    );
}

export default CreateProduct;