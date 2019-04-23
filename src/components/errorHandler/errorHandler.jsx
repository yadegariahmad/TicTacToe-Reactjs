/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import './errorHandler.scss';

const errorHandler = ({ error, close }) => (
  <Fragment>
    {error
      && (
        <div onClick={close} className="backdrop">
          <div className="error-container">
            <h4 className="error-message">{error}</h4>
          </div>
        </div>
      )
    }
  </Fragment>
);

errorHandler.propTypes = {
  error: PropTypes.string,
  close: PropTypes.func.isRequired,
};

errorHandler.defaultProps = {
  error: '',
};

export default errorHandler;
