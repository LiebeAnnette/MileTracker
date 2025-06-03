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