import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Context from './Context';
import fetchApi from '../services/fetchApi';

const Provider = ({ children }) => {
  const [name, setName] = useState(null);
  const [planetList, setPlanetList] = useState(null);
  const [backupPlanetList, setBackupPlanetList] = useState(null);
  const [tableHeaders, setTableHeaders] = useState(null);
  const [filtersByNumericValues, setFiltersByNumericValues] = useState([]);
  const [order, setOrder] = useState({
    column: 'name',
    sort: 'ASC',
  });

  const filterTableContent = ({ results }) => {
    results.map((planet) => delete planet.residents);
    const tableData = results;
    setPlanetList(tableData);
    setBackupPlanetList(tableData);
  };

  const filterByValue = ({ column: columnFilter, comparison, value }) => {
    const filtredPlanets = planetList.filter((planet) => {
      const planetInfo = Number(planet[columnFilter]);
      if (comparison === 'menor que') {
        return planetInfo < value;
      }
      if (comparison === 'maior que') {
        return planetInfo > value;
      }
      return planetInfo === Number(value);
    });
    return setPlanetList(filtredPlanets);
  };

  useEffect(() => {
    const fetch = async () => {
      const response = await fetchApi();
      const headers = Object.keys(response.results[0]);
      setTableHeaders(headers);
      filterTableContent(response);
    };
    fetch();
  }, []);

  const contextValue = {
    data: {
      planetList,
      setPlanetList,
      tableHeaders,
      backupPlanetList,
    },
    filters: {
      filterByName: {
        name,
        setName,
      },
      filterByNumericValues: filtersByNumericValues,
      setFiltersByNumericValues,
      filtersValue: (filters) => {
        filterByValue(filters);
      },
    },
    order,
    setOrder,
  };

  return (
    <Context.Provider value={ contextValue }>
      {children}
    </Context.Provider>
  );
};

Provider.propTypes = {
  children: PropTypes.node,
}.isRequired;

export default Provider;
