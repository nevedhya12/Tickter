import React from "react";

function ReSellMarket() {
  return (
    <div>
      <h1>Sell Your Items</h1>
      <form>
        <label>Item Name:</label>
        <input type="text" required /><br /><br />

        <label>Price:</label>
        <input type="number" required /><br /><br />

        <label>Description:</label>
        <textarea></textarea><br /><br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ReSellMarket;