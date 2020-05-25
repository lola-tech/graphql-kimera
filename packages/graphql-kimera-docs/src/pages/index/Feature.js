import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import CodeBlock from "@theme/CodeBlock";
import useBaseUrl from "@docusaurus/useBaseUrl";

const propTypes = {
  imageUrl: PropTypes.string,
  title: PropTypes.node,
  description: PropTypes.node,
  code: PropTypes.string,
  metastring: PropTypes.string,
};

const FlexRow = styled.div`
  padding: 1rem 0;

  h3 {
    /* font-family: var(--ifm-heading-font-family); */
    font-weight: 400;
    font-size: 1.5rem;
    line-height: 1.5;
  }

  p {
    line-height: 1.7;
  }

  @media screen and (min-width: 966px) {
    display: flex;
    flex-direction: row;
  }
`;

const FlexColumn = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const FeatureImg = styled.img`
  height: 200px;
  width: 200px;
`;

function Feature({ imageUrl, title, description, code, metastring = "" }) {
  return (
    <FlexRow className="row">
      <FlexColumn className="col col--4">
        {imageUrl && <FeatureImg src={useBaseUrl(imageUrl)} alt={title} />}
        <h3>{title}</h3>
        <>{description}</>
      </FlexColumn>
      {code && (
        <div className="col col--8">
          <CodeBlock metastring={metastring}>{code}</CodeBlock>
        </div>
      )}
    </FlexRow>
  );
}
Feature.propTypes = propTypes;

export default Feature;
