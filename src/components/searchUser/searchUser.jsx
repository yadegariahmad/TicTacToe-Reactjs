import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { post, socket } from '../../util/request';
import { settingsContext, gameContext } from '../../store';
import './userSearch.scss';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    borderRadius: '4px',
  },
}));

const UserSearch = () =>
{
  const classes = useStyles();

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
      id: localStorage.getItem('userId'),
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
        turn: localStorage.getItem('userId'),
        type: 'X',
      });
    } else
    {
      setSettings({ ...settings, message: 'Your request was not accepted.' });
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
          setSettings({ ...settings, message: `${res.message}` });
        } else
        {
          socket.on(`gameResponse-${body.userId}`, (data) =>
          {
            getResponse(data, selectedUser._id);
          });
        }
      });
  };

  const showUsers = users.map(user => (
    <ListItem button key={user._id} onClick={() => selectUser(user)}>
      <ListItemText primary={user.userName} />
      <i className={`online-status ${user.onlineStatus ? 'is-online' : 'is-offline'}`} />
    </ListItem>
  ));

  return (
    <div className="search">
      <TextField
        label="Users"
        placeholder="Search for opponent"
        onChange={e => searchUser(e.target.value)}
        margin="normal"
        variant="outlined"
      />
      {(users.length > 0 && searchInput.length > 0) && (
        <List className={classes.root}>
          {showUsers}
        </List>
      )}
    </div>
  );
};

export default UserSearch;
