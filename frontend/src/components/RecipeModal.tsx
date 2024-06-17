import { useEffect, useState } from "react";
import { RecipeSummary } from "../types";
import * as RecipeAPI from "../api";

interface Props {
  recipeId: string;
  onClose: () => void;
}

const RecipeModal = ({ recipeId, onClose }: Props) => {
  const [recipeSummary, setRecipeSummary] = useState<RecipeSummary>();

  useEffect(() => {
    const fetchRecipeSummary = async () => {
      try {
        const recipeSummary = await RecipeAPI.getRecipeSummary(recipeId);
        setRecipeSummary(recipeSummary);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRecipeSummary();
  }, [recipeId]); //add dependency Array, useEffect logic runs anytime the recipeId changes

  if (!recipeSummary) {
    return <></>;
  }
  return (
    <>
      <div className="overlay"></div>
      <div className="modal">
        <div className="modal-content">
          <div className="modal-content-header">
            <h2>{recipeSummary.title}</h2>
            <span className="close-btn" onClick={onClose}>
              &times;
            </span>
          </div>
          <p dangerouslySetInnerHTML={{ __html: recipeSummary.summary }}></p>
        </div>
      </div>
    </>
  );
};

export default RecipeModal;
