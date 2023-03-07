import { useEffect, useState } from "react";

import Card from "../UI/Card";
import Product from "../../pages/Product";
import classes from "./AvailableProducts.module.css";

const AvailableProducts = () => {
  const [prods, setProds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState();
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchProds = async () => {
      var response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/products`,
      );
      if (filter !== ""){
        response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/products/${filter}`,
        );
      }
        

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const responseData = await response.json();

      const loadedProds = [];

      for (const key in responseData) {
        loadedProds.push({
          id: responseData[key].id,
          name: responseData[key].name,
          price: responseData[key].price,
          score: responseData[key].score,
          image: responseData[key].image,
        });
      }

      setProds(loadedProds);
      setIsLoading(false);
    };

    fetchProds().catch((error) => {
      setIsLoading(false);
      // setHttpError(error.message);
    });
  }, [filter]);

  const filterChoice = (event) => {
    var newFilter = event.target.value;
    if (!newFilter){
      setFilter("")
      console.log(filter)
    } else {
      setFilter(newFilter)
      console.log(filter)
    }
  }
  // const value = document.getElementById("filterProductChoice").value;
  // console.log(value)

  if (isLoading) {
    return (
      <section className={classes.ProdsLoading}>
        <p>Loading...</p>
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
    <Card key={prod.id}>
      <Product
        key={prod.id}
        id={prod.id}
        name={prod.name}
        score={prod.score}
        price={prod.price}
        image={prod.image}
      />
    </Card>
  ));

  return (
    <section className={classes.prods}>
      <div className={classes.filterChoice}>
        <label htmlFor="#">ordenar: </label>
        <fieldset >
          <select id="filterProductChoice" onChange={filterChoice}>
            <option value="">-Ordene-</option>
            <option value="name">Nome</option>
            <option value="price">Preço</option>
            <option value="score">Score</option>
          </select>
        </fieldset>
      </div>

      <ul>{prodsList}</ul>
    </section>
  );
};

export default AvailableProducts;
