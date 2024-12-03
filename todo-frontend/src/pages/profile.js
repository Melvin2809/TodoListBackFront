import Sidebar from "@/components/Sidebar";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileDetails from "@/components/ProfileDetails";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = getCookie("authToken");
    if (!token) {
      router.push("/auth/login"); // Redirige si non authentifié
      return;
    }

    fetch("http://localhost:3001/auth/profile", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération du profil.");
        }
        return response.json();
      })
      .then((data) => setProfile(data))
      .catch((error) =>
        console.error("Erreur lors de la récupération du profil :", error)
      );
  }, [router]);

  return (
    <div className="flex overflow-hidden">
      <Sidebar />
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
          <ProfileHeader />
          <div className="border-t border-gray-100 px-10 pb-5">
            {profile ? (
              <ProfileDetails profile={profile} />
            ) : (
              <p className="text-gray-500">Chargement du profil...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
