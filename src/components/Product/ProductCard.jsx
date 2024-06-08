import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProductCard = ({ product, addProduct }) => {
  return (
    <div id={product.id} key={product.id} className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
      <div className="card text-center h-100">
        <img
          className="card-img-top p-3"
          src={product.image_filename}
          alt={product.name}
          height={300}
        />
        <div className="card-body">
          <h5 className="card-title">{product.name || "Product Name"}</h5>
          <p className="card-text">
            {product.description || "Product Description"}
          </p>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item lead">
            $ {product.price || "0.00"}
          </li>
        </ul>
        <div className="card-body">
          <Link to={`/product/${product.id}`} className="btn btn-dark m-1">
            Buy Now
          </Link>
          <button
            className="btn btn-dark m-1"
            onClick={() => addProduct(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
    image_filename: PropTypes.string,
  }).isRequired,
  addProduct: PropTypes.func.isRequired,
};

export default ProductCard;
