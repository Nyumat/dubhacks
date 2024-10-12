import Spaces from "@ably/spaces";
import { SpaceProvider, SpacesProvider } from "@ably/spaces/react";
import Jam from "./jam";
import { getSpaceNameFromUrl } from "../utils/helpers";

const spaceName = getSpaceNameFromUrl();

const LiveCursors = ({ spaces }: { spaces: Spaces }) => (
  <SpacesProvider client={spaces}>
    <SpaceProvider name={spaceName}>
      <Jam />
    </SpaceProvider>
  </SpacesProvider>
);

export default LiveCursors;
