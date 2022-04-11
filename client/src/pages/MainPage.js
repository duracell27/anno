import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function MainPage() {
  const auth = useContext(AuthContext);
  const [resources, setResources] = useState([]);
  const [tikResourcesShow, setTikResourcesShow] = useState([]);
  const [werehouses, setWerehouses] = useState([]);
  const [marketplaces, setMarketplaces] = useState([]);
  const [buildingPricesInd, setBuildingPricesInd] = useState([]);
  const [buildingPricesRes, setBuildingPricesRes] = useState([]);
  const [buildingPricesHouse, setBuildingPricesHouse] = useState([]);
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
    axios.get(`/api/buildings/marketplace?userId=${auth.userId}`).then((response) => {
      setMarketplaces([...response.data.marketplaceList])
    });
  };
  const getBuildingsForBuild = () => {
    axios.get(`/api/buildingsforbuild?industrial=industrial`).then((response) => {
      setBuildingPricesInd([...response.data.buildingsArray])
      axios.get(`/api/buildingsforbuild?industrial=residential`).then((response) => {
        setBuildingPricesRes([...response.data.buildingsArray])
        axios.get(`/api/buildingsforbuild?industrial=house`).then((response) => {
          setBuildingPricesHouse([...response.data.buildingsArray])
        });
      });
    });
    
  };



  const buildWerehouse = useCallback(() => {
    axios.get(`/api/build/werehouse?userId=${auth.userId}`).then(
      (response) => {
        if (response.data.bought) {
          getResourcesList();
          getResidentialIndustries();
        } else {
          alert(response.data.message);
        }
      },
      [auth.userId]
    );
  });

  const buildMarketplace = useCallback(() => {
    axios.get(`/api/build/marketplace?userId=${auth.userId}`).then(
      (response) => {
        if (response.data.bought) {
          getResourcesList();
          getResidentialIndustries();
        } else {
          alert(response.data.message);
        }
      },
      [auth.userId]
    );
  });

  const buildInWerehouse = useCallback((werehouseId, buildingName) => {
    if (buildingName === "ХижинаЛісниика") {
      axios.get(`/api/build/lumberjackHut?userId=${auth.userId}&werehouseId=${werehouseId}`).then(
        (response) => {
          if (response.data.bought) {
            getResourcesList()
            getResidentialIndustries();
          } else {
            alert(response.data.message)
          }
        },
        [auth.userId]
      )
    } else if (buildingName === "ХижинаРибака") {
      axios.get(`/api/build/fishermanHut?userId=${auth.userId}&werehouseId=${werehouseId}`).then(
        (response) => {
          if (response.data.bought) {
            getResourcesList()
            getResidentialIndustries();
          } else {
            alert(response.data.message)
          }
        },
        [auth.userId]
      )
    } else if (buildingName === "СидроВарня") {
      axios.get(`/api/build/cider?userId=${auth.userId}&werehouseId=${werehouseId}`).then(
        (response) => {
          if (response.data.bought) {
            getResourcesList()
            getResidentialIndustries();
          } else {
            alert(response.data.message)
          }
        },
        [auth.userId]
      )
    }

  });

  const buildInMarketplace = useCallback((marketplaceId, buildingName) => {
    if (buildingName === "Часовня") {
      axios.get(`/api/build/chapel?userId=${auth.userId}&marketplaceId=${marketplaceId}`).then(
        (response) => {
          if (response.data.bought) {
            getResourcesList()
            getResidentialIndustries();
          } else {
            alert(response.data.message)
          }
        },
        [auth.userId]
      )
    }
  });

  const buildInMarketplaceHouses = useCallback((marketplaceId, buildingName) => {
    if (buildingName === "СелянськаХата") {
      axios.get(`/api/build/peasantHut?userId=${auth.userId}&marketplaceId=${marketplaceId}`).then(
        (response) => {
          if (response.data.bought) {
            getResourcesList()
            getResidentialIndustries();
          } else {
            alert(response.data.message)
          }
        },
        [auth.userId]
      )
    }

  });

  const tikResources = () => {
    axios.get(`/api/tik/?userId=${auth.userId}`).then((response) => {
      if(response.data.ok) {
        getResourcesList();
        
      }
    });
  }



  useEffect(() => {
    getResourcesList();
    getResidentialIndustries()
    getBuildingsForBuild();
    
    setInterval(()=>{
      tikResources()
    }, 60000)
    
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
        <div className="residential">
        {marketplaces.map((marketplace, index) => (
          <div className="werehouseWrap" key={index}>
            <div className="werehouseImg">
              <img src={require(`../img/buildings/${marketplace.name}.webp`)}
                alt="icon" />
            </div>
            <div className="werehouseBuildings">
              <p>Зона резедентських будівель</p>
              {marketplace.places.map((place) => (
                <div className="werehouseBuildings_img">
                  <img src={require(`../img/buildings/${place.name}.webp`)} alt="icon" />
                </div>
              ))}
              {marketplace.places.length < 1 ? (<div className="werehouseBuildings_img">
                <img onClick={() => showBuildingsHandler(index)} src={require(`../img/buildings/Пусто.webp`)} alt="icon" />
                <p>Побудувати</p>
                {showBuildings.index === index && showBuildings.show ? (
                  <div className="allBuildings">
                    {buildingPricesRes.map((buildPrice) => (
                      <div onClick={() => buildInMarketplace(marketplace._id, buildPrice.name)} className="building_wrap">
                        <img src={require(`../img/buildings/${buildPrice.name}.webp`)} alt="icon" />
                        <p>{buildPrice.name}</p>
                        <div className="reresourcesNeedWrap">

                          {buildPrice.resources.map((resource) => (
                            <div className="resourcesNeed">
                              <img className='small_img' src={require(`../img/resources/${resource.name}.webp`)} alt="icon" />
                              <p className='small'>{resource.amount}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                  </div>) : null}
              </div>) : null}
              <p>Зона жилих будинків</p>
              {marketplace.residentPlaces.map((place) => (
                <div className="werehouseBuildings_img">
                  <img src={require(`../img/buildings/${place.name}.webp`)} alt="icon" />
                </div>
              ))}
              {marketplace.residentPlaces.length < 76 ? (<div className="werehouseBuildings_img">
                <img onClick={() => showBuildingsHandler(index)} src={require(`../img/buildings/Пусто.webp`)} alt="icon" />
                <p>Побудувати</p>
                {showBuildings.index === index && showBuildings.show ? (
                  <div className="allBuildings">
                    {buildingPricesHouse.map((buildPrice) => (
                      <div onClick={() => buildInMarketplaceHouses(marketplace._id, buildPrice.name)} className="building_wrap">
                        <img src={require(`../img/buildings/${buildPrice.name}.webp`)} alt="icon" />
                        <p>{buildPrice.name}</p>
                        <div className="reresourcesNeedWrap">

                          {buildPrice.resources.map((resource) => (
                            <div className="resourcesNeed">
                              <img className='small_img' src={require(`../img/resources/${resource.name}.webp`)} alt="icon" />
                              <p className='small'>{resource.amount}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                  </div>) : null}
              </div>) : null}
            </div>
          </div>
        ))}
        </div>
      <div className="industrial">{werehouses.map((werehouse, index) => (
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
                <p>Побудувати</p>
                {showBuildings.index === index && showBuildings.show ? (
                  <div className="allBuildings">
                    {buildingPricesInd.map((buildPrice) => (
                      <div onClick={() => buildInWerehouse(werehouse._id, buildPrice.name)} className="building_wrap">
                        <img src={require(`../img/buildings/${buildPrice.name}.webp`)} alt="icon" />
                        <p>{buildPrice.name}</p>
                        <div className="reresourcesNeedWrap">

                          {buildPrice.resources.map((resource) => (
                            <div className="resourcesNeed">
                              <img className='small_img' src={require(`../img/resources/${resource.name}.webp`)} alt="icon" />
                              <p className='small'>{resource.amount}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                  </div>) : null}
              </div>) : null}
            </div>
          </div>
        ))}</div>
        
        <button onClick={buildWerehouse}>купити склад</button>
        <button onClick={buildMarketplace}>купити Ринкову Площу</button>
      </div>
    </div>
  );
}
