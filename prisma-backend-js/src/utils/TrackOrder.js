export const generateTrackingNumber = () => {
  return "TRK-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
};

export const getEstimatedDelivery = () => {
  const date = new Date();
  date.setDate(date.getDate() + 3); // 3 days delivery
  return date;
};
