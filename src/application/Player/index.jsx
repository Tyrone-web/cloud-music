import { useRef, useState, useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import MiniPlayer from "./MiniPlayer";
import NormalPlayer from "./NormalPlayer";
import { getSongUrl, isEmptyObject, findIndex, shuffle } from "../../api/utils";
import { playMode } from "../../api/config";
import Toast from "../../baseUI/Toast";
import {
  changePlayingState,
  // changeShowPlayList,
  changeCurrentIndex,
  changeCurrentSong,
  changePlayList,
  changePlayMode,
  changeFullScreen,
} from "./store/actionCreators";

const Player = (props) => {
  const [preSong, setPreSong] = useState({});
  const [modeText, setModeText] = useState("");

  const toastRef = useRef();

  const fullScreen = useSelector((state) =>
    state.getIn(["player", "fullScreen"])
  );
  const playing = useSelector((state) => state.getIn(["player", "playing"]));
  const currentSong = useSelector((state) =>
    state.getIn(["player", "currentSong"])
  );
  const currentSongJS = currentSong.toJS();
  // const showPlayList = useSelector((state) =>
  //   state.getIn(["player", "showPlayList"])
  // );
  const playList = useSelector((state) => state.getIn(["player", "playList"]));
  const playListJS = playList.toJS();
  const mode = useSelector((state) => state.getIn(["player", "mode"]));
  const currentIndex = useSelector((state) =>
    state.getIn(["player", "currentIndex"])
  );
  const sequencePlayList = useSelector((state) =>
    state.getIn(["player", "sequencePlayList"])
  );
  // const sequencePlayListJS = sequencePlayList.toJS();

  //目前播放时间
  const [currentTime, setCurrentTime] = useState(0);
  //歌曲总时长
  const [duration, setDuration] = useState(0);
  //歌曲播放进度
  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;

  const audioRef = useRef();

  const dispatch = useDispatch();

  const toggleFullScreenDispatch = (data) => {
    dispatch(changeFullScreen(data));
  };

  const clickPlaying = (e, state) => {
    e.stopPropagation();
    dispatch(changePlayingState(state));
  };

  const updateTime = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  const onProgressChange = (curPercent) => {
    const newTime = curPercent * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
    if (!playing) {
      dispatch(changePlayingState(true));
    }
  };

  const handleLoop = () => {
    audioRef.current.currentTime = 0;
    changePlayingState(true);
    audioRef.current.play();
  };

  const handlePrev = () => {
    //播放列表只有一首歌时单曲循环
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex - 1;
    if (index < 0) index = playList.length - 1;
    if (!playing) dispatch(changePlayingState(true));
    dispatch(changeCurrentIndex(index));
  };

  const handleNext = () => {
    //播放列表只有一首歌时单曲循环
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex + 1;
    if (index === playList.length) index = 0;
    if (!playing) dispatch(changePlayingState(true));
    dispatch(changeCurrentIndex(index));
  };

  const changeMode = () => {
    let newMode = (mode + 1) % 3;
    if (newMode === 0) {
      //顺序模式
      dispatch(changePlayList(sequencePlayList));
      // changePlayListDispatch(sequencePlayList);
      let index = findIndex(currentSong, sequencePlayList);
      dispatch(changeCurrentIndex(index));
      setModeText("顺序循环");
    } else if (newMode === 1) {
      //单曲循环
      dispatch(changePlayList(sequencePlayList));
      setModeText("单曲循环");
    } else if (newMode === 2) {
      //随机播放
      let newList = shuffle(sequencePlayList);
      let index = findIndex(currentSong, newList);
      dispatch(changePlayList(newList));
      dispatch(changeCurrentIndex(index));
      setModeText("随机播放");
    }
    dispatch(changePlayMode(newMode));
    toastRef.current.show();
  };

  const handleEnd = () => {
    if (mode === playMode.loop) {
      handleLoop();
    } else {
      handleNext();
    }
  };

  useEffect(() => {
    dispatch(changeCurrentIndex(0));
  }, [dispatch]);

  useEffect(() => {
    if (
      !playListJS.length ||
      currentIndex === -1 ||
      !playListJS[currentIndex] ||
      playListJS[currentIndex].id === preSong.id
    )
      return;
    let current = playListJS[currentIndex];
    dispatch(changeCurrentSong(current)); //赋值currentSong
    setPreSong(current);
    audioRef.current.src = getSongUrl(current.id);
    setTimeout(() => {
      audioRef.current.play();
    });
    dispatch(changePlayingState(true)); //播放状态
    setCurrentTime(0); //从头开始播放
    setDuration((current.dt / 1000) | 0); //时长
  }, [playListJS, currentIndex, preSong.id, dispatch]);

  useEffect(() => {
    playing ? audioRef.current.play() : audioRef.current.pause();
  }, [playing]);

  return (
    <>
      {!isEmptyObject(currentSongJS) && (
        <MiniPlayer
          song={currentSongJS}
          fullScreen={fullScreen}
          playing={playing}
          toggleFullScreen={toggleFullScreenDispatch}
          clickPlaying={clickPlaying}
        />
      )}
      {!isEmptyObject(currentSongJS) && (
        <NormalPlayer
          song={currentSongJS}
          fullScreen={fullScreen}
          playing={playing}
          duration={duration} //总时长
          currentTime={currentTime} //播放时间
          percent={percent} //进度
          toggleFullScreen={toggleFullScreenDispatch}
          clickPlaying={clickPlaying}
          onProgressChange={onProgressChange}
          handlePrev={handlePrev}
          handleNext={handleNext}
          mode={mode}
          changeMode={changeMode}
        />
      )}
      <audio
        onTimeUpdate={updateTime}
        ref={audioRef}
        onEnded={handleEnd}
      ></audio>
      <Toast text={modeText} ref={toastRef} />
    </>
  );
};

export default memo(Player);
