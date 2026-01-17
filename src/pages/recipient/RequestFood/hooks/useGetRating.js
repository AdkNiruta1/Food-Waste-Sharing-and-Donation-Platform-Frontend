import { useState, useContext } from "react";
import {  getUserRatingsService } from "../services/ratingServices";
import { AppContext } from "../../../../context/ContextApp";

export const useGetUserRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useContext(AppContext);

  const getUserRatings = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const res = await getUserRatingsService(id);
      setRatings(res.data.ratings);       
      return res;
    } catch (err) {
      setError(err.message);
      showToast(err.message || "Failed to fetch ratings", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    ratings,
    loading,
    error,
    getUserRatings,
  };
};
