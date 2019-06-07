import React, { useState, useContext } from 'react';
// import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import { post, socket } from '../../util/request';
import { settingsContext, gameContext } from '../../store';
import './userSearch.scss';

const UserSearch = () =>
{
  const [searchInput, setSearchInput] = useState('');
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useContext(settingsContext);
  const [, setGame] = useContext(gameContext);

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

  const getResponse = (data, opponentId) =>
  {
    if (data.accept)
    {
      setGame({
        gameId: data.gameId,
        opponentId,
      });
    } else
    {
      setSettings({ ...settings, message: 'warning.Your request was not accepted.' });
    }
  };

  const selectUser = (selectedUser) =>
  {
    setSettings({ ...settings, showLoader: true });

    const body = {
      userId: localStorage.getItem('userId'),
      opponentId: selectedUser._id,
    };
    post('game/sendRequest', JSON.stringify(body))
      .then((res) =>
      {
        setSettings({ ...settings, showLoader: false });
        if (res.status !== 200)
        {
          setSettings({ ...settings, message: `danger.${res.message}` });
        } else
        {
          socket.on(`gameResponse-${body.userId}`, (data) =>
          {
            console.log('bbb');

            getResponse(data, selectedUser._id);
          });
        }
      });
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
        <ul className="users-list">
          {showUsers}
        </ul>
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
