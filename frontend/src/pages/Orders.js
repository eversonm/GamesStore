import { useEffect, useState, useContext } from "react";

import Card from "../components/UIElements/Card";
import Order from "../components/Orders/Order";
import classes from "./Orders.module.css";
import { AuthContext } from "../context/auth-context";

const Orders = () => {
  const auth = useContext(AuthContext);
  const [prods, setProds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState();
  useEffect(() => {
    const fetchProds = async () => {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/orders/${auth.userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const responseData = await response.json();

      const loadedProds = [];

      for (const key in responseData) {
        loadedProds.push({
          id: key,
          name: responseData[key].product,
          total: responseData[key].total,
          price: responseData[key].price,
          amount: responseData[key].amount,
          image: responseData[key].image,
          date: responseData[key].date,
          id_order: responseData[key].id_order
        });
      }

      setProds(loadedProds);
      setIsLoading(false);
    };

    fetchProds().catch((error) => {
      setIsLoading(false);
      // setHttpError(error.message);
    });
  }, []);

  if (isLoading) {
    return (
      <section className={classes.ProdsLoading}>
        <p>Loading...</p>
      </section>
    );
  }

  if (prods.length === 0) {
    return (
      <section className={classes.ProdsLoading}>
        <h1>Nenhum pedido foi encontrado!</h1>
      </section>
    );
  }

  if (httpError) {
    return (
      <section className={classes.ProdsError}>
        <p>{httpError}</p>
      </section>
    );
  }

  const prodsList = prods.map((prod) => (
    <Card id={prod.id} key={prod.id} className={classes.card}>
      <Order
        key={prod.id}
        id={prod.id}
        name={prod.name}
        total={prod.total}
        price={prod.price}
        amount={prod.amount}
        date={prod.date}
        image={prod.image}
        id_order={prod.id_order}
      />
    </Card>
  ));
  return (
    <section className={classes.prods}>
      <ul>{prodsList}</ul>
    </section>
  );
};
export default Orders;
