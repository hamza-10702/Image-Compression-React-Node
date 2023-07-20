const baseURL = "http://localhost:5001/api";
const postHeader = (formData) => {
  const options = {
    method: "POST",
    body: formData,
  };

  return options;
};

const getHeader = () => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  return options;
};

export const postImages = async (endPoint, formData) => {
  try {
    const response = await fetch(`${baseURL}${endPoint}`, postHeader(formData));
    const data = await response.json();
    if (data) {
      return data;
    }
  } catch (error) {
    return error;
  }
};
export const getImages = async (endPoint) => {
  try {
    const response = await fetch(`${baseURL}${endPoint}`, getHeader());
    const data = await response.json();
    console.log(data);
    if (data) {
      return data;
    }
  } catch (error) {
    return error;
  }
};
