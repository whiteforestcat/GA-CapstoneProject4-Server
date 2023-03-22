import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { galleryImage } from "../image";
import { NavLink } from "react-router-dom";
import Payment from "../components/Payment";
import { useNavigate } from "react-router-dom";
import { URL } from "../App";

const Cart = (props) => {
  const [cart, setCart] = useState();
  const [shippedStatus, setShipppedStatus] = useState(false);
  const [newQuantity, setNewQuantity] = useState();

  const navigate = useNavigate();

  const getCart = async () => {
    try {
      const res = await fetch(`${URL}/api/allcart`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${props.accessToken}`,
        },
        body: JSON.stringify({ id: props.emailId }),
      });
      const data = await res.json();
      console.log(data);
      setCart(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const deleteCart = async (id) => {
    try {
      const res = await fetch(`${URL}/api/deletecart`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${props.accessToken}`,
        },
        body: JSON.stringify({ emailId: props.emailId, itemId: id }),
      });
      const data = await res.json();
      console.log(data);
      setCart(cart.filter((item) => item.itemid !== id));

      if (data === "cart item successfully removed") {
        toast.success(data, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const updateCart = async (cartid, itemid) => {
    try {
      const res = await fetch(`${URL}/api/updatecart`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${props.accessToken}`,
        },
        body: JSON.stringify({
          newQuantity: newQuantity,
          cartId: cartid,
          itemId: itemid,
        }),
      });
      const data = await res.json();
      console.log(data);

      if (data === "cart updated") {
        toast.success(data, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      if (data === "please enter quantity") {
        toast.warning(data, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleUpdateCart = (e) => {
    setNewQuantity(e.target.value);
  };

  const addToShipment = async (id) => {
    const res = await fetch(`${URL}/api/addtoshipment`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${props.accessToken}`,
      },
      body: JSON.stringify({
        emailId: props.emailId,
        cartId: id,
        shipmentId: props.emailId,
      }),
    });
    const data = await res.json();
    console.log(data);
    navigate("/payment", { replace: true });

    if (data === "item sent for shipment") {
      toast.success(data, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    setShipppedStatus(true);
  };

  // useEffect(() => {
  //   const data = window.localStorage.getItem("GA_CAPSTONE");
  //   // console.log("shippedStatus:", JSON.parse(data).shippedStatus);
  //   if (data !== null) {
  //     setShipppedStatus(JSON.parse(data));
  //   }
  //   console.log("byebyeybe");
  // }, []);

  useEffect(() => {
    const data = window.localStorage.getItem("GA_CAPSTONE");
    console.log("data", data);
    if (data !== null) {
      setShipppedStatus(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    // console.log("shippedStatus", shippedStatus)
    window.localStorage.setItem("GA_CAPSTONE", JSON.stringify(shippedStatus));
  }, [shippedStatus]);

  return (
    <div className="bg-orange-200 pb-[2000px]">
      <div className="mx-[100px]">
        <ToastContainer />
        <h2 className="text-7xl text-center py-[50px]">CART</h2>
        {shippedStatus ||
          (cart && (
            <div className="grid gap-2 lg:grid-cols-4">
              {cart.map((item, index) => (
                <div
                  className="w-full rounded-lg shadow-md lg:max-w-sm bg-orange-600"
                  key={index}
                >
                  <div>
                    <img
                      src={galleryImage[item.itemid - 1]}
                      alt=""
                      className="object-cover w-full h-48"
                    />
                    <div className="p-4">
                      <h4 className="text-xl font-semibold">
                        {item.cart_item}
                      </h4>
                      <p className="mb-2 leading-normal">{item.quantity}</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 text-sm text-red-500">
                    <div>
                      <input
                        type="text"
                        value={newQuantity}
                        onChange={handleUpdateCart}
                        className="border rounded-lg py-2"
                      />
                      <button
                        onClick={() => updateCart(item.cartid, item.itemid)}
                        className="px-4 py-2 text-sm text-white rounded shadow border-4 border-orange-700 bg-orange-700"
                      >
                        UPDATE CART
                      </button>
                    </div>
                    <button
                      onClick={() => deleteCart(item.itemid)}
                      className="px-4 py-2 text-sm text-white rounded shadow border-4 border-orange-700 bg-orange-700"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        <button onClick={() => addToShipment(cart[0].cartid)}>
          PROCEED TO PAY
        </button>
      </div>
    </div>
  );
};

export default Cart;
