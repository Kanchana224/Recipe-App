import React, { useState, useEffect } from "react";
import "../styles/likedProducts.css";
import { toast, ToastContainer } from "react-toastify";

const LikedProducts = () => {
  const [likedProducts, setLikedProducts] = useState([]);

  useEffect(() => {
    // Call the async function to fetch liked products when the component mounts
    fetchLikedProducts();
  }, []);

  const fetchLikedProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:2000/auth/likedRecipes",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      if (!response.ok) {
        toast.error("Failed to fetch liked products");
      }
  
      const data = await response.json();
  
      // Set the fetched data to the state
      setLikedProducts(data);
    } catch (error) {
      toast.error("Error fetching liked products:", error);
    }
  };

  const handleRemoveItem = async (recipeId) => {
    try {
      if (
        window.confirm(
          "Are you sure you wanna remove this recipe from favourites??"
        )
      ) {
        const response = await fetch(
          `http://localhost:2000/auth/removeLiked/${recipeId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          toast.success("Item Removed successfully");
          fetchLikedProducts(); // Fetch updated list of favorite recipes
        } else {
          const data = await response.json();
          toast.error(data.error);
        }
      }
    } catch (error) {
      toast.error("Error removing item from liked products:", error);
    }
  };

  const handleAddToFavorites = async (recipeId) => {
    try {
      const response = await fetch(
        `http://localhost:2000/auth/likedRecipes/${recipeId}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        toast.success("Recipe added to favorites successfully");
        fetchLikedProducts(); // Fetch updated list of favorite recipes
      } else {
        const data = await response.json();
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("An error occurred while adding to favorites:", error);
    }
  };

  return (
    <div className="likedRecipes">
      <h2>Favourites</h2>
      <ul>
        {likedProducts.map((product) => (
          <li key={product._id} className="list">
            <div>
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <img src={product.imageUrl} alt={product.title} />
              <h4>Ingredients:</h4>
              <ul>
                {product.ingredients.length > 0 && (
                  <ul className="ingredients-list">
                    {product.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                )}
              </ul>

              <div className="instructions-container">
                <h4>Instructions:</h4>
                <div className="instructions-list">
                  {product.instructions.split("\n").map((step, index) => (
                    <p key={index}>{step}</p>
                  ))}
                </div>
              </div>

              <button
                className="remove-item-button"
                onClick={() => handleRemoveItem(product._id)}
              >
                Remove Item
              </button>

              <button
                className="add-to-favorites-button"
                onClick={() => handleAddToFavorites(product._id)}
              >
                Add to Favorites
              </button>
            </div>
          </li>
        ))}
      </ul>
      <ToastContainer />
    </div>
  );
};

export default LikedProducts;
