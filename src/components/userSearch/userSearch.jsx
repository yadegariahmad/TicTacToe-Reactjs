import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import { post } from '../../util/request';
import './userSearch.scss';

const userSearch = () =>
{
  const [searchInput, setSearchInput] = useState('');
  const [users, setUsers] = useState([]);

  const searchUser = (userName) =>
  {
    setSearchInput(userName);

    post('user/search', searchInput)
      .then(res => res.data)
      .then((resData) =>
      {
        if (resData.status === 200)
        {
          console.log(resData);

          setUsers(resData.content);
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

  const showUsers = () => users.forEach(user => (
    <li className="user-item">
      <span className="user-name">{user.userName}</span>
      <i className={`online-status ${user.online ? 'isOnline' : 'isOffline'}`} />
    </li>
  ));

  return (
    <div className="search">
      <input
        className="search-input"
        type="search"
        name="userName"
        value={searchInput}
        onChange={e => searchUser(e.target.value)}
        placeholder="Search user by userName"
      />
      <div className="search-result">
        <ul className="users-list">
          {showUsers}
        </ul>
      </div>
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

export default userSearch;
