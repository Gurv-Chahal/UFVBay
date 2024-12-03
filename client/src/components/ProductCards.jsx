import "../public/ProductCards.css";

function ProductCards(props) {
  //ProductCards component takes in a  value from the object
  return (
    <>
      {/* Styling for cards */}
      <div className="card" style={{ width: "18rem" }}>
        {/* What to do with each attribute from the passed down object */}
        <img className="card-img-top" src={props.image} alt="Card image cap" />
          <div className="card-body">
              <h5 className="small-text ellipsis-text">{props.name}</h5>
              <p className="card-title">{props.price}</p>
          </div>
      </div>
    </>
  );
}

export default ProductCards;
