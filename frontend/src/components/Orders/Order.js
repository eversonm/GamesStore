import classes from "./Order.module.css";
import importAll from "../../util/import-images"

const Order = (props) => {
  const images = importAll(
    require.context("../../images", false, /\.(png|jpe?g|svg)$/)
  );
  const price = `R$${props.price.toFixed(2)}`;
  const total = `R$${props.total.toFixed(2)}`;
  const date = new Date(props.date);
  return (
    <li className={classes.order}>
      <div>
        <img src={images[`${props.image}`]} alt="" />
      </div>
      <div></div>
      <div>
        <p>Pedido Número: {props.id_order}</p>
        <h3>{props.name}</h3>
        <div className={classes.amount}>Quantidade: {props.amount}</div>
        <div>Preço Unitário: {price}</div>
        <div className={classes.price}>Preço total: {total}</div>
        <div>Data de compra: {date.toDateString()}</div>
      </div>
    </li>
  );
};

export default Order;
