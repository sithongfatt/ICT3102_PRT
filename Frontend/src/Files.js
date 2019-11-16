import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";

export const filesQuery = gql`
  {
    yoloImage
    yoloLabel
  }
`;

export const Files = () => {
  console.log("Starting");
    console.log(filesQuery);
    console.log(useQuery(filesQuery));
  const { data, loading } = useQuery(filesQuery);
  console.log(loading);
  console.log(data);

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <div>Don't need an image</div>
    // Uncomment for image upload
    // <div>
    //   {data.files.map(x => (
    //     <img
    //       style={{ width: 200 }}
    //       key={x}
    //       src={`http://localhost:4000/images/${x}`}
    //       alt={x}
    //     />
    //   ))}
    // </div>
  );
};
