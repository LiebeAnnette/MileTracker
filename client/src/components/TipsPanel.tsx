
import React, { useMemo } from 'react';

const tips = [
    "You can burn calories while driving! On average, you can burn about 150 calories per hour just by staying alert behind the wheel.",

    "The world's shortest street is Ebenezer Place in Scotland, it's only 6.8 feet long!",

    "Studies show that solo road trips can improve mood and creativity by providing time to think without digital distractions.",

    "You can use apps for fun detours. Apps like Roadtrippers, Atlas Obscura or GasBuddy can find you fun and quirky attractions to make your drive feel shorter!",

    "Helpful tip; always keep a physical map on hand. GPS fails sometimes, a good old-fashioned map is a great backup!",

    "Create a loose itinerary! Have major stops planned, but allow some flexibility. Spontaneous detours often lead to the best memories!",
];

const getRandomTips = (array: string[], count: number): string[] => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

const TipsPanel: React.FC = () => {
    const displayedTips = useMemo(() => getRandomTips(tips, 3), []);

    return (
        <div className="bg-[color:var(--sky)] border-l-4 border-[color:var(--orange)] p-6 rounded-xl shadow-md w-full max-w-3xl mx-auto my-6">
            <h3 className="heading-md text-[color:var(--prussian)] mb-3">
                🚗 Fun Travel Tips & Facts 🚗
            </h3>
            <ul className="list-disc list-inside text-[color:var(--prussian)] body-text space-y-2">
                {displayedTips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                ))}
            </ul>
        </div>
    );
};

export default TipsPanel;

import React, { useEffect, useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";

const GET_PARK_FACT = gql`
  query GetParkFact {
    getParkFact
  }
`;

const fetchUselessFact = async (): Promise<string> => {
  const response = await fetch(
    "https://uselessfacts.jsph.pl/random.json?language=en"
  );
  const data = await response.json();
  return data.text;
};

const TipsPanel: React.FC = () => {
  const [fact, setFact] = useState<string>("Loading a fun fact...");
  const [loading, setLoading] = useState<boolean>(true);
  const [useParkNext, setUseParkNext] = useState<boolean>(false);

  const [loadParkFact] = useLazyQuery(GET_PARK_FACT, {
    fetchPolicy: "network-only", // 👈 this forces a new request every time
    onCompleted: (data) => {
      setFact(data.getParkFact);
      setLoading(false);
    },
    onError: () => {
      setFact("Couldn't fetch a park fact this time. Try again!");
      setLoading(false);
    },
  });

  const loadFact = async () => {
    setLoading(true);
    if (useParkNext) {
      loadParkFact(); // triggers GraphQL query
    } else {
      try {
        const result = await fetchUselessFact();
        setFact(result);
      } catch {
        setFact("Couldn't fetch a useless fact this time. Try again!");
      } finally {
        setLoading(false);
      }
    }
    setUseParkNext((prev) => !prev); // alternate for next time
  };

  useEffect(() => {
    loadFact();
  }, []);

  return (
    <div className="bg-[color:var(--sky)] border-l-4 border-[color:var(--orange)] p-6 rounded-xl shadow-md w-full max-w-3xl mx-auto my-6 text-center">
      <h3 className="text-4xl font-bold text-[color:var(--prussian)] mb-4">
        Fun Facts Checkpoint
      </h3>

      <p className="text-[color:var(--prussian)] text-xl md:text-2xl italic mb-6 min-h-[6rem] flex items-center justify-center">
        {loading ? "Loading..." : fact}
      </p>

      <button
        onClick={loadFact}
        className="px-5 py-2 rounded-lg bg-[color:var(--orange)] hover:bg-[color:var(--yellow)] text-white font-semibold transition"
      >
        Show Another Fact
      </button>
    </div>
  );
};

export default TipsPanel;

