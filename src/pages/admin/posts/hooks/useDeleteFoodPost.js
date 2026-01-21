import { useState, useContext } from "react";
import { deletePostService } from "../services/postServices";
import { AppContext } from "../../../../context/ContextApp";

export const useDeleteFoodPost = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useContext(AppContext);

  const deletePost = async (id) => {
    setLoading(true);
    try {
      const res = await deletePostService(id);
      showToast("Post deleted successfully", "success");
      return res;
    } catch (err) {
      showToast(err.message || "Delete failed", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deletePost, loading };
};
