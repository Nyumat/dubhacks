import { useMembers, useSpace } from "@ably/spaces/react";
import * as Ably from "ably";
import { useEffect, useMemo, useRef, useState } from "react";
import { MemberCursors, YourCursor } from "../components/Cursors";
import { colours } from "../utils/helpers";
// import { mockNames } from "../utils/mockNames";
import { Soundboard } from "./platform/soundboard";

import type { Member } from "../utils/types";

import { useSession } from "@clerk/clerk-react";
import styles from "../assets/LiveCursors.module.css";

/** 💡 Select a mock name to assign randomly to a new user that enters the space 💡 */
// const mockName = () => mockNames[Math.floor(Math.random() * mockNames.length)];

export function Jam() {
  const [ably, setAbly] = useState<Ably.Realtime | null>(null); // State to store Ably instance
  const [channel, setChannel] = useState<Ably.RealtimeChannel | null>(null); // State to store the Ably channel
  const auth = useSession();
  const userName = () => auth.session?.user.fullName ?? "Anonymous";
  const name = useMemo(userName, []);
  /** 💡 Select a color to assign randomly to a new user that enters the space 💡 */
  const userColors = useMemo(
    () => colours[Math.floor(Math.random() * colours.length)],
    []
  );

  /** 💡 Get a handle on a space instance 💡 */
  const { space } = useSpace();
  const { self } = useMembers();
  const liveCursors = useRef(null);

  useEffect(() => {
    const ablyClient = new Ably.Realtime(import.meta.env.VITE_ABLY_KEY);
    ablyClient.connection.once("connected", () => {
      setAbly(ablyClient);
    });
    return () => {
      ablyClient.connection.close();
    };
  }, []);

  useEffect(() => {
    if (ably && space) {
      space.enter({ name, userColors });

      const newOrFetchedChannel = ably.channels.get(space.name);
      setChannel(newOrFetchedChannel);
    }
  }, [ably, space]);

  return (
    <div
      id="live-cursors"
      ref={liveCursors}
      className={`example-container ${styles.liveCursorsContainer}`}
    >
      <Soundboard channel={channel} />
      <YourCursor self={self as Member | null} parentRef={liveCursors} />
      <MemberCursors />
    </div>
  );
}

export default Jam;
