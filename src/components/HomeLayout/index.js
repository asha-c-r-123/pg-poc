import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DashboardTable from "../Dashboard/FetchProject";
import { Container } from "react-bootstrap";
import PageLayout from "../Layout";

function HomeLayout() {
  return (
    <PageLayout>
      <Container className="data-table table-responsive">
        <DashboardTable />
      </Container>
    </PageLayout>
  );
}
export default HomeLayout;
