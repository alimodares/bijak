const Apicalculation = async (
  destinationCityId,
  formDataWithoutCommas,
  setData,
  setLoading,
  setError,
  inputLng,
  inputLat
) => {
  setLoading(true);
  setError(null);

  try {
    const response = await fetch(
      "https://test-bjakapi.liara.run/utils/single_price",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lng: inputLng,
          lat: inputLat,
          ...formDataWithoutCommas,
          destination_city_id: destinationCityId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("مشکلی در دریافت اطلاعات وجود دارد!");
    }

    const result = await response.json();
    setData(result);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

export default Apicalculation;
