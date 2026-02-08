  export const randomFutureDate = () => {
    const now = new Date();
    const randomDays = Math.floor(Math.random() * 10) + 1; // 1–10 days
    const randomHours = Math.floor(Math.random() * 24);

    now.setDate(now.getDate() + randomDays);
    now.setHours(now.getHours() + randomHours);

    return now;
  };
  export const getCountdown = (targetDate: Date): string => {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) return "Event started";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${days} days ${hours} hours remaining`;
  };