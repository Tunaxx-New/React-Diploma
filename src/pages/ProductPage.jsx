import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import { Footer, Navbar } from "../commons";
import api from "../apis/api";

const ProductPage = () => {
  const { id } = useParams(); // Получаем id из параметров маршрута
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setLoading2(true);
      try {
        const response = await api(`/api/public/product/?id=${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = response;
        console.log(data);
        setProduct(data);

        // Дополнительный запрос для получения похожих продуктов
        // const response2 = await api(`api/public/product/${id}/similar`, {
        //   method: "GET",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // });
        // const data2 = await response2.json();
        // setSimilarProducts(data2);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
      setLoading(false);
      setLoading2(false);
    };
    getProduct();
  }, [id]);

  const Loading = () => {
    return (
      <div className="container my-5 py-2">
        <div className="row">
          <div className="col-md-6 py-3">
            <Skeleton height={400} width={400} />
          </div>
          <div className="col-md-6 py-5">
            <Skeleton height={30} width={250} />
            <Skeleton height={90} />
            <Skeleton height={40} width={70} />
            <Skeleton height={50} width={110} />
            <Skeleton height={120} />
            <Skeleton height={40} width={110} inline={true} />
            <Skeleton className="mx-3" height={40} width={110} />
          </div>
        </div>
      </div>
    );
  };

  const ShowProduct = () => {
    const [isButtonClicked, setIsButtonClicked] = useState(false);

    const styles = {
      container: {
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease-in-out',
      },
      image: {
        border: '1px solid #ddd',
        padding: '5px',
        backgroundColor: '#fff',
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '8px',
        transition: 'transform 0.2s',
      },
      display5: {
        color: '#333',
      },
      textSuccess: {
        color: '#28a745',
      },
      textUppercase: {
        fontSize: '0.9rem',
        textTransform: 'uppercase',
        color: '#6c757d',
      },
      btnOutlineDark: {
        border: '1px solid #333',
        marginRight: '10px',
        transition: 'all 0.3s ease',
      },
      btnOutlineDarkActive: {
        border: '1px solid #333',
        color: '#fff',
        backgroundColor: '#333',
        marginRight: '10px',
        transition: 'all 0.3s ease',
      },
      btnDark: {
        backgroundColor: '#333',
        color: '#fff',
        transition: 'background-color 0.3s ease',
      },
      btnDarkHover: {
        backgroundColor: '#555',
      },
      sellerInfo: {
        marginTop: '20px',
      },
      sellerTitle: {
        color: '#6c757d',
        marginBottom: '10px',
      },
      sellerText: {
        color: '#343a40',
      },
    };
    

    if (!product) return null;
    return (
      <>
        <div className="container my-5 py-4" style={styles.container}>
          <div className="row">
            <div className="col-md-6 col-sm-12 py-3">
              <img
                className="img-fluid rounded shadow-sm"
                src={product.image_filename || "default.png"}
                alt={product.name || "Product Image"}
                style={styles.image}
              />
            </div>
            <div className="col-md-6 col-sm-12 py-5">
              <h4
                className="text-uppercase text-muted"
                style={styles.textUppercase}
              >
                Product ID: {product.id || "N/A"}
              </h4>
              <h1 className="display-5 fw-bold" style={styles.display5}>
                {product.name || "Product Name"}
              </h1>
              <h3 className="display-6 my-4" style={styles.textSuccess}>
                ${product.price || "0.00"}
              </h3>
              <p className="lead mb-4">
                {product.description || "No description available"}
              </p>
              <p className="text-muted">
                <strong>Created Time:</strong>{" "}
                {new Date(product.createdTime).toLocaleString() || "N/A"}
              </p>
              <p className="text-muted">
                <strong>Expiration Date:</strong>{" "}
                {product.expirationDate || "N/A"}
              </p>
              <div className="my-4">
                <button
                  className="btn btn-outline-dark"
                  onClick={() => addProduct(product)}
                  style={styles.btnOutlineDark}
                >
                  Add to Cart
                </button>
                <Link
                  to="/cart"
                  className="btn btn-dark"
                  style={styles.btnDark}
                >
                  Go to Cart
                </Link>
              </div>
              <div className="mt-5">
                <h4
                  className="text-uppercase text-muted"
                  style={styles.textUppercase}
                >
                  Seller Information
                </h4>
                <p className="lead fw-bold">
                  {product.seller?.name || "Name"}{" "}
                  {product.seller?.surname || "Surname"}
                </p>
                <p className="text-muted">
                  <strong>Bio:</strong>{" "}
                  {product.seller?.bio || "No bio available"}
                </p>
                <p className="text-muted">
                  <strong>Birthday:</strong>{" "}
                  {product.seller?.birthday
                    ? new Date(product.seller.birthday).toLocaleDateString()
                    : "N/A"}
                </p>
                <p className="text-muted">
                  <strong>Commission:</strong>{" "}
                  {product.seller?.commissionPercentage != null
                    ? `${product.seller.commissionPercentage}%`
                    : "N/A"}
                </p>
                <p className="text-muted">
                  <strong>Registered Time:</strong>{" "}
                  {product.seller?.registeredTime
                    ? new Date(product.seller.registeredTime).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const Loading2 = () => {
    return (
      <div className="my-4 py-4">
        <div className="d-flex">
          <div className="mx-4">
            <Skeleton height={400} width={250} />
          </div>
          <div className="mx-4">
            <Skeleton height={400} width={250} />
          </div>
          <div className="mx-4">
            <Skeleton height={400} width={250} />
          </div>
          <div className="mx-4">
            <Skeleton height={400} width={250} />
          </div>
        </div>
      </div>
    );
  };

  const ShowSimilarProduct = () => {
    if (!similarProducts.length) return null;

    return (
      <div className="py-4 my-4">
        <div className="d-flex">
          {similarProducts.map((item) => {
            return (
              <div key={item.id} className="card mx-4 text-center">
                <img
                  className="card-img-top p-3"
                  src={item.image_filename}
                  alt="Card"
                  height={300}
                  width={300}
                />
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                </div>
                <div className="card-body">
                  <Link to={"/product/" + item.id} className="btn btn-dark m-1">
                    Buy Now
                  </Link>
                  <button
                    className="btn btn-dark m-1 pr"
                    onClick={() => addProduct(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>
        <div className="row my-5 py-5">
          {/* <div className="d-none d-md-block">
            <h2 className="">You may also Like</h2>
            {loading2 ? <Loading2 /> : <ShowSimilarProduct />}
          </div> */}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductPage;
