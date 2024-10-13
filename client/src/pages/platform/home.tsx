import Spaces from "@ably/spaces";
import { SpaceProvider, SpacesProvider } from "@ably/spaces/react";
import { getSpaceNameFromUrl } from "../../utils/helpers";
import Jam from "../jam";
import { useEffect, useState } from "react"
import background_dark from "../../assets/Background_dark1.png";
import background_light from "../../assets/Background_light1.png";
import { useTheme } from "@/components/theme-provider"

export function PlatformHome({ spaces }: { spaces: Spaces }) {
  const { theme } = useTheme();
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    if (theme === 'dark') {
      setBackgroundImage(`url(${background_dark})`);
    } else if (theme === 'light') {
      setBackgroundImage(`url(${background_light})`);
    } else {
      const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setBackgroundImage(`url(${isDarkMode ? background_dark : background_light})`);
    }
  }, [theme]);

    const spaceName = getSpaceNameFromUrl();
    return (
      <div style={{ backgroundImage }}>
        <SpacesProvider client={spaces}>
            <SpaceProvider name={spaceName}>
                <Jam />
            </SpaceProvider>
        </SpacesProvider>
      </div>
    )
}
