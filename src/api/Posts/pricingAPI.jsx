import axiosInstance from "../axiosInstance";

export const fetchPricing = async ({
  goods_details,
  inputLng,
  inputLat,
  destination_city_id,
  value,
  setLoading,
  isCalculatingRef,
  setData,
  setFinalPrice,
  setError,
}) => {
  setLoading(true);
  isCalculatingRef.current = true;
  try {
    const response = await axiosInstance.post(
      "/utils/single_pricing",
      {
        goods_details,
        lng: inputLng,
        lat: inputLat,
        destination_city_id,
        value,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    const result = response.data;
    setData(result);
    setFinalPrice(result.prices.amount);
  } catch (err) {
    console.error("Error fetching pricing:", err);
    setError(
      err.response?.data?.message || "مشکلی در دریافت اطلاعات وجود دارد!"
    );
  } finally {
    setLoading(false);
    isCalculatingRef.current = false;
  }
};
