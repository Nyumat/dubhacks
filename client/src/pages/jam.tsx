import { useMemo, useRef, useEffect, useState } from "react";
import { useMembers, useSpace } from "@ably/spaces/react";
import { mockNames } from "../utils/mockNames";
import { colours } from "../utils/helpers";
import { MemberCursors, YourCursor } from "../components/Cursors";
import { Soundboard } from "./platform/soundboard";
import * as Ably from 'ably';

import type { Member } from "../utils/types";

import styles from "../assets/LiveCursors.module.css";

/** 💡 Select a mock name to assign randomly to a new user that enters the space 💡 */
const mockName = () => mockNames[Math.floor(Math.random() * mockNames.length)];

const Jam = () => {
  const [ably, setAbly] = useState<Ably.Realtime | null>(null);  // State to store Ably instance
  const [channel, setChannel] = useState<Ably.RealtimeChannel | null>(null);  // State to store the Ably channel

  const name = useMemo(mockName, []);
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
    // Create the Ably client and wait for the connection
    const ablyClient = new Ably.Realtime(import.meta.env.VITE_ABLY_KEY);

    ablyClient.connection.once('connected', () => {
      setAbly(ablyClient);  // Set the Ably instance once connected
    });

    // Cleanup the Ably connection on unmount
    return () => {
      ablyClient.connection.close();
    };
  }, []);

  useEffect(() => {
    if (ably && space) {
      space.enter({ name, userColors });  // Enter the space when Ably is ready

      const newOrFetchedChannel = ably.channels.get(space.name);
      setChannel(newOrFetchedChannel);  // Set the channel

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
};

export default Jam;