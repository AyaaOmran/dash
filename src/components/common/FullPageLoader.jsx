"use client";
import Player from "lottie-react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function FullPageLoader() {
  const [animationData, setAnimationData] = useState(null);

useEffect(() => {
  const fetchAnimation = async () => {
    try {
      const res = await axios.get("/animations/Book-Loader.json");
      setAnimationData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  fetchAnimation();
}, []);

  if (!animationData) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Player
        autoplay
        loop
        animationData={animationData}
        style={{ height: "150px", width: "150px" }}
      />
      <p className="mt-4 text-primary text-sm animate-pulse">Loading your data...</p>
    </div>
  );
}
