import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { firestore } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SingleProducts.css";

const SingleProducts = () => {
  const sliderRef = useRef(null);
  const { productId } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const [loadingCapture, setLoadingCapture] = useState(false);
  const [loadingStopWebcam, setLoadingStopWebcam] = useState(false);

  const settings = {
    customPaging: function (i) {
      return (
        <a>
          <img
            src={productDetails.imageUrl[i]}
            alt={`View ${i + 1}`}
            className="img-fluid"
          />
        </a>
      );
    },
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const paths = [
          ["clothes", "Men", "Tshirt", "full sleve", "Plain"],
          ["clothes", "Men", "Tshirt", "full sleve", "Printed"],
          ["clothes", "Men", "Tshirt", "full sleve", "check"],
          ["clothes", "Men", "Tshirt", "half sleve", "Plain"],
          ["clothes", "Men", "Tshirt", "half sleve", "Printed"],
          ["clothes", "Men", "Tshirt", "half sleve", "check"],
          ["clothes", "Men", "Tshirt", "collar", "Plain"],
          ["clothes", "Men", "Tshirt", "collar", "Printed"],
          ["clothes", "Men", "Tshirt", "collar", "check"],
          ["clothes", "Men", "Tshirt", "round neck", "Plain"],
          ["clothes", "Men", "Tshirt", "round neck", "Printed"],
          ["clothes", "Men", "Tshirt", "round neck", "check"],
          ["clothes", "Men", "Tshirt", "v-neck", "Plain"],
          ["clothes", "Men", "Tshirt", "v-neck", "Printed"],
          ["clothes", "Men", "Tshirt", "v-neck", "check"],
          ["clothes", "Men", "Shirt", "half sleve", "Plain"],
          ["clothes", "Men", "Shirt", "half sleve", "Printed"],
          ["clothes", "Men", "Shirt", "full sleve", "Plain"],
          ["clothes", "Men", "Shirt", "full sleve", "Printed"],
        ];

        for (const path of paths) {
          const productRef = doc(firestore, ...path, productId);
          const snapshot = await getDoc(productRef);

          if (snapshot.exists()) {
            const data = { ...snapshot.data(), id: snapshot.id };
            setProductDetails(data);
            return;
          }
        }

        console.log("Product not found");
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleSmallImageClick = (index) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  };

  const handleTryOnButtonClick = () => {
    const overlayElement = document.getElementsByClassName("overlay")[0];
    if (overlayElement) {
      overlayElement.style.display = "block";
    }
  };

  const captureImage = () => {
    const currentSlideIndex = sliderRef.current.innerSlider.state.currentSlide;
    const imageUrl = productDetails.imageUrl[currentSlideIndex];
    setLoadingCapture(true); // Start loading for image capture
    fetch('http://127.0.0.1:5000/capture_image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'tx': 0,
        'ty': 0,
        'product': imageUrl
      })
    })
      .then(response => response.json())
      .then(data => {
        setLoadingCapture(false); // Stop loading after capture is complete
        if (data.output_path) {
          const capturedImage = document.getElementById("capturedImage")
          capturedImage.src = "http://127.0.0.1:5000/" + data.output_path;
          capturedImage.style.display = "inline-block"
          document.getElementById("videoLocal").remove();
          // Stop video here or other actions
        } else {
          alert('Error: ' + data.error);
        }
      })
      .catch(error => {
        setLoadingCapture(false); // Stop loading on error
        alert('Error: ' + error.message);
      });
  };

  const stopWebcam = () => {
    setLoadingStopWebcam(true); // Start loading for stopping webcam
    fetch('http://127.0.0.1:5000/stop_webcam', {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        setLoadingStopWebcam(false); // Stop loading after stopping webcam
        if (data.success) {
          console.log('Webcam feed stopped successfully');
        } else {
          console.error('Failed to stop webcam feed:', data.error);
        }
      })
      .catch(error => {
        setLoadingStopWebcam(false); // Stop loading on error
        console.error('Error stopping webcam feed:', error);
      });
  };

  return (
    <div className="container">
      <div className="overlay">
        <div className="center-panel">
          <div className="close-btn" onClick={() => {
            const overlayElement = document.getElementsByClassName("overlay")[0];
            if (overlayElement) {
              overlayElement.style.display = "none";
            }
          }}>Close</div>
          <img
            id="videoLocal"
            src="http://127.0.0.1:5000/video_feed"
            alt="Video Feed"
          />
          <img id="capturedImage" alt="image capture" />
          <button className="capture-btn" type="button" id="capture" onClick={captureImage}>
            {loadingCapture ? 'Capturing...' : 'Capture & Try'}
          </button>
          <button className="stop-btn" type="button" id="stop" onClick={stopWebcam}>
            {loadingStopWebcam ? 'Stopping Webcam...' : 'Stop Webcam'}
          </button>
        </div>
      </div>
      {productDetails ? (
        <div className="row">
          <div className="col-lg-6 col-md-12 col-12 my-4">
            <div className="slider-container">
              <Slider {...settings} ref={sliderRef}>
                {productDetails.imageUrl.map((imageUrl, index) => (
                  <div key={index} className="single_img">
                    <img
                      src={imageUrl}
                      alt={`View ${index + 1}`}
                      className="img-fluid img-container"
                    />
                    <button
                      className="overlay-button"
                      onClick={handleTryOnButtonClick}
                    >
                      Try-On
                    </button>
                  </div>
                ))}
              </Slider>
            </div>
            <div className="small-images-container mt-2">
              {productDetails.imageUrl.map((imageUrl, index) => (
                <div
                  key={index}
                  className="small-image-box"
                  onClick={() => handleSmallImageClick(index)}
                >
                  <img
                    src={imageUrl}
                    alt={`Thumbnail ${index + 1}`}
                    className="img-fluid"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-6 col-md-12 col-12 my-4">
            <div className="product-details">
              <h2 className="text_color_heading">{productDetails.name}</h2>
              <p className="font_size_bought">Price: ${productDetails.price}</p>
              <div className="bg_color_buy_now">
                <button className="font_size">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default SingleProducts;
