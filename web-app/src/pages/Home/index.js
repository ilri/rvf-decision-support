import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CarouselComponent from "../../components/Common/carousel.js";
import CardComponent from "./cardsDiv.js";
import AboutUs from "./aboutUs.js";
import Footer from "../../components/Common/footer.js";
import { homeBannerRequest, homeGenralToolsRequest } from "../../store/actions.js";
import GlobalLoader from "../../components/Common/GLobalLoader.js";

function Home() {
  const dispatch = useDispatch();

  const nextProps = useSelector((state) => ({
    homeBannerListData: state.Home.homeBannerData,
    generalToolsListData: state.Home.homeGenralTools,
    isLoading: state.Home.loading,
  }));

  const cardData = nextProps?.generalToolsListData;
  const carouselData = nextProps.homeBannerListData;

  useEffect(() => {
    dispatch(homeBannerRequest());
    dispatch(homeGenralToolsRequest());
  }, []);

  return (
    <div>
      <GlobalLoader loader={nextProps.isLoading} />
      <CarouselComponent carouselData={carouselData} />
      <CardComponent cardData={cardData} />
      <AboutUs />
      <Footer />
    </div>
  );
}

export default Home;
