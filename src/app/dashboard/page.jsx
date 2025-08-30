"use client";

import "@/styles/globals.css";
import "@/lib/fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DashboardCard from "@/components/features/dashboard/DashboardCard";
import FullPageLoader from "@/components/common/FullPageLoader";
import axios from "axios";
import PermissionGuard from "@/components/features/guard/PermissionGuard";

export default function Dashboard() {
  const [numbers, setNumbers] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        // console.log("Token:", token);

        const respo = await axios.get(
          "http://127.0.0.1:8000/api/book/getNumbers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (respo.data.success) {
          setNumbers(respo.data.data);
        } else {
          toast.error("An error occurred while loading the data.");
        }
      }catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update challenge');
          } 
    };

    fetchData();
  }, []);

  if (!numbers) {
    return <FullPageLoader />;
  }

  const stats = [
    {
      icon: "la:book-reader",
      title: "Total Readers",
      number:
        numbers && numbers.number_of_readers ? numbers.number_of_readers : 0,
    },
    {
      icon: "mdi:account-cog-outline",
      title: "Total Admins",
      number:
        numbers && numbers.number_of_admins ? numbers.number_of_admins : 0,
    },
    {
      icon: "mdi:book-open-variant-outline",
      title: "Total Books",
      number: numbers && numbers.number_of_books ? numbers.number_of_books : 0,
    },
    {
      icon: "mdi:trophy-outline",
      title: "Total Challenges",
      number:
        numbers && numbers.number_of_challenges
          ? numbers.number_of_challenges
          : 0,
    },
    {
      icon: "mdi:medal-outline",
      title: "Total Badges",
      number:
        numbers && numbers.number_of_badges ? numbers.number_of_badges : 0,
    },
    {
      icon: "mdi:view-grid-outline",
      title: "Total Categories",
      number:
        numbers && numbers.number_of_categories
          ? numbers.number_of_categories
          : 0,
    },
  ];

  return (
    <PermissionGuard allowedRoles={["admin", "super_admin"]}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {stats.map((stat, index) => (
          <DashboardCard
            key={index}
            icon={stat.icon}
            title={stat.title}
            number={stat.number}
          />
        ))}
      </div>
    </PermissionGuard>
  );
}
