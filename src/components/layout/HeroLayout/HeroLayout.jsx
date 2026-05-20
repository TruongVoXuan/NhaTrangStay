import Header from "components/layout/Header/Header";
import "./HeroLayout.scss";
import logoBack from "assets/images/logoBack.png";
import React from "react";
import { ReactTyped } from "react-typed";

const HeroLayout = ({ scrollRef }) => {

  const scrollToContent = () => {
    if (scrollRef?.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="hero-wrapper">
      <Header />

      <div className="hero-content">
        <div className="hero-left">
          {/* subtitle */}
          <p className="hero-subtitle">Hơn cả một nơi để ở</p>
          <div className="hero-divider"></div>

          {/* title */}
          <h1 className="hero-title">
            Nơi bạn tìm thấy cảm giác thuộc về
          </h1>

          {/* TEXT CHẠY */}
          <div className="hero-typed">
            <ReactTyped
              strings={[
                "Khám phá nơi ở phù hợp với bạn tại Nha Trang",
                "Không gian sống tiện nghi với mức giá hợp lý",
                "Bắt đầu hành trình an cư của bạn ngay hôm nay",
              ]}
              typeSpeed={50}
              backSpeed={30}
              loop
            />
          </div>

          {/* CTA */}
          <div className="explore-wrapper" onClick={scrollToContent}>
            <button className="explore-btn">
              Khám phá ngay
            </button>

            <div className="scroll-hand">👇</div>
          </div>
        </div>

        <div className="hero-right">
          <img src={logoBack} alt="house" />
        </div>
      </div>
    </div>
  );
};

export default HeroLayout;