import React from 'react';
import Loader from 'react-loader-spinner';

const styles = {
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '999',
    background: 'rgba(0, 0, 0, .3)',
  },
};

const PageLoader = () => (
  <div style={styles.container}>
    <Loader
      type="RevolvingDot"
      color="#09DD0C"
      height="100"
      width="100"
    />
  </div>
);

export default PageLoader;
