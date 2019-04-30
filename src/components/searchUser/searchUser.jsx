import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import { get } from '../../util/request';
import './userSearch.scss';

const UserSearch = () =>
{
  const [searchInput, setSearchInput] = useState('');
  const [users, setUsers] = useState([]);

  const searchUser = (userName) =>
  {
    setSearchInput(userName);

    const body = {
      userName: searchInput,
    };
    get('user/search', JSON.stringify(body))
      .then(res => res.data)
      .then((resData) =>
      {
        if (resData.status === 200)
        {
          console.log(resData.content.users);

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

  const showUsers = users.map(user => (
    // eslint-disable-next-line no-underscore-dangle
    <li className="user-item" key={user._id}>
      <span className="user-name">{user.userName}</span>
      <i className={`online-status ${user.onlineStatus ? 'isOnline' : 'isOffline'}`} />
    </li>
  ));

  return (
    <div className="search">
      <div className="input-container">
        <input
          className="search-input"
          type="search"
          name="userName"
          value={searchInput}
          onChange={e => searchUser(e.target.value)}
          placeholder="Search user by userName"
          autoComplete="off"
        />
      </div>
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
