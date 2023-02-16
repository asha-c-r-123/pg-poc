import React from "react";
import Dashboard from "./components/Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import PageLayout from "./components/Layout";
import PegaAPI from "./components/Dashboard/FetchProject/PegaAPI";

function Pega() {
  return (
    <PageLayout>
      <Container className="data-table table-responsive">
        <PegaAPI />
      </Container>
    </PageLayout>
  );
}
export default Pega;
