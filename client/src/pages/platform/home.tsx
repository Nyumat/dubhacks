import Spaces from "@ably/spaces";
import { SpaceProvider, SpacesProvider } from "@ably/spaces/react";
import Jam from "../jam";
import { getSpaceNameFromUrl } from "../../utils/helpers";

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
