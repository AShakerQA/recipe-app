import "dotenv/config";
const apiKey = process.env.API_KEY;

export const searchRecipes = async (searchTerm: string, page: number) => {
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const url = new URL("https://api.spoonacular.com/recipes/complexSearch");

  const queryParams = {
    apiKey: apiKey,
    query: searchTerm,
    number: "10",
    offset: (page * 10).toString(),
  };
  //   console.log("abdul");
  //   console.log(queryParams);
  url.search = new URLSearchParams(queryParams).toString(); //attach query params to end of url

  try {
    const searchResponse = await fetch(url);
    // console.log(searchResponse);
    const resultsJson = await searchResponse.json();
    return resultsJson;
  } catch (error) {
    console.log(error);
  }
};
