import React, { useEffect, useMemo, useRef, useState } from "react";
import shuffle from "lodash-es/shuffle";

const MemoryGame = ({ images }) => {
  const gameImages = useMemo(() => shuffle([...images, ...images]), [images]);
  const [openedImages, setOpenedImages] = useState([]); // [3,4]
  const [matchedImages, setMatchedImages] = useState({}); // all the flipped matched cards index will be made true
  const timeoutRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (openedImages.length !== 2) return;

    const [firstFlippedImgIndex, secondFlippedImgIndex] = openedImages;
    if (
      gameImages[firstFlippedImgIndex] === gameImages[secondFlippedImgIndex]
    ) {
      // Match found
      setMatchedImages((prev) => ({
        ...prev,
        [firstFlippedImgIndex]: true,
        [secondFlippedImgIndex]: true,
      }));
      setOpenedImages([]);
    } else {
      // No match: flip them back after a delay
      timeoutRef.current = setTimeout(() => {
        setOpenedImages([]);
      }, 1000);
    }
  }, [openedImages, gameImages]);

  useEffect(() => {
    // Check for end-game condition
    const totalCards = gameImages.length;
    const matchedCount = Object.keys(matchedImages).length;
    if (matchedCount === totalCards) {
      setGameOver(true);
    }
  }, [matchedImages, gameImages.length]);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const toggleFlip = (index) => {
    if (
      openedImages.includes(index) ||
      matchedImages[index] ||
      openedImages.length === 2
    ) {
      return;
    }
    setOpenedImages((prev) => [...prev, index]);
    setCounter(counter + 1);
  };

  return (
    <>
      <div
        className={`mx-auto p-10 justify-center h-screen w-10/12 2xl:w-2/3" ${
          gameOver && "overflow-hidden"
        }`}
      >
        {gameOver && (
          <div className="absolute top-0 left-0 size-full backdrop:backdrop-blur-xl flex text-center justify-center p-3 text-3xl font-extrabold text-black bg-slate-100 opacity-90 overflow-hidden">
            <div className="relative top-[45%]">
              Congratulations! You won! 🎉
              <br />
              <span
                onClick={() => {
                  location.reload();
                }}
              >
                Play Again!!!
              </span>
            </div>
          </div>
        )}{" "}
        <div className="h-full">
          <div className="w-11/12">
            <div className="delius text-center text-cyan-600 pb-3 text-3xl font-medium">
              Test Your Brain
            </div>
            <div className="text-right prata px-5 pb-3 text-xl ">
              Best Score : 15
            </div>
            <div className="text-right prata px-5 pb-3 text-xl ">
              Moves : {counter}
            </div>
          </div>
          <div className="flex flex-wrap gap-3 justify-center pb-15">
            {gameImages.map((image, index) => {
              const isFlipped =
                openedImages.includes(index) || matchedImages[index];
              //const isFlipped = flipped[index] || false;
              return (
                <div
                  className="p-0 justify-evenly"
                  key={index}
                  onClick={() => toggleFlip(index)}
                >
                  {isFlipped ? (
                    <img src={image} className="card-size" />
                  ) : (
                    <div className="card-size bg-slate-400"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default MemoryGame;
