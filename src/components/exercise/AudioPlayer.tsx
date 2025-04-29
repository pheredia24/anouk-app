import { FC, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  audioUrl: string;
  autoPlay?: boolean;
}

const AudioPlayer: FC<AudioPlayerProps> = ({ audioUrl, autoPlay = true }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleReplay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play();
    }
  }, [audioUrl, autoPlay]);

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <audio ref={audioRef} src={audioUrl} />
      <button
        onClick={handleReplay}
        className="w-full py-3 px-6 rounded-full bg-[#1CB0F6] text-white hover:bg-opacity-90 flex items-center justify-center gap-2 text-lg font-semibold"
        aria-label="Réécouter l'audio"
      >
        🔊 Écoute et traduis
      </button>
    </div>
  );
};

export default AudioPlayer; 