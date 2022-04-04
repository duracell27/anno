import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function MainPage() {
  const auth = useContext(AuthContext);
  const [resources, setResources] = useState([]);
  const [werehouses, setWerehouses] = useState([]);
  const [werehouseCapacity, setWerehouseCapacity] = useState(0);
  const [showBuildings, setShowBuildings] = useState({ show: false, index: null });
  const showBuildingsHandler = (index) => {
    setShowBuildings({ show: !showBuildings.show, index: index });
  }

  const getResourcesList = () => {
    axios.get(`/api/resources?userId=${auth.userId}`).then((response) => {
      setResources([...response.data.resourcesList.resources]);
      setWerehouseCapacity(response.data.resourcesList.resourcesCapacity);
    });
  };

  const getResidentialIndustries = () => {
    axios.get(`/api/buildings/werehouse?userId=${auth.userId}`).then((response) => {
      setWerehouses([...response.data.werehouseList])
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

  const buildLumberjackHut = useCallback((werehouseId) => {
    axios.get(`/api/build/lumberjackHut?userId=${auth.userId}&werehouseId=${werehouseId}`).then(
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
    getResidentialIndustries()
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
        {werehouses.map((werehouse, index) => (
          <div className="werehouseWrap" key={index}>
            <div className="werehouseImg">
              <img src={require(`../img/buildings/${werehouse.name}.webp`)}
                alt="icon" />
            </div>
            <div className="werehouseBuildings">
              {werehouse.places.map((place) => (
                <div className="werehouseBuildings_img">
                  <img src={require(`../img/buildings/${place.name}.webp`)} alt="icon" />
                </div>
              ))}
              {werehouse.places.length < 3 ? (<div className="werehouseBuildings_img">
                <img onClick={() => showBuildingsHandler(index)} src={require(`../img/buildings/Пусто.webp`)} alt="icon" />
                {showBuildings.index === index && showBuildings.show ? (<div className="allBuildings">
                  <div onClick={() => buildLumberjackHut(werehouse._id)} className="building_wrap">
                    <img src={require(`../img/buildings/ХижинаЛісниика.webp`)} alt="icon" />
                    <p>Хижина лісника</p>
                  </div>
                </div>) : null}
              </div>) : null}
            </div>
          </div>
        ))}
        <button onClick={buildWerehouse}>купити склад</button>
      </div>
    </div>
  );
}
