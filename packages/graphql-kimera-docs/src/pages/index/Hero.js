import React from "react";
import styled from "@emotion/styled";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  > .button {
    color: white;
    border: 0;
    background-color: var(--ifm-heading-color);
    &:hover {
      background-color: #a50d33;
    }
  }
`;

const Header = styled.div`
  padding: 4rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;

  background-color: #eeeef6;

  @media screen and (max-width: 966px) {
    padding: 2rem;
  }
`;

const Heading1 = styled.h1`
  img {
    height: 150px;
  }

  > span {
    position: absolute;
    left: -9999px;
  }
`;

const Hero = () => {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Header>
      <div className="container">
        <Heading1 className="hero__title">
          <img src={useBaseUrl("img/kimera-logo.svg")} alt="Kimera logo" />
          <span>{siteConfig.title}</span>
        </Heading1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <ButtonContainer>
          <Link
            className={"button button--lg"}
            to={useBaseUrl("/docs/getting-started")}
          >
            Get Started
          </Link>
        </ButtonContainer>
      </div>
    </Header>
  );
};

export default Hero;
