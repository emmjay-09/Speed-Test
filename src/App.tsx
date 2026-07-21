import { useEffect, useState } from "react";
import passagesData from "../typing-speed-test-main/data.json";

type Difficulty = "easy" | "medium" | "hard";
type Passage = { id: string; text: string };
type PassagesData = {
  easy: Passage[];
  medium: Passage[];
  hard: Passage[];
};

const passages = passagesData as PassagesData;

function Navbar() {
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [buttonText, setButtonText] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [passage, setPassage] = useState("");

  const getRandomPassage = (level: Difficulty) => {
    const list = passages[level];
    return list[Math.floor(Math.random() * list.length)]?.text ?? "";
  };

  useEffect(() => {
    setPassage(getRandomPassage(difficulty));
  }, [difficulty]);

  useEffect(() => {
    if (!isRunning) return;

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setIsRunning(false);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isRunning) {
        setIsRunning(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isRunning]);

  const handleClick = () => {
    if (!isRunning) {
      setIsRunning(true);
    }
    if (!buttonText) {
      setButtonText(true);
    }
  };

  const handleDifficultyClick = (level: Difficulty) => {
    setDifficulty(level);
    setIsRunning(false);
    setTimeLeft(60);
    setButtonText(false);
  };

  const getButtonClasses = (level: Difficulty) => {
    const isActive = difficulty === level;
    const baseClasses =
      "rounded-full px-3 py-1 text-sm transition duration-200 ease-in-out hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900";
    const difficultyClasses = {
      easy: "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 focus:ring-emerald-300",
      medium:
        "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 focus:ring-amber-300",
      hard: "bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 focus:ring-rose-300",
    };
    const activeClasses = isActive ? "ring-2 ring-white/30" : "";
    return `${baseClasses} ${difficultyClasses[level]} ${activeClasses}`;
  };

  return (
    <main className="min-h-screen items-start justify-start bg-slate-950 px-6 py-10 text-slate-100">
      <section className="mx-auto flex max-w-3xl flex-col gap-6 rounded-2xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] m-0 text-cyan-400">
            Typing Speed Test
          </p>
          <h1>Type as fast as you can in 60 seconds</h1>
        </div>

        <div className="flex gap-10">
          <div>WPM: 0</div>
          <div>Accuracy: 0%</div>
          <div>Time: {timeLeft}</div>
          <div>
            <button
              className="rounded-full bg-gray-500/20 px-3 py-1 text-sm text-gray-300 transition duration-200 ease-in-out hover:scale-105 hover:bg-gray-500/30 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:ring-offset-slate-900"
              onClick={() => {
                if (isRunning) {
                  setIsRunning(false);
                } else {
                  setTimeLeft(60);
                  setIsRunning(true);
                }
              }}
              style={{ display: buttonText ? "inline-flex" : "none" }}
            >
              {isRunning ? "Pause" : "Restart"}
            </button>
          </div>
        </div>

        <div className="text-lg font-medium p-1">Difficulty:</div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className={getButtonClasses("easy")}
            onClick={() => handleDifficultyClick("easy")}
          >
            Easy
          </button>
          <button
            type="button"
            className={getButtonClasses("medium")}
            onClick={() => handleDifficultyClick("medium")}
          >
            Medium
          </button>
          <button
            type="button"
            className={getButtonClasses("hard")}
            onClick={() => handleDifficultyClick("hard")}
          >
            Hard
          </button>
        </div>

        <div className="relative rounded-2xl border border-slate-700/80 bg-slate-950/70 p-6 text-slate-200">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
            Passage
          </p>
          <p className={`mt-4 leading-8 transition-opacity duration-200 ${!isRunning ? "opacity-20" : "opacity-100"}`}>
            {passage}
          </p>

          <button
            style={{ display: isRunning ? "none" : "inline-flex" }}
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/80 px-6 py-5 text-sm text-cyan-300 shadow-xl transition duration-200 ease-in-out hover:scale-105 hover:bg-cyan-500/90 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-900"
            onClick={handleClick}
          >
            {buttonText ? "Continue" : "Start"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default Navbar;
