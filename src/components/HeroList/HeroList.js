import React, { useEffect, useState } from "react";
import axios from "axios";
import "./HeroList.css";
import Modal from "../Modal/Modal";
import { HeroDetail } from "../HeroDetail/HeroDetail";

export const HeroList = ({ onHeroSelect }) => {
  // State to store heroes, current page, and if there are more pages to load
  const [heroes, setHeroes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Track if there are more pages to load
  const [selectedHero, setSelectedHero] = useState(null); // Track the selected hero for the modal
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch heroes from the API
    const fetchHeroes = async () => {
      try {
        const response = await axios.get(
          `https://sw-api.starnavi.io/people?page=${page}`
        );
        const newHeroes = response.data.results;

        // Check and filter duplicate data
        setHeroes((prevHeroes) => {
          const prevHeroIds = new Set(prevHeroes.map((hero) => hero.id));
          const uniqueNewHeroes = newHeroes.filter(
            (hero) => !prevHeroIds.has(hero.id)
          );
          return [...prevHeroes, ...uniqueNewHeroes];
        });

        // Check if there are more pages to load
        if (!response.data.next) {
          setHasMore(false);
        }
        setError(null); // Clear error state if fetch is successful
      } catch (error) {
        console.error("Error fetching heroes:", error);
        setError("Failed to fetch heroes. Please try again later.");
      }
    };

    fetchHeroes();
  }, [page]); // Dependency array ensures this runs when 'page' changes

  // Function to handle selecting a hero and opening the modal
  const handleHeroSelect = (hero) => {
    setSelectedHero(hero);
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedHero(null);
  };

  return (
    <div>
      <header>Star Wars</header>
      <p className="info-text">
        Click on a hero to see more detailed information about them.
      </p>
      {error && <p className="error-text">{error}</p>}{" "}
      {/* Display error message */}
      <div className="hero-list">
        {heroes.map((hero) => {
          const heroId = hero.id;
          const heroImage = `https://starwars-visualguide.com/assets/img/characters/${heroId}.jpg`;

          return (
            <div
              key={heroId}
              className="hero-card"
              onClick={() => handleHeroSelect(hero)}
            >
              <img src={heroImage} alt={hero.name} />
              <p>{hero.name}</p>
            </div>
          );
        })}
      </div>
      <button
        className="load-more-btn"
        onClick={() => setPage(page + 1)}
        disabled={!hasMore} // Disable button if there are no more pages to load
      >
        Load more
      </button>
      <Modal isOpen={selectedHero !== null} onClose={closeModal}>
        {selectedHero && <HeroDetail hero={selectedHero} />}
      </Modal>
    </div>
  );
};
