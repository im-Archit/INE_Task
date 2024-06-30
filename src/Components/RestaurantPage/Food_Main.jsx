import React, { useState, useEffect } from "react";
import styled from "styled-components";
import "./Food_Main.css";
import Discount from "../Assets/discount.svg";
import PizzaImage from "../Assets/Pizza.png";
import NoodlesImage from "../Assets/Noodles.png";
import ButterChicken from "../Assets/ButterChicken.png";
import ManchurianImage from "../Assets/Manchurian.jpg";
import PastaImage from "../Assets/PastaImage.jfif";
import CrossaintImage from "../Assets/Crossaint.jpg";
import { Navbar } from "./navbar.jsx";
import { useWindowScroll } from "react-use";
import { useNavigate } from "react-router-dom";

const data = [
  {
    id: 1,
    name: "Dominos",
    img_url: PizzaImage,
    cuisines: ["Italian", "Mexican"],
    rating: 4.2,
    average_cost: 500,
    items: [
      {
        id: "1",
        name: "Pasta",
        price: 200,
        description: "Delicious pasta with creamy sauce.",
        veg: true,
        img_url: PastaImage,
      },
      {
        id: "2",
        name: "Pizza",
        price: 300,
        description: "Authentic Italian pizza with various toppings.",
        veg: true,
        img_url: PizzaImage,
      },
    ],
  },
  {
    id: 2,
    name: "Wong's Kitchen",
    img_url: NoodlesImage,
    cuisines: ["Chinese", "Indian"],
    rating: 3.8,
    average_cost: 300,
    items: [
      {
        id: "3",
        name: "Manchurian",
        price: 150,
        description: "Spicy and tangy Manchurian balls.",
        veg: true,
        img_url: ManchurianImage,
      },
      {
        id: "4",
        name: "Butter Chicken",
        price: 250,
        description: "Rich and creamy butter chicken with naan.",
        veg: false,
        img_url: ButterChicken,
      },
    ],
  },
  {
    id: 3,
    name: "Thai High",
    img_url: ButterChicken,
    cuisines: ["Thai", "French"],
    rating: 4.5,
    average_cost: 700,
    items: [
      {
        id: "5",
        name: "Pad Thai",
        price: 300,
        description: "Classic Thai stir-fried noodles with shrimp.",
        veg: false,
        img_url: CrossaintImage,
      },
      {
        id: "6",
        name: "Croissant",
        price: 100,
        description: "Flaky and buttery French croissant.",
        veg: true,
        img_url: CrossaintImage,
      },
    ],
  },
];

const Img = styled.img`
  cursor: pointer;
  display: block;
  margin-right: 20px;
  width: 250px;
  object-fit: contain;
  height: 250px;
  &:hover {
    transform: scale(1.05);
    transition: transform 0.5s cubic-bezier(0.215, 0.61, 0.355, 1);
    backface-visibility: visible;
  }
`;

const Wrapper = styled.header`
  max-width: 100vw;
  margin-top: 90px;
  background: #171a29;
`;

function Food_Main() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [foodItems, setFoodItems] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    setFoodItems(data);
  }, []);

  const handleClick = (id) => {
    localStorage.setItem(
      "foodId",
      JSON.stringify(data.find((item) => item.id === id))
    );
    navigate(`/food/${id}`);
  };

  const { y } = useWindowScroll();
  const [scrolled, setScrolled] = useState(0);

  useEffect(() => {
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    setScrolled((y / height) * 100);
  }, [y]);

  const clear_btn = () => {
    const inputs = document.querySelectorAll(".check");
    inputs.forEach((input) => {
      input.checked = false;
    });
  };

  window.onload = function () {
    window.addEventListener("load", clear_btn, true);
  };

  const showRestaurants = () => {
    const foodForm = document.getElementById("foodForm");
    const checkBoxes = foodForm.querySelectorAll('input[type="checkbox"]');
    const result = [];
    checkBoxes.forEach((item) => {
      if (item.checked) {
        result.push(item.value.toLowerCase());
      }
    });

    const array = [];
    const restaurantId = [];
    for (let i = 0; i < data.length; i++) {
      const cuisines = data[i].cuisines;
      for (let j = 0; j < cuisines.length; j++) {
        if (
          result.includes(cuisines[j].toLowerCase().trim()) &&
          !restaurantId.includes(data[i].id)
        ) {
          array.push(data[i]);
          restaurantId.push(data[i].id);
        }
      }
    }
    setFoodItems(array);
    setIsDrawerOpen(false);
  };

  return(
    <>
  

      <Navbar />

      <br />
      <br />
      <br />
      <br />
      <br />

      <div className="container_card">
        {foodItems.length > 0 ? (
          foodItems.slice(0, 5).map((food_data) => (
            <div
              className="food_card"
              key={food_data.id}
              onClick={() => handleClick(food_data.id)}
            >
              <img
                src={food_data.img_url}
                alt="Food_Image"
                className="food_image"
              />
              <h4 className="Header_card">{food_data.name}</h4>
              <p className="para_card">{food_data.cuisines.join(", ")}</p>
              <div className="food_details">
                <div
                  className="rating"
                  style={{
                    backgroundColor:
                      food_data.rating < 4 ? "#db7c38" : "#48c479",
                  }}
                >
                  <i className="far fa-star"></i>&nbsp;{food_data.rating}
                </div>

                <div className="average_price">
                  &#8377;{food_data.average_cost} FOR TWO
                </div>
              </div>
              <div className="footer">
                <img src={Discount} alt="" className="discount_icon" />
                50% off | use TRYNEW
              </div>
            </div>
          ))
        ) : (
          <p>No restaurants available</p>
        )}
      </div>
    </>
  );
}

export { Food_Main };
