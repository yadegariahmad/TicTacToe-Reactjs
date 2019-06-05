import React, { useState, useContext } from 'react';
// import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import { post } from '../../util/request';
import { settingsContext, opponentContext } from '../../store';
import './userSearch.scss';

const UserSearch = () =>
{
  const [searchInput, setSearchInput] = useState('');
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useContext(settingsContext);
  const [opponent, setOpponent] = useContext(opponentContext);

  const searchUser = (userName) =>
  {
    setUsers([]);
    setSearchInput(userName);

    const body = {
      userName,
    };
    post('user/search', JSON.stringify(body))
      .then((resData) =>
      {
        if (resData.status === 200)
        {
          setUsers(resData.content.users);
        } else
        {
          throw new Error(resData.message);
        }
      })
      .catch((err) =>
      {
        console.log(err);
      });
  };

  const selectUser = (user) =>
  {
    setSettings({ ...settings, showLoader: true });

    const body = {
      userId: localStorage.getItem('userId'),
      opponentId: user._id,
    };
    post('game/sendRequest', JSON.stringify(body))
      .then((res) =>
      {
        setSettings({ ...settings, showLoader: false });
        if (res.status !== 200)
        {
          setSettings({ ...settings, error: `danger.${res.message}` });
        } else
        {
          setOpponent(user);
        }
      });
    // globalActions.setOpponent(user);
  };

  const showUsers = users.map(user => (
    <li className="user-item" key={user._id} onClick={() => selectUser(user)}>
      <span className="user-name">{user.userName}</span>
      <i className={`online-status ${user.onlineStatus ? 'is-online' : 'is-offline'}`} />
    </li>
  ));

  return (
    <div className="search">
      <Form.Control
        type="search"
        placeholder="Search opponent"
        value={searchInput}
        onChange={e => searchUser(e.target.value)}
        autoComplete="off"
      />
      {(users.length > 0 && searchInput.length > 0) && (
        <div className="search-result">
          <ul className="users-list">
            {!opponent && showUsers}
          </ul>
        </div>
      )}
    </div>
  );
};

// errorHandler.propTypes = {
//   error: PropTypes.string,
//   close: PropTypes.func.isRequired,
// };

// errorHandler.defaultProps = {
//   error: '',
// };

export default UserSearch;
