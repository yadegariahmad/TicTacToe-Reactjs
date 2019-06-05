import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import { post } from '../../util/request';
import './userSearch.scss';

const UserSearch = () =>
{
  const [searchInput, setSearchInput] = useState('');
  const [users, setUsers] = useState([]);

  const searchUser = (userName) =>
  {
    setUsers([]);
    setSearchInput(userName);

    const body = {
      userName,
    };
    post('user/search', JSON.stringify(body))
      .then(res => res.data)
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

  };

  const showUsers = users.map(user => (
    <li className="user-item" key={user._id} onClick={selectUser(user)}>
      <span className="user-name">{user.userName}</span>
      <i className={`online-status ${user.onlineStatus ? 'isOnline' : 'isOffline'}`} />
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
            {showUsers}
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
