import React from "react";
import ReactPlayer from "react-player";
import { CN } from "../../../utils/class-merge";

/* -------------------------------------------------------- */

type VideoPlayer = {
  src: string;
  autoPlay?: boolean;
  showControls?: boolean;
  allowPlayToggle: boolean;
  shouldMute: boolean;
  playIcon?: React.ReactElement;
  pauseIcon?: React.ReactElement;
  ContainerClassName?: string;
  PlayerClassName?: string;
  overlayClassName?: string;
};

/**
 * Video player.
 *
 * @returns ReactElement
 */
export default function VideoPlayer({
  src,
  autoPlay,
  showControls,
  allowPlayToggle,
  shouldMute,
  playIcon,
  pauseIcon,
  ContainerClassName,
  PlayerClassName,
  overlayClassName,
}: VideoPlayer) {
  const playerRef = React.useRef(null);

  const [player, setPlayer] = React.useState({
    playing: false,
    showOverlay: true,
  });

  const togglePlay = () => {
    if (allowPlayToggle) {
      setPlayer((prev) => ({
        playing: !prev.playing,
        showOverlay: prev.showOverlay,
      }));

      // Auto hide overlay
      setTimeout(
        () =>
          setPlayer((prev) => ({ ...prev, showOverlay: !prev.showOverlay })),
        300
      );
    }
  };

  const handlePlayEnd = () =>
    setPlayer((prev) => ({
      ...prev,
      playing: false,
      showOverlay: !prev.showOverlay,
    }));

  return (
    <div
      className={CN(
        "size-full relative rounded-md p-1 bg-gray-300",
        ContainerClassName
      )}
    >
      <ReactPlayer
        ref={playerRef}
        src={src}
        playing={player.playing}
        controls={player.showOverlay ? false : showControls ? true : false}
        autoPlay={autoPlay}
        muted={shouldMute}
        onEnded={handlePlayEnd}
        className={CN("!size-full rounded-md", PlayerClassName)}
      />

      {player.showOverlay && (
        <div
          className={CN(
            "player-overlay size-full absolute left-0 top-0 flex items-center justify-center bg-[#1c1c1ca6] cursor-pointer rounded-md",
            overlayClassName
          )}
          onClick={togglePlay}
        >
          {player.playing ? (
            !playIcon ? (
              <svg viewBox="0 0 24 24" width="50" height="50" fill="white">
                <rect x="6" y="5" width="4" height="14" />
                <rect x="14" y="5" width="4" height="14" />
              </svg>
            ) : (
              playIcon
            )
          ) : !pauseIcon ? (
            <svg viewBox="0 0 24 24" width="50" height="50" fill="white">
              <polygon points="6,4 20,12 6,20" />
            </svg>
          ) : (
            pauseIcon
          )}
        </div>
      )}
    </div>
  );
}
