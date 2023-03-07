import { useContext } from "react";
import ProductForm from "../components/Products/Product/ProductForm";
import classes from "./Product.module.css";
import CartContext from "../context/cart-context";
import importAll from "../util/import-images";

const Product = (props) => {
  const images = importAll(
    require.context("../images", false, /\.(png|jpe?g|svg)$/)
  );
  const cartCtx = useContext(CartContext);

  const price = `$${props.price.toFixed(2)}`;

  const addToCartHandler = (amount) => {
    cartCtx.addItem({
      id: props.id,
      name: props.name,
      amount: amount,
      score: props.score,
      price: props.price,
    });
  };
  return (
    <li className={classes.meal}>
      <div>
        <img src={images[`${props.image}`]} alt="" />
      </div>
      <div></div>
      <div>
        <h3>{props.name}</h3>
        <div className={classes.description}>Avaliações: {props.score}</div>
        <div className={classes.price}>{price}</div>
        <ProductForm onAddToCart={addToCartHandler} />
      </div>
    </li>
  );
};

export default Product;
