import React from "react";
import HomeLayout from "./components/HomeLayout";

const home = React.memo(() => {
  return (
    <>
      <HomeLayout />
    </>
  );
});

export default home;
