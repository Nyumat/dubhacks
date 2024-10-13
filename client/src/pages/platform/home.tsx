import Spaces from "@ably/spaces";
import { SpaceProvider, SpacesProvider } from "@ably/spaces/react";
import { getSpaceNameFromUrl } from "../../utils/helpers";
import Jam from "../jam";

export function PlatformHome({ spaces }: { spaces: Spaces }) {
    const spaceName = getSpaceNameFromUrl();
    return (
        <SpacesProvider client={spaces}>
            <SpaceProvider name={spaceName}>
                <Jam />
            </SpaceProvider>
        </SpacesProvider>
    )
}
