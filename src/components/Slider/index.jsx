import React, { memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { SliderContainer } from "./style";
import SwiperCore, { Pagination, Autoplay } from "swiper";
import "swiper/swiper-bundle.css";

SwiperCore.use([Pagination, Autoplay]);

const Slider = (props) => {
  const { bannerList } = props;

  return bannerList.length > 0 ? (
    <SliderContainer>
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        pagination={{ clickable: true }}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
      >
        {bannerList.map((item) => (
          <SwiperSlide key={item}>
            <img src={item.imageUrl} width="100%" height="100%" alt="推荐" />
          </SwiperSlide>
        ))}
      </Swiper>
    </SliderContainer>
  ) : null;
};

export default memo(Slider);
