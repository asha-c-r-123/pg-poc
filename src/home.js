import React from "react";
import Dashboard from "./components/Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import PageLayout from "./components/Layout";

function Home() {
  return (
    <PageLayout>
      <Container className="data-table table-responsive">
        <Dashboard />
      </Container>
    </PageLayout>
  );
}
export default Home;
