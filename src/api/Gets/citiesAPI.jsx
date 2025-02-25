import axiosInstance from "../axiosInstance";

const fetchCities = async () => {
  try {
    const response = await axiosInstance.get("/utils/get_cities");
    const data = response.data;
    if (data.success && Array.isArray(data.cities)) {
      return data.cities;
    } else {
      console.error("داده‌های نامعتبر دریافت شد:", data);
      return [];
    }
  } catch (error) {
    console.error("خطا در دریافت اطلاعات شهرها:", error);
    return [];
  }
};

export default fetchCities;
