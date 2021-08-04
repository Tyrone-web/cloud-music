import { useRef, useState, useEffect, memo } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import MiniPlayer from "./MiniPlayer";
import NormalPlayer from "./NormalPlayer";
import {
  changePlayingState,
  changeShowPlayList,
  changeCurrentIndex,
  changeCurrentSong,
  changePlayList,
  changePlayMode,
  changeFullScreen,
} from "./store/actionCreators";

const Player = (props) => {
  const currentSong = {
    al: {
      picUrl:
        "https://p1.music.126.net/JL_id1CFwNJpzgrXwemh4Q==/109951164172892390.jpg",
    },
    name: "木偶人",
    ar: [{ name: "薛之谦" }],
  };

  const fullScreen = useSelector((state) =>
    state.getIn(["player", "fullScreen"])
  );
  const playing = useSelector((state) => state.getIn(["player", "playing"]));
  // const currentSong = useSelector((state) =>
  //   state.getIn(["player", "currentSong"])
  // );
  const showPlayList = useSelector((state) =>
    state.getIn(["player", "showPlayList"])
  );
  const mode = useSelector((state) => state.getIn(["player", "mode"]));
  const currentIndex = useSelector((state) =>
    state.getIn(["player", "currentIndex"])
  );
  const playList = useSelector((state) => state.getIn(["player", "playList"]));
  const sequencePlayList = useSelector((state) =>
    state.getIn(["player", "sequencePlayList"])
  );

  const dispatch = useDispatch();

  const toggleFullScreenDispatch = (data) => {
    dispatch(changeFullScreen(data));
  };

  return (
    <>
      <MiniPlayer
        song={currentSong}
        fullScreen={fullScreen}
        toggleFullScreen={toggleFullScreenDispatch}
      />
      <NormalPlayer
        song={currentSong}
        fullScreen={fullScreen}
        toggleFullScreen={toggleFullScreenDispatch}
      />
    </>
  );
};

// 映射 dispatch 到 props 上
const mapDispatchToProps = (dispatch) => {
  return {
    togglePlayingDispatch(data) {
      dispatch(changePlayingState(data));
    },
    toggleFullScreenDispatch(data) {
      dispatch(changeFullScreen(data));
    },
    togglePlayListDispatch(data) {
      dispatch(changeShowPlayList(data));
    },
    changeCurrentIndexDispatch(index) {
      dispatch(changeCurrentIndex(index));
    },
    changeCurrentDispatch(data) {
      dispatch(changeCurrentSong(data));
    },
    changeModeDispatch(data) {
      dispatch(changePlayMode(data));
    },
    changePlayListDispatch(data) {
      dispatch(changePlayList(data));
    },
  };
};

export default memo(Player);
