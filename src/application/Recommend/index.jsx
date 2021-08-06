import { memo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import RecommendList from "./RecommendList";
import Slider from "../../components/Slider";
import * as actionTypes from "./store/actionCreators";
import Scroll from "../../baseUI/Scroll";
import { Content } from "./style";
import { forceCheck } from "react-lazyload";
import Loading from "../../baseUI/Loading";
import { renderRoutes } from "react-router-config";

// const Recommend = (props) => {
//   const { bannerList, recommendList } = props;
//   const { getBannerDataDispatch, getRecommendListDataDispatch } = props;

//   useEffect(() => {
//     getBannerDataDispatch();
//     getRecommendListDataDispatch();
//     // eslint-disable-next-line
//   }, []);

//   const bannerListJS = bannerList ? bannerList.toJS() : [];
//   const recommendListJS = recommendList ? recommendList.toJS() : [];

//   console.log(bannerListJS, "bannerListJS");
//   console.log(recommendListJS, "recommendListJS");
//   console.log("test");

//   return (
//     <Content>
//       <Scroll className="list" onScroll={() => console.log("test")}>
//         <div>
//           <Slider bannerList={bannerListJS}></Slider>
//           <RecommendList recommendList={recommendListJS}></RecommendList>
//         </div>
//       </Scroll>
//     </Content>
//   );
// };

// // 映射Redux全局的state到组件的props上
// const mapStateToProps = (state) => ({
//   // 不要在这里将数据 toJS
//   // 不然每次 diff 比对 props 的时候都是不一样的引用，还是导致不必要的重渲染，属于滥用 immutable
//   bannerList: state.getIn(["recommend", "bannerList"]),
//   recommendList: state.getIn(["recommend", "recommendList"]),
// });

// // 映射 dispatch 到 props 上
// const mapDispatchToProps = (dispatch) => {
//   return {
//     getBannerDataDispatch() {
//       dispatch(actionTypes.getBannerList());
//     },
//     getRecommendListDataDispatch() {
//       dispatch(actionTypes.getRecommendList());
//     },
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(memo(Recommend));

const Recommend = memo((props) => {
  const bannerList = useSelector((state) => {
    return state.getIn(["recommend", "bannerList"]);
  });
  const recommendList = useSelector((state) =>
    state.getIn(["recommend", "recommendList"])
  );
  const enterLoading = useSelector((state) =>
    state.getIn(["recommend", "enterLoading"])
  );
  const songsCount = useSelector(
    (state) => state.getIn(["player", "playList"]).size
  );

  const bannerListJS = bannerList ? bannerList.toJS() : [];
  const recommendListJS = recommendList ? recommendList.toJS() : [];
  const dispatch = useDispatch();
  useEffect(() => {
    if (!bannerListJS.length) {
      dispatch(actionTypes.getBannerList());
    }

    if (!recommendListJS.length) {
      dispatch(actionTypes.getRecommendList());
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Content play={songsCount}>
      <Scroll className="list" onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerListJS}></Slider>
          <RecommendList recommendList={recommendListJS}></RecommendList>
        </div>
      </Scroll>
      {enterLoading && <Loading />}
      {/* /将目前所在路由的下一层子路由加以渲染 */}
      {renderRoutes(props.route.routes)}
    </Content>
  );
});
export default Recommend;
