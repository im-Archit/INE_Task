import React, { useState, useEffect } from "react";
import OfferImg from "../Assets/offerImg.jpg";

import "./Food_Detail.css";
import { Navbar } from "./navbar.jsx";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import ScrollToTop from "react-scroll-to-top";
import { useWindowScroll } from "react-use";
import Typography from "@mui/material/Typography";
import { Link, useParams } from "react-router-dom";
import { PreLoader } from "../PreLoader";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "fit-content",
  border: "1px solid lightgray",
  borderRadius: "7px",
  boxShadow: 24,
  p: 2,
};

const Food_Detail = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [restaurant, setRestaurant] = useState({});
  const [showData, setShowData] = useState([]);
  const [cart, setCart] = useState([]);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate API call or set timeout to load data
    setTimeout(() => {
      const selectedFood = JSON.parse(localStorage.getItem("foodId")) || {};
      setRestaurant(selectedFood);
      setShowData(selectedFood.items);
      setCart(JSON.parse(localStorage.getItem("Cart")) || []);
      setLoading(false);
    }, 2000);
  }, []);

  const { y } = useWindowScroll();
  useEffect(() => {
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    setScrolled((y / height) * 100);
  }, [y]);

  const handleOpen = (item) => {
    let updatedCart = [...cart];
    let foundItem = updatedCart.find((cartItem) => cartItem.id === item.id);
    if (foundItem) {
      foundItem.q++;
    } else {
      item.q = 1;
      updatedCart.push(item);
    }
    setCart(updatedCart);
    localStorage.setItem("Cart", JSON.stringify(updatedCart));
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handlechange = (e) => {
    setQuery(e.target.value);
    let temp = [];
    restaurant.items.forEach((o) => {
      if (o.name.toLowerCase().includes(query.toLowerCase())) {
        temp.push(o);
      }
    });
    setShowData(temp);
    if (showData.length === 0) {
      setShowData(temp);
    }
  };


  const filterData = (e) => {
    let paras = document.querySelectorAll(".side_section p");
    paras.forEach((p) => p.classList.remove("active_filter"));

    e.target.classList.add("active_filter");

    let fil = e.target.innerText.toLowerCase();
    let newarr = restaurant.items.filter(
      (item) => item.category.toLowerCase() === fil
    );
    setShowData([...newarr]);
    setQuery(e.target.innerText);
  };

  const qHandler = (e) => {
    let id = e.target.parentElement.id;
    let index = -1;
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id === id) {
        index = i;
        break;
      }
    }
    let temp = [...cart];
    if (e.target.innerHTML === "+") temp[index].q++;
    else if (temp[index].q !== 1) temp[index].q--;
    else temp.splice(index, 1);
    setCart(temp);
    localStorage.setItem("Cart", JSON.stringify(temp));
  };

  return loading ? (
    <PreLoader />
  ) : (
    <>
      

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style} className="modal_window">
            <Typography id="transition-modal-title" variant="h6" component="h2">
              {restaurant ? restaurant.name : ""}
              <p className="modal_description">
                <i class="fa fa-check" aria-hidden="true"></i>&nbsp;Added to your
                cart
              </p>
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              <div className="food_img_modal">
                <img src={restaurant ? restaurant.img_url : ""} alt="" />
              </div>
            </Typography>
          </Box>
        </Fade>
      </Modal>
      <Navbar />
      <div className="topbar">
        <div className="topbar_content">
          <div className="food_img_topbar">
            <img src={restaurant ? restaurant.img_url : ""} alt="" />
          </div>
          <div className="food_details_section">
            <h2 className="heading">{restaurant ? restaurant.name : ""}</h2>

            <p className="cuisines">
              {restaurant ? restaurant.cuisines.join(", ") : ""}
            </p>

            <p className="hotel_location">Central Delhi</p>
            <div className="food_overview">
              <p className="food_rating">
                <i class="fas fa-star "></i>
                <b>&nbsp;{restaurant ? restaurant.rating : ""}</b> <br />
                500+ Ratings
              </p>
             
              <p className="food_pricing">
                {" "}
                <b>&#8377;{restaurant ? restaurant.average_cost : ""}</b> <br />
                Cost for two
              </p>
            </div>
            <div className="querySearch_user">
              <div className="veg_only">
                <button>Veg Only</button>
              </div>
            </div>
          </div>
          <div className="offer-section">
            <img src={OfferImg} alt="" className="offer_img" />
          </div>
        </div>
      </div>
      <div className="food_products">
        <h4 className="title">All Food Items</h4>
        <p className="itemCount">{showData.length} ITEMS</p>

        {showData.map((ele, index) => (
          <div className="food_products_card" key={index}>
            <div className="card_left_div">
             
              <h4 className="product_title">{ele.name}</h4>
              <p className="product_price">&#8377;{ele.price}</p>
              <p className="product_descrip">{ele.description}</p>
            </div>
            <div className="card_right_div">
              <div className="food_img">
                <img src={ele.img_url} alt="" />
              </div>
              <button className="add_cart" onClick={() => handleOpen(ele)}>
                ADD
              </button>
            </div>
          </div>
        ))}

        {cart.length > 0 && (
          <div className="item_added">
            <h2 className="header">Cart</h2>
            <p className="no_items">{cart.length} Items</p>
            <div className="items_div_parent">
              {cart.map((item) => (
                <div className="items_div" key={item.id}>
                  <p className="product">{item.name}</p>
                  <button className="decrease" onClick={qHandler}>
                    -
                  </button>
                  <p className="value">{item.q}</p>
                  <button className="increase" onClick={qHandler}>
                    +
                  </button>
                  <p className="price">&#8377;{(item.price * item.q).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="sub_total">
              <div className="header_1">
                <h2>
                  Subtotal <br />
                  <p>Extra charges may apply</p>
                </h2>
              </div>
              <div className="total_price_1">
                &#8377;
                {cart
                  .map((item) => item.price * item.q)
                  .reduce((acc, curr) => acc + curr, 0)
                  .toFixed(2)}
              </div>
            </div>
            <Link className="link" to="/payment">
              <button className="checkout">
                CHECKOUT&nbsp;&nbsp;&nbsp;<i class="fas fa-arrow-right"></i>
              </button>
            </Link>
          </div>
        )}

        {cart.length === 0 && (
          <div className="cart_empty">
            <h2 className="empty_cart">Cart Empty</h2>
            
            <p className="empty_cart_para">
              Celebrating The Win for Team India 🏆
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Food_Detail;
