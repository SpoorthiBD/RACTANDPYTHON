import React, { useEffect, useState } from "react";
import { firestore } from "../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import "firebase/firestore";
import { Link } from "react-router-dom";



const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleRadioChange = (category) => {
        console.log("Selected Category:", category);
        setSelectedCategory(category);
    };
    const [selectedRadio, setSelectedRadio] = useState("exampleRadios1");

    const handleNextButtonClick = () => {
        if (selectedRadio === "exampleRadios1") {
            setSelectedRadio("flexRadioDefault2");
        } else if (selectedRadio === "flexRadioDefault2") {
            setSelectedRadio("flexRadioDefault3");
        }
        // Add more conditions if you have more radio buttons
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetching products based on selected category
                const plainRef = collection(
                    firestore,
                    "clothes",
                    "Men",
                    "Tshirt",
                    "half sleve",
                    "Plain"
                );
                const printedRef = collection(
                    firestore,
                    "clothes",
                    "Men",
                    "Tshirt",
                    "half sleve",
                    "Printed"
                );
                const CheckRef = collection(
                    firestore,
                    "clothes",
                    "Men",
                    "Tshirt",
                    "half sleve",
                    "check"
                );

                let productsData = [];

                if (selectedCategory === "Plain" || selectedCategory === "all") {
                    const plainSnapshot = await getDocs(plainRef);
                    const plainProducts = plainSnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    // console.log("plainProducts", plainProducts);
                    productsData = [...productsData, ...plainProducts];
                }

                if (selectedCategory === "Printed" || selectedCategory === "all") {
                    const printedSnapshot = await getDocs(printedRef);
                    const printedProducts = printedSnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    // console.log("printedProducts", printedProducts);
                    productsData = [...productsData, ...printedProducts];
                }
                if (selectedCategory === "check" || selectedCategory === "all") {
                    const CheckSnapshot = await getDocs(CheckRef);
                    const CheckProducts = CheckSnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    productsData = [...productsData, ...CheckProducts];
                }

                setProducts(productsData);
                setLoading(false);

                // console.log(productsData, "productsALLLLL");
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchData();
    }, [selectedCategory]);






    return (
        <div>
            <div className='container'>
                <div className='row'>
                    <div className="col-lg-12 col-md-12 col-12">
                        <div className="d-flex justify-content-center flex-wrap">
                            <p className="text-secondary px-1">{products.length} Items</p>

                            <div className="smallscreenRadio">
                                <div className="form-check d-inline-block">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        id="all"
                                        value="all"
                                        checked={selectedCategory === "all"}
                                        onChange={() => handleRadioChange("all")}
                                    />
                                    <label className="form-check-label mx-1" htmlFor="all">
                                        All Full T-shirt
                                    </label>
                                </div>

                                <div className="form-check mx-1 d-inline-block" onClick={handleNextButtonClick}>
                                    <input
                                        className="form-check-input"
                                        name="flexRadioDefault"
                                        type="radio"
                                        id="Plain"
                                        value="Plain"
                                        checked={selectedCategory === "Plain"}
                                        onChange={() => handleRadioChange("Plain")}
                                    />
                                    <label className="form-check-label" htmlFor="Plain">
                                        Plain Full Hand T-shirt{" "}
                                    </label>
                                </div>
                                <div className="form-check mx-1 d-inline-block" onClick={handleNextButtonClick}>
                                    <input
                                        className="form-check-input"
                                        name="flexRadioDefault"
                                        type="radio"
                                        id="Printed"
                                        value="Printed"
                                        checked={selectedCategory === "Printed"}
                                        onChange={() => handleRadioChange("Printed")}
                                    />
                                    <label className="form-check-label" htmlFor="Printed">
                                        Printed Full Hand T-shirt{" "}
                                    </label>
                                </div>
                                <div className="form-check mx-1 d-inline-block" onClick={handleNextButtonClick}>
                                    <input
                                        className="form-check-input"
                                        name="flexRadioDefault"
                                        type="radio"
                                        id="check"
                                        value="check"
                                        checked={selectedCategory === "check"}
                                        onChange={() => handleRadioChange("check")}
                                    />
                                    <label className="form-check-label" htmlFor="check">
                                        Check V-NeckT-shirt{" "}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {products.length > 0 ? (
                        products.map((product) => (

                            <div key={product.id} className="col-lg-3 col-md-6 col-12">
                                <Link
              to={`/SingleProducts/${product.id}`}
              className="text-decoration-none border-0"
            >
                                <div className="card-container card_container1" data-aos="zoom-in-up">
                                    <div className="card text-white">
                                        <div className="product_images">
                                            <img
                                                src={product.imageUrl[0]}
                                                className="card-img front-img fixed_img"
                                                alt={product.name}
                                            />
                                            {/* <img
                      src={product.imageUrl[1]}
                      className="card-img back-img fixed_img"
                      alt={product.name}
                    /> */}
                                        </div>
                                        <div className="card-img-overlay">
                                            <span className="badge bg-success">BEST SELLER</span>
                                        </div>
                                        <div className="card-img-overlay d-flex">
                                            <div className="mt-auto">
                                                <span className="badge rounded-pill bg-light text-dark card-text py-2 px-3">
                                                    <i className="bi bi-star-fill text-warning"></i> {product.rating} 4.5 | 5.0{product.reviews}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-black prices_details">
                                        <h5 className="mt-3">{product.name} {product.category}</h5>

                                        <h6 className="fw-bold">
                                            <i className="bi bi-currency-rupee"></i>
                                            {product.price} &nbsp;
                                            <del>
                                                <i className="bi bi-currency-rupee"></i>1,877
                                            </del>{" "}
                                            OFF
                                        </h6>
                                        <div className="my-2">
                                            <span>
                                                <i className="bi bi-star-fill text-warning"></i>
                                                <i className="bi bi-star-fill text-warning"></i>
                                                <i className="bi bi-star-fill text-warning"></i>
                                                <i className="bi bi-star-fill text-warning"></i>
                                                <i className="bi bi-star-half text-warning"></i>{" "}
                                                79 reviews
                                            </span>
                                        </div>
                                        <p className="price_msg_success">
                                            Lowest price in last 30 days
                                        </p>
                                    </div>
                                </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="col-12">
                            <p className="text-center text-danger">
                                There are no products available in this category.
                            </p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}

export default Home
