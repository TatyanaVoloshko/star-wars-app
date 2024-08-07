import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import axios from "axios";
import "reactflow/dist/style.css";
import "./HeroDetail.css";

// Function to add a delay between API requests
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const HeroDetail = ({ hero }) => {
  // State hooks for managing nodes and edges in the graph
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true); // State to track loading status

  // Callback to handle new connections between nodes
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
    // Check if hero data is valid
    if (!hero || !hero.films || !hero.starships) {
      console.warn("Invalid hero data:", hero);
      return;
    }

    // Function to fetch details from the API
    const fetchDetails = async () => {
      const filmUrls = hero.films.map(
        (filmNumber) => `https://sw-api.starnavi.io//films/${filmNumber}/`
      );
      const starshipUrls = hero.starships.map(
        (starshipNumber) =>
          `https://sw-api.starnavi.io//starships/${starshipNumber}/`
      );

      try {
        // Fetch films
        const films = await Promise.all(
          filmUrls.map(async (url) => {
            try {
              await delay(1000); // Delay between requests
              const res = await axios.get(url);
              return res.data;
            } catch (error) {
              console.error(`Failed to fetch ${url}:`, error);
              return null;
            }
          })
        );

        // Filter valid films
        const validFilms = films.filter((film) => film !== null);

        // Create nodes and edges for films
        const filmNodes = validFilms.map((film, index) => ({
          id: `film-${film.id}`,
          data: { label: film.title },
          position: { x: 250, y: index * 70 },
          className: "film",
        }));

        const filmEdges = validFilms.map((film, index) => ({
          id: `e1-${index}`,
          source: "hero",
          target: `film-${film.id}`,
          type: "smoothstep",
        }));

        const newNodes = [
          {
            id: "hero",
            data: { label: hero.name },
            position: { x: 0, y: 0 },
            className: "hero",
          },
          ...filmNodes,
        ];

        const newEdges = [...filmEdges];

        // Fetch starships
        const starships = await Promise.all(
          starshipUrls.map(async (url) => {
            try {
              await delay(1000); // Delay between requests
              const res = await axios.get(url);
              return res.data;
            } catch (error) {
              console.error(`Failed to fetch ${url}:`, error);
              return null;
            }
          })
        );

        // Filter valid starships
        const validStarships = starships.filter(
          (starship) => starship !== null
        );

        // Create nodes and edges for starships
        validStarships.forEach((starship, index) => {
          starship.films.forEach((filmId) => {
            if (hero.films.includes(filmId)) {
              const starshipNode = {
                id: `starship-${starship.id}-${filmId}`,
                data: { label: starship.name },
                position: { x: 550, y: filmId * 70 + index * 50 },
                className: "starship",
              };

              const starshipEdge = {
                id: `e2-${starship.id}-${filmId}`,
                source: `film-${filmId}`,
                target: `starship-${starship.id}-${filmId}`,
                type: "smoothstep",
              };

              newNodes.push(starshipNode);
              newEdges.push(starshipEdge);
            }
          });
        });

        // Update state with new nodes and edges
        setNodes(newNodes);
        setEdges(newEdges);
      } catch (error) {
        console.error("Failed to fetch details:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchDetails();
  }, [hero, setNodes, setEdges]);

  return (
    <div className="diagram-container">
      {loading ? (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
          zoomOnScroll={true}
          zoomOnPinch={true}
          zoomOnDoubleClick={true}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      )}
    </div>
  );
};
