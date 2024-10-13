import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import background_dark from "../../assets/Background_dark1.png";
import background_light from "../../assets/Background_light1.png";
import { useTheme } from "@/components/theme-provider";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

export default function Login() {
  const { theme } = useTheme();
  const [backgroundImage, setBackgroundImage] = useState("");
  const { user } = useUser();

  useEffect(() => {
    if (theme === "dark") {
      setBackgroundImage(`url(${background_dark})`);
    } else if (theme === "light") {
      setBackgroundImage(`url(${background_light})`);
    } else {
      const isDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setBackgroundImage(
        `url(${isDarkMode ? background_dark : background_light})`
      );
    }
  }, [theme]);

  useEffect(() => {
    if (user) {
      const queryParams = new URLSearchParams({
        userId: user.id,
        email: user?.primaryEmailAddress?.emailAddress ?? "",
      });

      fetch(
        `https://dubjam-backend.onrender.com/user/create?${queryParams.toString()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .catch((error) => console.error("Error creating user:", error));
    }
  }, [user]);
  return (
    <div
      className="bg-gray-1000 min-h-screen flex flex-col items-center py-12 sm:py-24"
      style={{ backgroundImage }}
    >
      <div className="space-y-4 text-center">
        <div className="text-4xl font-bold">Welcome back to DubJam!</div>
        <div className="text-sm">Sign in to access your account.</div>
      </div>
      <Card className="w-full max-w-sm p-8 my-6">
        <CardContent className="space-y-4">
          <div className="space-y-2"></div>
          <Button className="w-full">
            <header>
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </header>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
