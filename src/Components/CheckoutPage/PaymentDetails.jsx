import React, { useState, useEffect } from "react";
import "./PaymentDetails.css";
import { Navbar } from "../RestaurantPage/navbar.jsx";

export const PaymentDetails = () => {
  const [state, setState] = useState([]);
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountAmt, setDiscountAmt] = useState(0);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("Cart")) || [];
    setState(cart);
  }, []);

  const qHandler = (e) => {
    let id = e.target.parentElement.id;
    let index = state.findIndex((item) => item.id === id);
    let temp = [...state];

    if (e.target.innerHTML === "+") {
      temp[index].q++;
    } else if (temp[index].q !== 1) {
      temp[index].q--;
    } else {
      temp.splice(index, 1);
    }

    setState(temp);
    localStorage.setItem("Cart", JSON.stringify(temp));
  };

  const handleApplyCoupon = () => {
    // Placeholder for coupon logic
    // For demonstration purposes, applying 10% discount
    const totalAmount = state.reduce(
      (total, item) => total + item.price * item.q,
      0
    );
    const discountedAmount = totalAmount * 0.9; // 10% discount
    setDiscountAmt(discountedAmount.toFixed(2));
    setCouponApplied(true);
  };

  return (
    <>
      <Navbar />
      <div className="cart_body">
        <div className="cart_title">
          <div className="image_box">
            <img
              src={JSON.parse(localStorage.getItem("foodId")).img_url}
              alt="Restaurant Image"
            />
          </div>
          <div className="image_title">
            <p className="image_titlename">
              {JSON.parse(localStorage.getItem("foodId")).name}
            </p>
            <p className="address">Bharati Vidyapeeth</p>
          </div>
        </div>

        <div className="items_div_parent">
          {state.map((item) => (
            <div className="items_div" key={item.id} id={item.id}>
              <p className="product">{item.name}</p>
              <button className="decrease" onClick={qHandler}>
                -
              </button>
              <p className="value">{item.q}</p>
              <button className="increase" onClick={qHandler}>
                +
              </button>
              <p className="price">&#8377;{item.price}</p>
            </div>
          ))}
        </div>

        <button className="applynow" onClick={handleApplyCoupon}>
          Apply Coupon
        </button>

        <p className="billdetails">Bill Details</p>

        <div className="itemdetails">
          <p className="bill_details_user">Item Total</p>
          <p className="amount">
            &#8377;
            {couponApplied
              ? discountAmt
              : state
                  .reduce((total, item) => total + item.price * item.q, 0)
                  .toFixed(2)}
          </p>
        </div>

        <div className="itemdetails">
          <p className="bill_details_user">Delivery Fee | 4.6kms</p>
          <p className="amount">
            <strike>&#8377;39.00</strike>&nbsp;&nbsp;FREE
          </p>
        </div>

        <div className="itemdetails">
          <p className="bill_details_user">Taxes and Charges</p>
          <p className="amount">FREE</p>
        </div>

        <div className="bordertotal"></div>

        <div className="total_pay_for_user">
          <p className="amount_tag">TO PAY</p>
          <span className="amount_to_paid">
            &#8377;
            {couponApplied
              ? discountAmt
              : state
                  .reduce((total, item) => total + item.price * item.q, 0)
                  .toFixed(2)}
          </span>
        </div>
      </div>
    </>
  );
};
