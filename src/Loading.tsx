import React from 'react';

interface LoadingProps {
  loading: boolean;
  left: number;
  top: number;
  size: number;
}

const Loading = (props: LoadingProps) => {
  return (
    <img
      src='./loading.gif'
      style={{
        position: 'absolute',
        left: props.left - props.size / 2,
        top: props.top - props.size / 2,
        height: props.size,
        opacity: 0.5,
        display: props.loading ? 'inline' : 'none',
      }}
      alt='source: https://tenor.com/view/loading-buffering-spinning-waiting-gif-17313179'
    />
  );
};

export default Loading;
