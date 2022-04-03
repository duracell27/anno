import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function MainPage() {
  const auth = useContext(AuthContext);
  const [resources, setResources] = useState([]);
  const [werehouseCapacity, setWerehouseCapacity] = useState(0);

  const getResourcesList = () => {
    axios.get(`/api/resources?userId=${auth.userId}`).then((response) => {
      setResources([...response.data.resourcesList.resources]);
      setWerehouseCapacity(response.data.resourcesList.resourcesCapacity);
    });
  };

  const buildWerehouse = useCallback(() => {
    axios.get(`/api/build/werehouse?userId=${auth.userId}`).then(
      (response) => {
        if (response.data.bought) {
          getResourcesList();
        } else {
          alert(response.data.message);
        }
      },
      [auth.userId]
    );
  });

  useEffect(() => {
    getResourcesList();
  }, []);

  return (
    <div>
      <div className="resourcesContainer">
        {resources.map((resource, index) => (
          <div key={index} className="resourceWrap">
            <div className="resourceCard">
              <img
                src={require(`../img/resources/${resource.name}.webp`)}
                alt="icon"
              />
              <div className="capacityWrap">
                <div
                  className="capacityBar"
                  style={{
                    height: `${(resource.amount * 100) / werehouseCapacity}%`,
                  }}
                ></div>
              </div>
            </div>
            <span>{resource.amount}</span>
          </div>
        ))}
      </div>
      <div className="industrialContainer">
        <button onClick={buildWerehouse}>купити склад</button>
      </div>
    </div>
  );
}
