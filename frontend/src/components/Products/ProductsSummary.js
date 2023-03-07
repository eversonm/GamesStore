import classes from './ProductsSummary.module.css';

const ProductsSummary = () => {
  return (
    <section className={classes.summary}>
      <h2>Games Store</h2>
      <p>
        Nas compras acima de R$ 250, o frete é grátis!
      </p>
      <p>
        Jogos para PS4, Nintendo Switch e muitos mais (em breve).
      </p>
    </section>
  );
};

export default ProductsSummary;
